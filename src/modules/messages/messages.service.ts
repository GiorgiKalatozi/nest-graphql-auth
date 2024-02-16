import { Injectable, NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CreateMessageInput } from './dtos/create-message.input';
import { PaginationInput } from './dtos/pagination.input';
import { UpdateMessageInput } from './dtos/update-message.input';
import { Message } from './entities/message.entity';
import { MessagesRepository } from './messages.repository';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
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
    return this.messagesRepository.findAll();
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
