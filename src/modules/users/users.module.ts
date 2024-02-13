import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule],

  providers: [UsersResolver, UsersService, UsersRepository, RolesGuard],
})
export class UsersModule {}
