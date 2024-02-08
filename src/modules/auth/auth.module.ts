import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/common/repositories/users.repository';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './services/auth.service';
import { BcryptService } from './services/bcrypt.service';
import { HashingService } from './services/hashing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AccessTokenStrategy } from './strategies/access-token.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    AuthResolver,
    AuthService,
    JwtService,
    UsersRepository,
    AccessTokenStrategy,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
})
export class AuthModule {}
