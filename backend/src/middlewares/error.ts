import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  sendError(res, statusCode, message, err.errors || []);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  sendError(res, 404, `Not Found - ${req.originalUrl}`);
};
