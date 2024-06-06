import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    port: parseInt(process.env.APP_PORT) || 5001,
    version: process.env.npm_package_version,
    name: process.env.npm_package_name,
    jwt: {
      secret: process.env.JWT_SECRET || '485e492e-d716-4c26-9621-b8c0c2887041',
      accessExp: process.env.JWT_EXP_ACCESS || '12h',
      refreshExp: process.env.JWT_EXP_REFRESH || '7d',
    },
  }),
);
