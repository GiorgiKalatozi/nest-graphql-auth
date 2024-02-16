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
import { PaginationInput } from './dtos/pagination.input';
import { UpdateMessageInput } from './dtos/update-message.input';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => Message)
  public async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @Args('chatId') chatId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.messagesService.create(createMessageInput, chatId, userId);
  }

  @Query(() => [Message], { name: 'messages' })
  public async findAll() {
    return this.messagesService.findAll();
  }

  @Query(() => [Message], { name: 'paginateMessages' })
  public async getMessages(
    @Args('pagination') pagination: PaginationInput,
  ): Promise<Message[]> {
    return this.messagesService.getMessages(pagination);
  }

  @Query(() => Message, { name: 'message' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.messagesService.findOne(id);
  }

  @Mutation(() => Message)
  updateMessage(
    @Args('updateMessageInput') updateMessageInput: UpdateMessageInput,
  ) {
    return this.messagesService.update(
      updateMessageInput.id,
      updateMessageInput,
    );
  }

  @Mutation(() => Message)
  removeMessage(@Args('id') id: string) {
    return this.messagesService.remove(id);
  }

  @Subscription(() => Message)
  public messageAdded() {
    return this.pubSub.asyncIterator('messageAdded');
  }

  @Subscription(() => Message)
  public messageRemoved() {
    return this.pubSub.asyncIterator('messageRemoved');
  }
}
