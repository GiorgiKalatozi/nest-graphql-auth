import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from 'src/common/repositories/users.repository';
import { User } from '../users/entities/user.entity';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './services/auth.service';
import { BcryptService } from './services/bcrypt.service';
import { HashingService } from './services/hashing.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    AuthResolver,
    AuthService,
    JwtService,
    UsersRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
})
export class AuthModule {}
