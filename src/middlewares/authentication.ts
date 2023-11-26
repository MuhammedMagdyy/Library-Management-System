import { type Request, Response, NextFunction } from 'express';
import { userService } from '../modules';
import { ApiError } from './errorHandler';
import { Role } from '@prisma/client';

export const isAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1] as string;
    const user = await userService.authenticateUser(accessToken);

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role === Role.ADMIN) {
    return next();
  }
  return next(
    new ApiError('You are not authorized to perform this action', 401),
  );
};
