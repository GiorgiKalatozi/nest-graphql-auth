import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePasswordInput {
  @Field()
  currentPassword: string;

  @Field()
  newPassword: string;

  @Field()
  confirmNewPassword: string;
}
