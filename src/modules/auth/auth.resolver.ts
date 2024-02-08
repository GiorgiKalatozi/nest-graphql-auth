import { HttpCode, HttpStatus, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import { SignInInput, SignOutInput, SignUpInput } from './dtos';
import { SignOutResponse, SignResponse, TokensResponse, User } from './models';
import { signInSchema, signUpSchema } from './schemas';
import { AuthService } from './services/auth.service';
import { RefreshTokenGuard } from './guards';

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

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => TokensResponse)
  @HttpCode(HttpStatus.OK)
  public refreshTokens(
    @CurrentUserId() userId: string,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens({ userId, refreshToken });
  }
}
