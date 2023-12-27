import { Company } from 'src/company/entities/company.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => Company, (company) => company.companies, {
    onDelete: 'CASCADE',
    eager: true,
    cascade: ['update'],
    orphanedRowAction: 'delete',
  })
  company: Company;
}
