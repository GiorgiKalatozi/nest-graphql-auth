import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { Message } from '../entities/message.entity';
import { MessagesService } from '../messages.service';

@Injectable({ scope: Scope.REQUEST })
export class MessageLoader extends DataLoader<string, Message[]> {
  constructor(private readonly messagesService: MessagesService) {
    super((keys) => this.batchLoadFn(keys));
  }

  private async batchLoadFn(
    messageIds: readonly string[],
  ): Promise<Message[][]> {
    const messages = await this.messagesService.find({
      select: ['id'], // select only id, becuse we don't need whole object
      relations: {
        user: true, // fetch who sent message
        chat: true, // fetch related chat
      },
      where: {
        id: In(messageIds as string[]), // to make sure we only query requested messages
      },
    });

    return messages.map((message) => [message]);
  }
}
