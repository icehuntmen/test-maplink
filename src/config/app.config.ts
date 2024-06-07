import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    port: parseInt(process.env.APP_PORT) || 5001,
    uri: process.env.APP_URI || 'https://localhost',
    version: process.env.npm_package_version,
    name: process.env.npm_package_name,
  }),
);
