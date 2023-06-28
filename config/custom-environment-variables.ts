import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });
export default {
  port: 'PORT',
  mongoUri: 'MONGODB_URI',
  password: 'PASSWORD',
  goCardlessAccessToken: 'GO_CARDLESS_ACCESS_TOKEN',
  goCardlessWebhookSecret: 'GO_CARDLESS_WEBHOOK_SECRET',
  mongoTestUri: 'MONGODB_TEST_URI',
  cypherAlgorithm: 'EMAIL_CYPHER_ALGORITHM',
  emailCypherSecret: 'EMAIL_CYPHER_SECRET',
  mockGoCardlessCustomer: 'MOCK_GO_CARDLESS_CUSTOMER',
  mockGoCardlessMandate: 'MOCK_GO_CARDLESS_MANDATE',
};
