import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dtos/create-chat.input';
import { UpdateChatInput } from './dtos/update-chat.input';
import { ChatsRepository } from './chats.repository';

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
