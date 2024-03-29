import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Role } from 'src/common/enums/role.enum';
import { Chat } from 'src/modules/chats/entities/chat.entity';
import { Message } from 'src/modules/messages/entities/message.entity';
import { Workspace } from 'src/modules/workspaces/entities/workspace.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class User extends CommonEntity {
  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ unique: true })
  @Field()
  username: string;

  @Column()
  @Field()
  password: string;

  @Column({ nullable: true })
  @Field()
  refreshToken: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  @Field()
  role: Role;

  @OneToMany(() => Message, (message) => message.user)
  @Field(() => [Message])
  messages: Message[];

  @OneToMany(() => Chat, (chat) => chat.user)
  @Field(() => [Chat])
  createdChats: Chat[];

  @ManyToMany(() => Workspace, (workspace) => workspace.chats)
  workspaces: Workspace[];

  @OneToMany(() => Workspace, (workspace) => workspace.user)
  workspaceCreator: Workspace[];
}
