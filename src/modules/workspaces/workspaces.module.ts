import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspacesRepository } from './workspaces.repository';
import { WorkspacesResolver } from './workspaces.resolver';
import { WorkspacesService } from './workspaces.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace])],
  providers: [WorkspacesResolver, WorkspacesService, WorkspacesRepository],
})
export class WorkspacesModule {}
