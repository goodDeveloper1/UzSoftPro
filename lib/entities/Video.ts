import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ name: 'video_url' })
  videoUrl!: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({ default: 'Ish jarayonlari' })
  category!: string;

  @Column({ nullable: true })
  duration?: number;

  @Column({ default: 0 })
  views!: number;

  @Column({ name: 'is_active', default: 1 })
  isActive!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
