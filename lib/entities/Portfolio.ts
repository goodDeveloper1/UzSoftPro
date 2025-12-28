import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('portfolio')
export class Portfolio {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column({ nullable: true })
  image?: string;

  @Column()
  category!: string;

  @Column('text')
  technologies!: string; // JSON string

  @Column({ nullable: true })
  client?: string;

  @Column({ nullable: true })
  duration?: string;

  @Column({ nullable: true, name: 'teamSize' })
  teamSize?: string;

  @Column({ default: 'Yakunlangan' })
  status!: string;

  @Column({ nullable: true, name: 'liveUrl' })
  liveUrl?: string;

  @Column({ nullable: true, name: 'githubUrl' })
  githubUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
