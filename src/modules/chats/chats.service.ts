import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { PaginationInput } from '../messages/dtos/pagination.input';
import { Message } from '../messages/entities/message.entity';
import { SearchService } from '../search/search.service';
import { User } from '../users/entities/user.entity';
import { ChatsRepository } from './chats.repository';
import { CreateChatInput } from './dtos/create-chat.input';
import { UpdateChatInput } from './dtos/update-chat.input';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    @InjectEntityManager()
    private readonly dataSource: DataSource,
    private readonly searchService: SearchService,
  ) {}

  public async create(
    createChatInput: CreateChatInput,
    workspaceId: string,
    userId: string,
  ) {
    const chat = await this.chatsRepository.create({
      ...createChatInput,
      user: {
        id: userId,
      },
      workspace: {
        id: workspaceId,
      },
    });
    await this.searchService.indexDocument('chats', chat.id, chat);
    return this.chatsRepository.save(chat);
  }
  public async searchChats(query: any): Promise<Chat[]> {
    // Perform Elasticsearch search
    const searchResults = await this.searchService.search('chats', query);

    // Map Elasticsearch search results to Chat entities
    return searchResults.hits.hits.map((hit) => hit._source);
  }

  public async findAll() {
    return this.chatsRepository.findAll();
  }

  public async paginateChats(pagination: PaginationInput): Promise<Chat[]> {
    const { skip, take, limit, sortBy, sortOrder, search } = pagination;

    const actualTake = limit ? Math.min(take, limit) : take;

    const queryBuilder = this.chatsRepository.createQueryBuilder('chat');

    if (sortBy) {
      queryBuilder.orderBy(`chat.${sortBy}`, sortOrder || 'ASC');
    }

    if (search) {
      queryBuilder.where('chat.content LIKE :search', {
        search: `%${search}%`,
      });
    }

    return queryBuilder.skip(skip).take(actualTake).getMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} chat`;
  }

  update(id: string, updateChatInput: UpdateChatInput) {
    console.log(updateChatInput);
    return `This action updates a #${id} chat`;
  }

  remove(id: string) {
    return `This action removes a #${id} chat`;
  }

  public async createChatWithInitialMessage(
    createChatInput: CreateChatInput,
    workspaceId: string,
    user: User,
  ): Promise<Chat> {
    const createdChat: Chat = null;
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const createdChat = await this.create(
        createChatInput,
        workspaceId,
        user.id,
      );
      // Send the initial message
      await this.sendInitialMessage(user, createdChat, queryRunner);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return createdChat;
  }

  private async sendInitialMessage(
    user: User,
    chat: Chat,
    queryRunner: QueryRunner,
  ): Promise<Message> {
    const initialMessageContent = 'Hello 👋';
    const message = new Message();
    message.user = user;
    message.chat = chat;
    message.content = initialMessageContent;
    return await queryRunner.manager.save(Message, message);
  }
}
