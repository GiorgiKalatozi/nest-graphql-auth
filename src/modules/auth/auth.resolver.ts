import { HttpCode, HttpStatus, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';

import {
  RefreshTokensInput,
  SignInInput,
  SignOutInput,
  SignUpInput,
} from './dtos';
import { SignOutResponse, SignResponse, User } from './models';
import { signInSchema, signUpSchema } from './schemas';
import { AuthService } from './services/auth.service';
import { Public } from 'src/common/decorators/public.decorator';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SignResponse)
  @UsePipes(new JoiValidationPipe(signUpSchema))
  @HttpCode(HttpStatus.CREATED)
  public signUp(
    @Args('signUpInput') signUpInput: SignUpInput,
  ): Promise<SignResponse> {
    return this.authService.signUp(signUpInput);
  }

  @Public()
  @Mutation(() => SignResponse)
  @UsePipes(new JoiValidationPipe(signInSchema))
  @HttpCode(HttpStatus.CREATED)
  public signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => SignOutResponse)
  @HttpCode(HttpStatus.OK)
  public signOut(@Args('signOutInput') signOutInput: SignOutInput) {
    return this.authService.signOut(signOutInput);
  }

  @Mutation(() => SignResponse)
  @HttpCode(HttpStatus.OK)
  public refreshTokens(
    @Args('refreshTokensInput') refreshTokensInput: RefreshTokensInput,
  ) {
    return this.authService.refreshTokens(refreshTokensInput);
  }

  @Query(() => String)
  public hello() {
    return 'hello world';
  }
}
