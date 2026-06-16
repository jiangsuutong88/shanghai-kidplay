import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT || '3000', 10) || 3000,
}));

export const dbConfig = registerAs('db', () => ({
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10) || 5432,
  username: process.env.DB_USERNAME || 'kidplay',
  password: process.env.DB_PASSWORD || 'kidplay123',
  database: process.env.DB_DATABASE || 'kidplay',
  autoLoadEntities: true,
  synchronize: true, // 开发阶段使用，生产环境应关闭
}));

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10) || 6379,
}));

export const qweatherConfig = registerAs('qweather', () => ({
  apiKey: process.env.QWEATHER_API_KEY || '',
  apiBase: process.env.QWEATHER_API_BASE || 'https://devapi.qweather.com/v7',
}));
