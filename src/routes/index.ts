import { Router } from 'express';
import bookRouter from './bookRouter';
import borrowerRouter from './borrowerRouter';
import authRouter from './authRouter';
import { isAuth } from '../middlewares';

const router = Router();

router.use('/auth', authRouter);
router.use(isAuth);
router.use('/books', bookRouter);
router.use('/borrowers', borrowerRouter);

export default router;
