import { Inject, Injectable } from '@nestjs/common';
import { CreateWorkspaceInput } from './dtos/create-workspace.input';
import { UpdateWorkspaceInput } from './dtos/update-workspace.input';
import { WorkspacesRepository } from './workspaces.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Workspace } from './entities/workspace.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly workspacesRepository: WorkspacesRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
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

  public async findAll() {
    const cachedWorkspaces =
      await this.cacheManager.get<Workspace[]>('workspaces');

    if (cachedWorkspaces) {
      return cachedWorkspaces;
    }

    const workspaces = await this.workspacesRepository.findAll();

    await this.cacheManager.set('workspaces', workspaces, 50000);

    return workspaces;
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
