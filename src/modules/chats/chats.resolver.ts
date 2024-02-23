import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, CurrentUserId } from 'src/common/decorators';
import { PaginationInput } from '../messages/dtos/pagination.input';
import { User } from '../users/entities/user.entity';
import { ChatsService } from './chats.service';
import { CreateChatInput } from './dtos/create-chat.input';
import { UpdateChatInput } from './dtos/update-chat.input';
import { Chat } from './entities/chat.entity';

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}

  @Mutation(() => Chat)
  public createChat(
    @Args('createChatInput') createChatInput: CreateChatInput,
    @Args('workspaceId') workspaceId: string,
    @CurrentUserId() userId: string,
  ): Promise<Chat> {
    return this.chatsService.create(createChatInput, workspaceId, userId);
  }
  @Mutation(() => Chat)
  public createChatWithInitialMessage(
    @Args('createChatInput') createChatInput: CreateChatInput,
    @Args('workspaceId') workspaceId: string,
    @CurrentUser() user: User,
  ): Promise<Chat> {
    return this.chatsService.createChatWithInitialMessage(
      createChatInput,
      workspaceId,
      user,
    );
  }

  @Query(() => [Chat])
  public async paginateChats(
    @Args('pagination') pagination: PaginationInput,
  ): Promise<Chat[]> {
    return this.chatsService.paginateChats(pagination);
  }

  @Query(() => [Chat], { name: 'chats' })
  public findAll() {
    return this.chatsService.findAll();
  }

  @Query(() => Chat, { name: 'chat' })
  findOne(@Args('id') id: string) {
    return this.chatsService.findOne(id);
  }

  @Mutation(() => Chat)
  updateChat(@Args('updateChatInput') updateChatInput: UpdateChatInput) {
    return this.chatsService.update(updateChatInput.id, updateChatInput);
  }

  @Mutation(() => Chat)
  removeChat(@Args('id') id: string) {
    return this.chatsService.remove(id);
  }
}
