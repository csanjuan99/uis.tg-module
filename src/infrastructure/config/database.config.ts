import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.APP_DATABASE_URI,
}));
