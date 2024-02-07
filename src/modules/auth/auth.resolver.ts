import { HttpCode, HttpStatus, UsePipes } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import { User } from '../users/entities/user.entity';
import {
  RefreshTokensInput,
  SignInInput,
  SignOutInput,
  SignOutResponse,
  SignResponse,
  SignUpInput,
} from './dtos';
import { signInSchema, signUpSchema } from './schemas';
import { AuthService } from './services/auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignResponse)
  @UsePipes(new JoiValidationPipe(signUpSchema))
  @HttpCode(HttpStatus.CREATED)
  public signUp(
    @Args('signUpInput') signUpInput: SignUpInput,
  ): Promise<SignResponse> {
    return this.authService.signUp(signUpInput);
  }

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
}
