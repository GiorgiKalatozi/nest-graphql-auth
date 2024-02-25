import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsRepository } from './chats.repository';
import { ChatsResolver } from './chats.resolver';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { SearchService } from '../search/search.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), SearchModule],
  providers: [ChatsResolver, ChatsService, ChatsRepository, SearchService],
})
export class ChatsModule {}
