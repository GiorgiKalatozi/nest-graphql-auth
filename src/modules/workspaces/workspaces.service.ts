import { Injectable } from '@nestjs/common';
import { CreateWorkspaceInput } from './dtos/create-workspace.input';
import { UpdateWorkspaceInput } from './dtos/update-workspace.input';
import { WorkspacesRepository } from './workspaces.repository';

@Injectable()
export class WorkspacesService {
  constructor(private readonly workspacesRepository: WorkspacesRepository) {}
  public async create(
    createWorkspaceInput: CreateWorkspaceInput,
    userId: string,
  ) {
    const workspace = await this.workspacesRepository.create({
      ...createWorkspaceInput,
      user: { id: userId },
    });

    return this.workspacesRepository.save(workspace);
  }

  public findAll() {
    return this.workspacesRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  update(id: number, updateWorkspaceInput: UpdateWorkspaceInput) {
    console.log(updateWorkspaceInput);
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
