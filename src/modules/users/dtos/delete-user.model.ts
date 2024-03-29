import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteUserResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
