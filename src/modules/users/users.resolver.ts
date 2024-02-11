import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { User } from '../auth/models';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  public findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @Roles(Role.ADMIN)
  public findOne(@Args('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  @Roles(Role.ADMIN)
  public assignAdminRole(@Args('id') id: string): Promise<User> {
    return this.usersService.assignAdminRole(id);
  }

  @Mutation(() => User)
  @Roles(Role.ADMIN)
  public revokeAdminRole(@Args('id') id: string): Promise<User> {
    return this.usersService.revokeAdminRole(id);
  }
}
