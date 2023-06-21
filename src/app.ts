/* eslint-disable import/first  */
import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

import config from 'config';
import createServer from './server';

const port = config.get<number>('port');
const mongoUri = config.get<string>('mongoUri');
const password = config.get<string>('password');

const app = createServer();
// connect to DB,
const DB = mongoUri.replace('<PASSWORD>', password) as string;
mongoose.connect(DB, {}).then(() => {
  console.log('DB connections successful');
});

app.listen(port, () => {
  console.log('Server Started On PORT', port);
});

// will catch all unhandled async exceptions and errors //
process.on('unhandledRejection', (err: { name: string; message: string }) => {
  console.log(err.name, err.message);

  console.log('UNHANDLED REJECTION 💥 Shutting down');
});
