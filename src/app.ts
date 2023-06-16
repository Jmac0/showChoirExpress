import express from "express";
//const xss = require("xss");
import helmet from "helmet";
import rateLimit from "express-rate-limit";
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const morgan = require("morgan");
const cors = require("cors");
import { Request, Response, NextFunction } from "express";
//const globalErrorHandler = require('./controllers/errorContorller');
//const AppError = require('./utils/appError');

const goCardlessRouter = require("./routers/goCardlessRouter");
///////////////////////////////////////////////////////////////
const app = express();

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS attacks
//app.use(xss());
// protect against HTTP Parameter Pollution attacks
// without white list will only sort with the last parameter in the query string
app.use(
  hpp({
    whitelist: [],
  })
);
// serve static files
app.use(express.static(`${__dirname}/public`));
//SET SECURITY HTTP HEADERS //
app.use(helmet());
//Set Cross origin policy
app.use(cors());
// Development Logging
if (process.env.NODE_ENV !== "production") {
  // morgan is a logger function
  app.use(morgan("dev"));
}

//app.use(express.text({type: "application/json"}));
app.use("/api/gocardless", goCardlessRouter);

// Return 200 for "/" route to fix AWS warning
app.use("/", (req, res, next) => {
  res.status(200).json({ message: "App running successfully" });
});
////////////////// Mount Routers ////////////////////////
// handle incoming webhook from GoCardless

////////////////// Handle all undefined routes * /////////////////////
// Handling undefined routes with "*" and .all for all methods
// this must be after all the possible rout handlers as they are matched in order

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  // Create a new err instance and pass it to next() //
  /*  const err = new Error();
  err.status = 'fail';
  err.message = `Can't find ${req.url} on this server`;
  err.statusCode = 404;
  // if next ever has an argument it is always an error
  //Express will then exit the normal flow and jump to the error handler
  */
  //  next(new AppError(`Can't find ${req.url} on this server!`, 400));
  res.status(404).json({ message: "Not Found" });
});

//////////////////////ERROR MIDDLEWARE///////////////////////
////////////////////////////////////////////////////////////

//This will be the Express built in error handler
//app.use(globalErrorHandler);

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

export default app;
