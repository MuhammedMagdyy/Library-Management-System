import { Router } from 'express';
import { ApiError, isAuth } from '../middlewares';
import authRouter from './authRouter';
import bookRouter from './bookRouter';
import borrowerRouter from './borrowerRouter';
import borrowingRouter from './borrowingRouter';
import categoryRouter from './categoryRouter';

const router = Router();

router.use('/auth', authRouter);
router.use(isAuth);
router.use('/books', bookRouter);
router.use('/borrowers', borrowerRouter);
router.use('/borrowings', borrowingRouter);
router.use('/categories', categoryRouter);
router.all('*', (req, _res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

export default router;
