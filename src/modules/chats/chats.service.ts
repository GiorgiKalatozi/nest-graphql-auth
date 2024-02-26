import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DataSource, QueryRunner } from 'typeorm';
import { PaginationInput } from '../messages/dtos/pagination.input';
import { Message } from '../messages/entities/message.entity';
import { SearchService } from '../search/search.service';
import { ChatsRepository } from './chats.repository';
import { CreateChatInput } from './dtos/create-chat.input';
import { UpdateChatInput } from './dtos/update-chat.input';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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
    const cachedChats = await this.cacheManager.get<Chat[]>('chats');

    if (cachedChats) {
      return cachedChats;
    }

    const chats = await this.chatsRepository.findAll();

    await this.cacheManager.set('chats', chats, 50000);

    return chats;
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
    userId: string,
  ): Promise<Chat> {
    let createdChat: Chat;

    const queryRunner = this.chatsRepository.queryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      createdChat = await this.create(createChatInput, workspaceId, userId);

      await this.sendInitialMessage(userId, createdChat, queryRunner);

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
    userId: string,
    chat: Chat,
    queryRunner: QueryRunner,
  ): Promise<Message> {
    const initialMessageContent = 'Hello 👋';
    const message = new Message();
    message.user = { id: userId };
    message.chat = chat;
    message.content = initialMessageContent;

    return queryRunner.manager.save(message);
  }
}
