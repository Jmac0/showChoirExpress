const mongoose = require('mongoose');

//this only needs to be done once and is then available
//in every file !! Must be declared before app is required
const dotenv = require('dotenv');

// point to our config.env file
dotenv.config({ path: './.env.local' });

// catch unhandled synchronous errors
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION 💥 shutting down...');
  process.exit(1);
});

// import our app which is an instance of express
const app = require('./app');

// connect to DB
// assign our database connection url from mongo to a var and insert password
//const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
// mongoose
//   .connect(DB, {
//     // Not sure why this is needed
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then((con) => {
//     console.log('DB connections successful');
//   });

// start server, this is now the entry point of our app
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log('Server Started On PORT', process.env.PORT);
});

// will catch all unhandled async exceptions and errors //
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);

  console.log('UNHANDLED REJECTION 💥 Shutting down...');
  // shut down node app
  // gracefull shutdown
  server.close(() => {
    process.exit(1);
  });
});
