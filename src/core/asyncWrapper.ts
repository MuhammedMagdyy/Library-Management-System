import { Request, Response, NextFunction } from 'express';

export function asyncWrapper(
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void> | void,
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
