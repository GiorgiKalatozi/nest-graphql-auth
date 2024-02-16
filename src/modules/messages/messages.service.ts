import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dtos/create-message.input';
import { UpdateMessageInput } from './dtos/update-message.input';
import { Message } from './entities/message.entity';
import { MessagesRepository } from './messages.repository';
import { PaginationInput } from './dtos/pagination.input';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}
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

    return this.messagesRepository.save(message);
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

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
