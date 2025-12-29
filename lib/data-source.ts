import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Testimonial } from './entities/Testimonial';
import { Team } from './entities/Team';
import { Portfolio } from './entities/Portfolio';
import { AdminUser } from './entities/AdminUser';
import { Video } from './entities/Video';
import { VideoComment } from './entities/VideoComment';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  synchronize: true, // Auto-create tables (set to false in production)
  logging: false,
  entities: [Testimonial, Team, Portfolio, AdminUser, Video, VideoComment],
  migrations: ['migrations/**/*.ts'],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false, // Required for Neon.tech
  },
});

let initialized = false;

export const initializeDatabase = async () => {
  if (!initialized) {
    await AppDataSource.initialize();
    initialized = true;
    console.log('Database initialized with TypeORM (PostgreSQL)');
  }
  return AppDataSource;
};

export default AppDataSource;
