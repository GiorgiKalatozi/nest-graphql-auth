import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from '../search/search.module';
import { SearchService } from '../search/search.service';
import { ChatsRepository } from './chats.repository';
import { ChatsResolver } from './chats.resolver';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), SearchModule],
  providers: [ChatsResolver, ChatsService, ChatsRepository, SearchService],
})
export class ChatsModule {}
