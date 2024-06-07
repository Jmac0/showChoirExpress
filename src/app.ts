/* eslint-disable no-console */
/* eslint-disable import/first  */
import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

import config from "config";
import createServer from "./server";

const port = config.get<number>("port");
const mongoUri = config.get<string>("mongoUri");
const password = config.get<string>("password");

const app = createServer();

const server = app.listen(port, () => {
  console.log("Server Started On PORT", port);
});
// catch any unexpected synchronous errors
process.on("uncaughtException", (err: { name: string; message: string }) => {
  console.log(err.name, err.message);

  console.log("UNHANDLED Exception 💥 App shutting down!");

  process.exit(1);
});
// connect to DB,
const DB = mongoUri.replace("<PASSWORD>", password) as string;
mongoose
  .connect(DB, {})
  .then(() => {
    console.log("DB connections successful");
  })
  .catch((err) => {
    console.log("DB connection error", err.message);
    server.close(() => {
      process.exit(1);
    });
  });

// catch all unhandled async exceptions and errors outside express
process.on("unhandledRejection", (err: { name: string; message: string }) => {
  console.log(err.name, err.message);

  console.log("UNHANDLED REJECTION 💥 App shutting down!");
  server.close(() => {
    process.exit(1);
  });
});
