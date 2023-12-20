import { Member } from 'src/company/entities/member.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id?: number;

  @OneToMany(() => Member, (member) => member.company, {
    onDelete: 'CASCADE',
    eager: true,
    cascade: ['update'],
    orphanedRowAction: 'delete',
  })
  companies: Company[];

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
