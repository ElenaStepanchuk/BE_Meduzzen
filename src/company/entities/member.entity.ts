import { Company } from 'src/company/entities/company.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  role: string;

  @Column()
  user_id: number;

  @Column()
  user: string;

  @Column()
  company_id: number;

  @ManyToOne(() => Company, (company) => company.companies)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
