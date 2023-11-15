import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { responseStatus } from '../helpers';
import { MulterError } from 'multer';

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, status: number) {
    super(message);
    this.statusCode = status;
  }
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    const statusCode = err.statusCode;
    const message = err.message;

    return res
      .status(statusCode)
      .json({ status: responseStatus.FAIL, message });
  }

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        status: responseStatus.FAIL,
        message: 'File size too large, maximum 5MB allowed',
      });
    }
    return res.status(415).json({
      status: responseStatus.FAIL,
      message: 'Only images are allowed, jpg, jpeg, png',
    });
  }

  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => {
      return {
        field: issue.path.join('.'),
        message: issue.message,
      };
    });

    return res.status(400).json({
      status: responseStatus.FAIL,
      message: 'Validation Error',
      errors,
    });
  }

  return res
    .status(500)
    .json({ status: responseStatus.ERROR, message: 'Internal server error' });
};
