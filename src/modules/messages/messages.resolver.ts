import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUserId } from 'src/common/decorators';
import { CreateMessageInput } from './dtos/create-message.input';
import { UpdateMessageInput } from './dtos/update-message.input';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => Message)
  createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @Args('chatId') chatId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.messagesService.create(createMessageInput, chatId, userId);
  }

  @Query(() => [Message], { name: 'messages' })
  findAll() {
    return this.messagesService.findAll();
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
  removeMessage(@Args('id', { type: () => Int }) id: number) {
    return this.messagesService.remove(id);
  }
}
