import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Chat } from 'src/modules/chats/entities/chat.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class Workspace extends CommonEntity {
  @Column()
  @Field()
  name: string;

  @ManyToOne(() => User, (user) => user.workspaceCreator)
  user: Partial<User>;

  @OneToMany(() => Chat, (chat) => chat.workspace)
  chats: Chat[];
}
