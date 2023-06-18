/* eslint-disable import/first */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

import app from './app';

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION 💥 SHUTTING DOWN...');
  process.exit(1);
});
// connect to DB,
// assign our database connection url from mongo to a var
// and insert password
const DB = process.env.MONGODB_URI!.replace(
  '<PASSWORD>',
  process.env.PASSWORD!,
) as string;
mongoose.connect(DB, {}).then(() => {
  console.log('DB connections successful');
});

// start server, this is now the entry point of our app
const port = process.env.PORT;
app.listen(port, () => {
  console.log('Server Started On PORT', process.env.PORT);
});

// will catch all unhandled async exceptions and errors //
process.on('unhandledRejection', (err: { name: string; message: string }) => {
  console.log(err.name, err.message);

  console.log('UNHANDLED REJECTION 💥 Shutting down');
  // shut-down node app
  // gracefully shutdown
  // server.close(() => {
  // process.exit(1);
  // });
});
