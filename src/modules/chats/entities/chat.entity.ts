import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Message } from 'src/modules/messages/entities/message.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Workspace } from 'src/modules/workspaces/entities/workspace.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ChatType } from '../enums/chat-type.enum';

@Entity()
@ObjectType()
export class Chat extends CommonEntity {
  @Column()
  @Field()
  name: string;

  @Column({ type: 'enum', enum: ChatType, default: ChatType.SINGLE })
  @Field()
  type: ChatType;

  @ManyToOne(() => User, (user) => user.createdChats)
  user: Partial<User>;

  @ManyToOne(() => Workspace, (workspace) => workspace.chats)
  workspace: Partial<Workspace>;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
