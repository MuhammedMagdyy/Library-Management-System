import { Router } from 'express';
import { asyncWrapper } from '../core';
import { userService } from '../modules';
import { responseStatus } from '../helpers';
import { createBorrowerSchema, loginBorrowerSchema } from '../utils';

const router = Router();

router.post(
  '/register',
  asyncWrapper(async (req, res) => {
    const borrowerSchema = createBorrowerSchema.parse(req.body);
    const borrower = await userService.createOne(borrowerSchema);

    res.status(201).json({
      status: responseStatus.SUCCESS,
      message: 'User created succefully',
      data: borrower,
    });
  }),
);

router.post(
  '/login',
  asyncWrapper(async (req, res) => {
    const borrowerSchema = loginBorrowerSchema.parse(req.body);
    const { email, password } = borrowerSchema;
    const borrower = await userService.login(email, password);

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Logged in successfully',
      data: borrower,
    });
  }),
);

router.get(
  '/refresh-token',
  asyncWrapper(async (req, res) => {
    const refreshToken = req.headers.authorization?.split(' ')[1];
    const token = await userService.verifyRefreshToken(refreshToken as string);

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Token refreshed successfully',
      data: token,
    });
  }),
);
export default router;
