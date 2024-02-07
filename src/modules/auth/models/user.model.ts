import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  role: string;
}
