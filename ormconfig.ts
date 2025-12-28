import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  type: 'sqlite',
  database: join(process.cwd(), 'data', 'database.db'),
  synchronize: false,
  logging: true,
  entities: ['lib/entities/**/*.ts'],
  migrations: ['migrations/**/*.ts'],
  subscribers: [],
});
