import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessagesRepository } from './messages.repository';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessagesResolver, MessagesService, MessagesRepository],
})
export class MessagesModule {}
