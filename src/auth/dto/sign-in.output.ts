import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class SignInOutput {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  user: User;
}
