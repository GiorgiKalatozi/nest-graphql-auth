import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageResponse {
  @Field()
  id: string;

  @Field()
  content: string;
}
