import { Router } from 'express';
import bookRouter from './bookRouter';
import borrowerRouter from './borrowerRouter';
import authRouter from './authRouter';
import { ApiError, isAuth } from '../middlewares';

const router = Router();

router.use('/auth', authRouter);
router.use(isAuth);
router.use('/books', bookRouter);
router.use('/borrowers', borrowerRouter);
router.all('*', (req, _res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

export default router;
