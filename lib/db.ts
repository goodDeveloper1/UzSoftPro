import 'reflect-metadata';
import { AppDataSource, initializeDatabase } from './data-source';
import { AdminUser } from './entities/AdminUser';

// Initialize database connection
let dbInitialized = false;

export const getDataSource = async () => {
  if (!dbInitialized) {
    await initializeDatabase();
    
    // Insert default admin user if not exists
    const adminRepo = AppDataSource.getRepository(AdminUser);
    const adminExists = await adminRepo.findOne({ where: { email: 'admin@uzsoftpro.uz' } });
    
    if (!adminExists) {
      const admin = adminRepo.create({
        email: 'admin@uzsoftpro.uz',
        password: 'admin123', // In production, use bcrypt or similar
      });
      await adminRepo.save(admin);
    }
    
    dbInitialized = true;
  }
  return AppDataSource;
};

export default AppDataSource;


