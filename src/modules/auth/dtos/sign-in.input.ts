import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
