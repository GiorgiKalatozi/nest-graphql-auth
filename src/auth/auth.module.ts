import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './services/auth.service';
import { UsersRepository } from 'src/common/repositories/users.repository';

@Module({
  providers: [AuthResolver, AuthService, JwtService, UsersRepository],
})
export class AuthModule {}
