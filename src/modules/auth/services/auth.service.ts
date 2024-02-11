import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/common/repositories/users.repository';
import {
  RefreshTokensInput,
  SignInInput,
  SignOutInput,
  SignUpInput,
} from '../dtos';
import {
  SignOutResponse,
  SignResponse,
  TokensResponse,
  UpdatePasswordResponse,
} from '../models';
import { HashingService } from './hashing.service';
import { UpdatePasswordInput } from '../dtos/update-password.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  public async signUp(signUpInput: SignUpInput): Promise<SignResponse> {
    const userExists = await this.usersRepository.findOneWithEmail(
      signUpInput.email,
    );

    if (userExists) {
      throw new ConflictException('User already exists.');
    }

    const hashedPassword = await this.hashingService.hash(signUpInput.password);

    const user = await this.usersRepository.create({
      email: signUpInput.email,
      username: signUpInput.username,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
      user.role,
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  public async signIn(signInInput: SignInInput): Promise<SignResponse> {
    const user = await this.usersRepository.findOneWithEmail(signInInput.email);
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }

    const passwordMatches = await this.hashingService.compare(
      signInInput.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Password does not match');
    }

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
      user.role,
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user };
  }

  public async signOut(signOutInput: SignOutInput): Promise<SignOutResponse> {
    const { userId } = signOutInput;
    const user = await this.usersRepository.findOne(userId);

    if (!user.refreshToken) return;

    user.refreshToken = null;

    await this.usersRepository.save(user);
    return { signedOut: true };
  }

  public async updatePassword(
    updatePasswordInput: UpdatePasswordInput,
    userId: string,
  ): Promise<UpdatePasswordResponse> {
    const { currentPassword, newPassword, confirmNewPassword } =
      updatePasswordInput;

    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const currentPasswordValid = await this.hashingService.compare(
      currentPassword,
      user.password,
    );

    if (!currentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match.',
      );
    }

    const hashedPassword = await this.hashingService.hash(newPassword);

    user.password = hashedPassword;

    await this.usersRepository.save(user);

    return { success: true, message: 'Password updated successfully' };
  }

  public async refreshTokens(
    refreshTokensInput: RefreshTokensInput,
  ): Promise<TokensResponse> {
    const { userId, refreshToken } = refreshTokensInput;
    const user = await this.usersRepository.findOne(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied.');
    }

    const refreshTokenMatches = await this.hashingService.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied.');
    }

    const tokens = await this.createTokens(user.id, user.email, user.role);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async createTokens(userId: string, email: string, role: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
        role,
      },
      {
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      },
    );

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashedRefreshToken = await this.hashingService.hash(refreshToken);

    user.refreshToken = hashedRefreshToken;

    await this.usersRepository.save(user);
  }
}
