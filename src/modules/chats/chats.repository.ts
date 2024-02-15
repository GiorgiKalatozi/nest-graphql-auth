import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { DeleteUserResponse } from '../users/dtos';

@Injectable()
export class ChatsRepository {
  constructor(
    @InjectRepository(Chat) private readonly chatsRepository: Repository<Chat>,
  ) {}
  public async create(chat: Partial<Chat>): Promise<Chat> {
    return this.chatsRepository.create(chat);
  }

  public async findAll(): Promise<Chat[]> {
    return this.chatsRepository.find();
  }

  public async findOne(id: string): Promise<Chat> {
    return this.chatsRepository.findOne({ where: { id } });
  }

  public async update(id: string, chat: Chat): Promise<Chat> {
    const chatToUpdate = await this.chatsRepository.findOne({ where: { id } });
    await this.chatsRepository.update(id, chat);
    return chatToUpdate;
  }

  public async save(chat: Chat): Promise<Chat> {
    return await this.chatsRepository.save(chat);
  }

  public async remove(id: string): Promise<DeleteUserResponse> {
    await this.chatsRepository.delete({ id });

    return { success: true, message: 'chat removed successfully' };
  }
}
