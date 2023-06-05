const express = require('express');
const xss = require("xss")
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');
const cors = require('cors');
//const globalErrorHandler = require('./controllers/errorContorller');
//const AppError = require('./utils/appError');

// import routers and handler functions
// const tourRouter = require('./routes/tourRoutes');
// const userRouter = require('./routes/userRoutes');
// const reviewRouter = require('./routes/reviewRoutes');
///////////////////////////////////////////////////////////////
const app = express();
/////////////////GLOBAL MIDDLEWARE ///////////////////////////
// app.use imports middleware

// Body parser, read
// ing data from body into req.body //
app.use(
  express.json({
    // limit size of body request
    limit: '10kb',
  })
);

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());
// Data sanitization against XSS attacks
//app.use(xss());
// protect against HTTP Parameter Pollution attacks
// without whitelist will only sort with the last parameter in the query string
app.use(
  hpp({
    whitelist: [
      'ratingAverage',
      'duration',
      'difficulty',
      'price',
      'maxGroupSize',
    ],
  })
);
// serve static files
app.use(express.static(`${__dirname}/public`));
//SET SECURITY HTTP HEADERS //
app.use(helmet());
//Set Cross origin policy
app.use(cors());
// Development Logging
if (process.env.NODE_ENV !== 'production') {
  // morgan is a logger function
  app.use(morgan('dev'));
}

// Set rate limiter //
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after an hour',
});

//  apply to all requests to routs that include /api
app.use('/api', limiter);

// Helmet

// TEST MIDDLEWARE //
// will run on all requests after this code or
// that do not end the request cycle
app.get("/",(req, res, next) => {
  // do something here
 console.log("SERVER RUNNING")
  // must use next to move code on
  next();
});

// Mount our Routers, any error will drop to globalErrorHandler
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/reviews', reviewRouter);
// Handling undefined routes * is all urls and .all is get post etc
// this must be after all the possible rout handlers as they are matched
// in order
app.all('*', (req, res, next) => {
  // Create a new err instance and pass it to next() //
  /*  const err = new Error();
  err.status = 'fail';
  err.message = `Can't find ${req.url} on this server`;
  err.statusCode = 404;
  // if next ever has an argument it is always an error
  //Express will then exit the normal flow and jump to the error handler
  */
//  next(new AppError(`Can't find ${req.url} on this server!`, 400));
});

//////////////////////ERROR MIDDLEWARE///////////////////////
////////////////////////////////////////////////////////////

//This is now the Express built in error handler
//app.use(globalErrorHandler);

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

///////////////////// export app to  server.js ///////////////////////

module.exports = app;

