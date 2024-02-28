import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUserId } from 'src/common/decorators';
import { CreateMessageInput } from './dtos/create-message.input';
import { MessageResponse } from './dtos/message.response';
import { PaginationInput } from './dtos/pagination.input';
import { RemoveMessageResponse } from './dtos/remove-message.response';
import { UpdateMessageInput } from './dtos/update-message.input';
import { MessagesService } from './messages.service';

@Resolver(() => MessageResponse)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => MessageResponse)
  public async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @Args('chatId') chatId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.messagesService.create(createMessageInput, chatId, userId);
  }

  @Query(() => [MessageResponse], { name: 'messages' })
  public async findAll() {
    return this.messagesService.findAll();
  }

  @Query(() => [MessageResponse], { name: 'paginateMessages' })
  public async getMessages(
    @Args('pagination') pagination: PaginationInput,
  ): Promise<MessageResponse[]> {
    return this.messagesService.getMessages(pagination);
  }

  @Query(() => MessageResponse, { name: 'message' })
  public findOne(@Args('id', { type: () => Int }) id: number) {
    return this.messagesService.findOne(id);
  }

  @Mutation(() => MessageResponse)
  public updateMessage(
    @Args('updateMessageInput') updateMessageInput: UpdateMessageInput,
  ) {
    return this.messagesService.update(
      updateMessageInput.id,
      updateMessageInput,
    );
  }

  @Mutation(() => RemoveMessageResponse)
  public removeMessage(@Args('id') id: string): Promise<RemoveMessageResponse> {
    return this.messagesService.remove(id);
  }

  @Subscription(() => MessageResponse)
  public messageAdded() {
    return this.pubSub.asyncIterator('messageAdded');
  }

  @Subscription(() => MessageResponse)
  public messageRemoved() {
    return this.pubSub.asyncIterator('messageRemoved');
  }
}
