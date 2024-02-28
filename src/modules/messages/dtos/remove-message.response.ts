import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveMessageResponse {
  @Field()
  success: true;

  @Field()
  message: string;
}
