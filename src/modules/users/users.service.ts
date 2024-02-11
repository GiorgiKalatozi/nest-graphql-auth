import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/common/repositories/users.repository';
import { User } from '../auth/models';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  public async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  public async remove(id: string) {
    this.usersRepository.remove(id);
  }
}
