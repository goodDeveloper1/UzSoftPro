import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('video_comments')
export class VideoComment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'video_id' })
  videoId!: number;

  @Column('text')
  comment!: string;

  @Column({ name: 'author_name', default: 'Anonim' })
  authorName!: string;

  @Column({ name: 'is_approved', default: 0 })
  isApproved!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
