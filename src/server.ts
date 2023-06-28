import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';

const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');
const cors = require('cors');
const goCardlessRouter = require('./routers/goCardlessRouter');

// Set rate limiter //
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 200, // limit each IP to 200 requests per
  // hour
  // windowMs
  message: 'Too many requests from this IP, please try again after an hour',
});

function createServer() {
  /// ////////////////////////////////////////////////////////////
  const app = express();
  //  apply to all requests to routs that include /api
  app.use('/api', limiter);

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());
  app.use(
    hpp({
      whitelist: [],
    }),
  );
  // serve static files
  app.use(express.static(`${__dirname}/public`));
  // SET SECURITY HTTP HEADERS //
  app.use(helmet());
  // Set Cross origin policy
  app.use(cors());
  // Development Logging
  if (process.env.NODE_ENV !== 'production') {
    // morgan is a logger function
    app.use(morgan('dev'));
  }

  app.use('/api/gocardless', goCardlessRouter);

  /// /////////////// Handle all undefined routes * /////////////////////
  // this must be after all the possible rout handlers as they are matched
  // in order

  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    // Create a new error instance and pass it to next() //
    next(
      new AppError(`Can't find the url: ${req.originalUrl} on this server`, 404),
    );
  });

  app.use(globalErrorHandler);
  //  Return 200 for "/" route to fix AWS warning
  app.use('/', (req, res) => {
    res.status(200)
      .json({ message: 'App running successfully' });
  });
  return app;
}

export default createServer;
