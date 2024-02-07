import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignOutResponse {
  @Field()
  signedOut: boolean;
}
