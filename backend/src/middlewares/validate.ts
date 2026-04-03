import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validate = (schema: ZodSchema) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = (error as any).errors.map((e: any) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        sendError(res, 400, 'Validation failed', formattedErrors);
        return;
      }
      next(error);
    }
  };
