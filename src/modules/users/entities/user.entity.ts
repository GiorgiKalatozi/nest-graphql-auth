import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Role } from 'src/common/enums/role.enum';
import { Column, Entity } from 'typeorm';

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

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  // @OneToMany(() => Post, (post) => post.user)
  // @Field(() => [Post], { nullable: true })
  // posts: Post[];
}
