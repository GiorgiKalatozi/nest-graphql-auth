import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Int)
  skip = 0;

  @Field(() => Int)
  take = 25;

  @Field(() => Int, { nullable: true })
  limit?: number;
}
