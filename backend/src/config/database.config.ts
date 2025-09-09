import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => {
  // For Railway deployment, use DATABASE_URL if available
  if (process.env.DATABASE_URL) {
    return {
      url: process.env.DATABASE_URL,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    };
  }
  
  // For local development, use individual environment variables
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'transaction_history',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  };
}); 
