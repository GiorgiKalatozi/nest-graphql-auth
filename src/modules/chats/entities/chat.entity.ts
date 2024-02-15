import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Message } from 'src/modules/messages/entities/message.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class Chat extends CommonEntity {
  @Column()
  @Field()
  name: string;

  @ManyToOne(() => User, (user) => user.createdChats)
  user: Partial<User>;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
