import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/common/repositories/users.repository';
import { SignInInput, SignOutInput, SignResponse, SignUpInput } from '../dtos';
import { HashingService } from './hashing.service';
import { SignOutResponse } from '../dtos/sign-out.output';
import { RefreshTokensInput } from '../dtos/refresh-tokens.input';

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
    );

    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
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

  public async refreshTokens(
    refreshTokensInput: RefreshTokensInput,
  ): Promise<SignResponse> {
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

    const tokens = await this.createTokens(user.id, user.email);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, user };
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // update(id: number, updateAuthInput: UpdateAuthInput) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private async createTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '10s',
        // expiresIn: this.configService.get("ACCESS_TOKEN_EXPIRATION_TIME"),
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
