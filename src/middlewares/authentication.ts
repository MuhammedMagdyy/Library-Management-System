import { type Request, Response, NextFunction } from 'express';
import { userService } from '../modules';

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
