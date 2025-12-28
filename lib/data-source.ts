import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Testimonial } from './entities/Testimonial';
import { Team } from './entities/Team';
import { Portfolio } from './entities/Portfolio';
import { AdminUser } from './entities/AdminUser';
import { Video } from './entities/Video';
import { VideoComment } from './entities/VideoComment';

const dbPath = join(process.cwd(), 'data', 'database.db');

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath,
  synchronize: true, // Auto-create tables (set to false in production)
  logging: false,
  entities: [Testimonial, Team, Portfolio, AdminUser, Video, VideoComment],
  migrations: ['migrations/**/*.ts'],
  subscribers: [],
});

let initialized = false;

export const initializeDatabase = async () => {
  if (!initialized) {
    await AppDataSource.initialize();
    initialized = true;
    console.log('Database initialized with TypeORM');
  }
  return AppDataSource;
};

export default AppDataSource;
