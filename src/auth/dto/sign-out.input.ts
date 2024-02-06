import { CreateAuthInput } from './sign-up.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAuthInput extends PartialType(CreateAuthInput) {
  @Field(() => Int)
  id: number;
}
