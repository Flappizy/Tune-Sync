import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';
import { BAD_REQUEST } from 'http-status';


export const validateHandler = <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req.body);
      req.body = data;
      return next();
    } catch (error) {

      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => {
          const field = issue.path.join(".");
          return `${field}: ${issue.message}`;
        });
        res.status(BAD_REQUEST).json({ errors });
      }
      //next(error);
    }
  };

  export const validateQueryHandler = <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: any = schema.parse(req.query);
      req.query = data;
      return next();
    } catch (error) {

      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => {
          const field = issue.path.join(".");
          return `${field}: ${issue.message}`;
        });
        res.status(BAD_REQUEST).json({ errors });
      }
      //next(error);
    }
  };