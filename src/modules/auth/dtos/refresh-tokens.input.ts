import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RefreshTokensInput {
  @Field()
  userId: string;

  @Field()
  refreshToken: string;
}
