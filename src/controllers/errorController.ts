import { NextFunction, Request, Response } from 'express';
import { AppErrorType } from '../types';
// Function to send error response to client
const globalErrorHandler = (
  err: AppErrorType,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  res.status(err.statusCode)
    .json({
      message: err.message,
      status: err.status,
    });
};

export default globalErrorHandler;
