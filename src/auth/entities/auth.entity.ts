import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  access_token: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  action_token: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
