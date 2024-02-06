import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { SignUpInput } from './sign-up.input';

@InputType()
export class UpdateAuthInput extends PartialType(SignUpInput) {
  @Field(() => Int)
  id: number;
}
