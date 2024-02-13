import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteUserResponse } from 'src/modules/users/dtos';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  public async create(user: Partial<User>): Promise<User> {
    return this.usersRepository.create(user);
  }

  public async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  public async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  public findOneWithUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email: username } });
  }

  public findOneWithEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email: email } });
  }

  public async update(id: string, user: User): Promise<User> {
    const userToUpdate = await this.usersRepository.findOne({ where: { id } });
    await this.usersRepository.update(id, user);
    return userToUpdate;
  }

  public async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  public async remove(id: string): Promise<DeleteUserResponse> {
    await this.usersRepository.delete({ id });

    return { success: true, message: 'User removed successfully' };
  }
}
