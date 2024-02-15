import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from 'src/common/enums';
import { User } from '../auth/models';
import { DeleteUserResponse } from './dtos';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  public async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  public async assignAdminRole(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = Role.ADMIN;
    return this.usersRepository.save(user);
  }

  public async revokeAdminRole(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = Role.USER;
    return this.usersRepository.save(user);
  }

  public async remove(id: string): Promise<DeleteUserResponse> {
    const existingUser = await this.usersRepository.findOne(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.usersRepository.remove(id);
  }
}
