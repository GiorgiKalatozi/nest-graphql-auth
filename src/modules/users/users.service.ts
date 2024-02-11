import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from 'src/common/repositories/users.repository';
import { User } from '../auth/models';
import { DeleteUserResponse } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  public async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  public async remove(id: string): Promise<DeleteUserResponse> {
    const existingUser = await this.usersRepository.findOne(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.usersRepository.remove(id);
  }
}
