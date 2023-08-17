import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });
export default {
  port: '',
  mongoUri: 'MONGODB_TEST_URI',
  password: '',
  goCardlessAccessToken: '',
  goCardlessWebhookSecret: '',
  mockGoCardlessCustomer: '',
  mockGoCardlessMandate: '',
  baseUrl: '',
};
