import { HttpCode, HttpStatus, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, CurrentUserId } from 'src/common/decorators';
import { Public } from 'src/common/decorators/public.decorator';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import { SignInInput, SignOutInput, SignUpInput } from './dtos';
import { UpdatePasswordInput } from './dtos/update-password.input';
import { RefreshTokenGuard } from './guards';
import {
  SignOutResponse,
  SignResponse,
  TokensResponse,
  UpdatePasswordResponse,
  User,
} from './models';
import { signInSchema, signUpSchema } from './schemas';
import { AuthService } from './services/auth.service';

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

  @Mutation(() => UpdatePasswordResponse)
  @HttpCode(HttpStatus.CREATED)
  public updatePassword(
    @Args('updatePasswordInput') updatePasswordInput: UpdatePasswordInput,
    @CurrentUser('userId') userId: string,
  ) {
    return this.authService.updatePassword(updatePasswordInput, userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => TokensResponse)
  @HttpCode(HttpStatus.OK)
  public refreshTokens(
    @CurrentUser('refreshToken') refreshToken: string,
    @CurrentUserId() userId: string,
  ) {
    return this.authService.refreshTokens({ refreshToken, userId });
  }

  @Query(() => String)
  hello() {
    return 'hello world';
  }
}
