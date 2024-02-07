import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignOutInput {
  @Field()
  user_id: string;
}
