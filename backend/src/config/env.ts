import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, fallback = ''): string => process.env[key] ?? fallback;

const toNumber = (value: string, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: getEnv('NODE_ENV', 'development'),
  port: toNumber(getEnv('PORT', '5000'), 5000),
  mongoUri: getEnv('MONGO_URI'),
  jwt: {
    secret: getEnv('JWT_SECRET', 'change-this-secret'),
    expiresIn: getEnv('JWT_EXPIRES_IN', '7d'),
  },
  cloudinary: {
    cloudName: getEnv('CLOUDINARY_CLOUD_NAME'),
    apiKey: getEnv('CLOUDINARY_API_KEY'),
    apiSecret: getEnv('CLOUDINARY_API_SECRET'),
  },
  corsOrigin: getEnv('CORS_ORIGIN', '*'),
};
