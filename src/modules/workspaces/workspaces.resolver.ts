import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateWorkspaceInput } from './dtos/create-workspace.input';
import { UpdateWorkspaceInput } from './dtos/update-workspace.input';
import { Workspace } from './entities/workspace.entity';
import { WorkspacesService } from './workspaces.service';
import { CurrentUserId } from 'src/common/decorators';

@Resolver(() => Workspace)
export class WorkspacesResolver {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Mutation(() => Workspace)
  public createWorkspace(
    @Args('createWorkspaceInput') createWorkspaceInput: CreateWorkspaceInput,
    @CurrentUserId() userId: string,
  ) {
    return this.workspacesService.create(createWorkspaceInput, userId);
  }

  @Query(() => [Workspace], { name: 'workspaces' })
  public findAll() {
    return this.workspacesService.findAll();
  }

  @Query(() => Workspace, { name: 'workspace' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.workspacesService.findOne(id);
  }

  @Mutation(() => Workspace)
  updateWorkspace(
    @Args('updateWorkspaceInput') updateWorkspaceInput: UpdateWorkspaceInput,
  ) {
    return this.workspacesService.update(
      updateWorkspaceInput.id,
      updateWorkspaceInput,
    );
  }

  @Mutation(() => Workspace)
  removeWorkspace(@Args('id', { type: () => Int }) id: number) {
    return this.workspacesService.remove(id);
  }
}
