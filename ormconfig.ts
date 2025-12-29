import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  synchronize: false,
  logging: true,
  entities: ['lib/entities/**/*.ts'],
  migrations: ['migrations/**/*.ts'],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false,
  },
});
