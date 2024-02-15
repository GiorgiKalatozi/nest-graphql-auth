import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Chat {
  @Field()
  name: string;
}
