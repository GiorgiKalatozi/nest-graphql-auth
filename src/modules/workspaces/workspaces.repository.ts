import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteUserResponse } from 'src/modules/users/dtos';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';

@Injectable()
export class WorkspacesRepository {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspacesRepository: Repository<Workspace>,
  ) {}
  public async create(workspace: Partial<Workspace>): Promise<Workspace> {
    return this.workspacesRepository.create(workspace);
  }

  public async findAll(): Promise<Workspace[]> {
    return this.workspacesRepository.find();
  }

  public async findOne(id: string): Promise<Workspace> {
    return this.workspacesRepository.findOne({ where: { id } });
  }

  public async update(id: string, workspace: Workspace): Promise<Workspace> {
    const workspaceToUpdate = await this.workspacesRepository.findOne({
      where: { id },
    });
    await this.workspacesRepository.update(id, workspace);
    return workspaceToUpdate;
  }

  public async save(workspace: Workspace): Promise<Workspace> {
    return await this.workspacesRepository.save(workspace);
  }

  public async remove(id: string): Promise<DeleteUserResponse> {
    await this.workspacesRepository.delete({ id });

    return { success: true, message: 'User removed successfully' };
  }
}
