import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });
export default {
  port: 'PORT',
  mongoUri: 'MONGODB_URI',
  password: 'PASSWORD',
  goCardlessAccessToken: 'GO_CARDLESS_ACCESS_TOKEN',
  goCardlessWebhookSecret: 'GO_CARDLESS_SECRET',
};
