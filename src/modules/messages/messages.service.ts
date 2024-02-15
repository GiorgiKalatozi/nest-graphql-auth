import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dtos/create-message.input';
import { UpdateMessageInput } from './dtos/update-message.input';
import { Message } from './entities/message.entity';
import { MessagesRepository } from './messages.repository';

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

  findAll() {
    return `This action returns all messages`;
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
