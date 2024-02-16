import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dtos/create-chat.input';
import { UpdateChatInput } from './dtos/update-chat.input';
import { ChatsRepository } from './chats.repository';
import { PaginationInput } from '../messages/dtos/pagination.input';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}
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

    return this.chatsRepository.save(chat);
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
}
