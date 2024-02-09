import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdatePasswordResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
