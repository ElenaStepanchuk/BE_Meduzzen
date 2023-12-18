import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToMany(() => User, (user) => user.companies, { onDelete: 'CASCADE' })
  users: User[];

  @Column()
  company_name: string;

  @Column({ nullable: true })
  company_description: string;

  @Column({ default: false, nullable: true })
  visibility: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
