import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  QueryRunner,
} from 'typeorm';
import { Chat } from '../chats/entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { CreateMessageInput } from './dtos/create-message.input';
import { PaginationInput } from './dtos/pagination.input';
import { UpdateMessageInput } from './dtos/update-message.input';
import { Message } from './entities/message.entity';
import { MessagesRepository } from './repositories/messages.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly entityManager: EntityManager,
    private readonly dataSource: DataSource,
    private readonly pubSub: PubSub,
  ) {}
  public async create(
    createMessageInput: CreateMessageInput,
    chatId: string,
    userId: string,
  ): Promise<Message> {
    const message = await this.messagesRepository.create({
      ...createMessageInput,
      chat: {
        id: chatId,
      },
      user: {
        id: userId,
      },
    });

    const newMessage = await this.messagesRepository.save(message);
    this.pubSub.publish('messageAdded', { messageAdded: newMessage });
    return newMessage;
  }

  // async sendMessage(payload: SendMessageDto): Promise<Message> {
  //   let createdMessage: Message = null;
  //   const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

  //   try {
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();

  //     const { user, chat, workspace, content } = payload;

  //     // Save the message
  //     createdMessage = await this.createMessageTransaction(
  //       user,
  //       chat,
  //       content,
  //       queryRunner,
  //     );

  //     // Add the message to the chat's messages array
  //     chat.messages.push(createdMessage);
  //     await queryRunner.manager.save(Chat, chat);

  //     await queryRunner.commitTransaction();
  //     return createdMessage;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  public async createMessageTransaction(
    user: User,
    chat: Chat,
    content: string,
    queryRunner: QueryRunner,
  ): Promise<Message> {
    return await queryRunner.manager.save(Message, { user, chat, content });
  }

  public async getMessages(pagination: PaginationInput): Promise<Message[]> {
    const { skip, take, limit, sortBy, sortOrder, search } = pagination;

    const actualTake = limit ? Math.min(take, limit) : take;

    const queryBuilder = this.messagesRepository.createQueryBuilder('message');

    if (sortBy) {
      queryBuilder.orderBy(`message.${sortBy}`, sortOrder || 'ASC');
    }

    if (search) {
      queryBuilder.where('message.content LIKE :search', {
        search: `%${search}%`,
      });
    }

    return queryBuilder.skip(skip).take(actualTake).getMany();
  }

  public async findAll() {
    const cachedMessages = await this.cacheManager.get<Message[]>('messages');

    if (cachedMessages) {
      return cachedMessages;
    }

    const messages = await this.messagesRepository.findAll();

    // Cache the messages
    await this.cacheManager.set('messages', messages, 60000); // Cache for 60 seconds

    return messages;
    // return this.messagesRepository.findAll();
  }

  public async find(data: FindManyOptions<Message>) {
    return this.messagesRepository.find(data);
  }

  public count() {
    return this.messagesRepository.count();
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageInput: UpdateMessageInput) {
    console.log(updateMessageInput);
    return `This action updates a #${id} message`;
  }

  public async remove(id: string) {
    const deleteResult = await this.messagesRepository.remove(id);

    if (!deleteResult) {
      throw new NotFoundException(`Message with ID ${id} not found.`);
    }

    this.pubSub.publish('messageRemoved', { messageRemoved: deleteResult });
    return 'message was deleted successfully';
  }
}
