import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/common/repositories/users.repository';
import { SignUpInput } from '../dtos';
import { HashingService } from './hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  public async signup(signUpInput: SignUpInput) {
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
    // return this.usersRepository.create(signUpInput);
  }

  findAll() {
    return `This action returns all auth`;
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

  private async createTokens(userId: number, email: string) {
    const accessToken = this.jwtService.sign({
      userId,
      email,
    });

    const refreshToken = this.jwtService.sign({
      userId,
      email,
      accessToken,
    });

    return { accessToken, refreshToken };
  }
}
