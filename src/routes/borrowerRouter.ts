import { Router } from 'express';
import { asyncWrapper } from '../core';
import { userService } from '../modules';
import { responseStatus } from '../helpers';
import {
  borrowerIdParamSchema,
  updateBorrowerSchema,
  queryPaginationSchema,
} from '../utils';
import { ApiError, isAdmin } from '../middlewares';

const router = Router();

router.get(
  '/',
  isAdmin,
  asyncWrapper(async (req, res) => {
    const { page, limit } = queryPaginationSchema.parse(req.query);

    const borrowers = await userService.findManyWithPagination(
      { role: 'BORROWER' },
      { page, limit },
    );

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Borrowers fetched successfully',
      data: borrowers,
    });
  }),
);

router.get(
  '/:id',
  isAdmin,
  asyncWrapper(async (req, res, next) => {
    const { id } = borrowerIdParamSchema.parse(req.params);
    const borrower = await userService.findOne(
      { id },
      {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          registeredDate: true,
        },
      },
    );

    if (!borrower) {
      return next(new ApiError('Borrower not found', 404));
    }

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Borrower fetched successfully',
      data: borrower,
    });
  }),
);

router.put(
  '/:id',
  asyncWrapper(async (req, res, next) => {
    const { id } = borrowerIdParamSchema.parse(req.params);
    const borrower = await userService.findOne({ id });
    const userId = req.user?.id;

    if (!borrower) {
      return next(new ApiError('Borrower not found', 404));
    }

    if (userId !== id) {
      return next(new ApiError('You are not authorized', 401));
    }

    const borrowerSchema = updateBorrowerSchema.parse(req.body);
    const updatedBorrower = await userService.updateOne({ id }, borrowerSchema);

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Borrower updated successfully',
      data: {
        id: updatedBorrower.id,
        email: updatedBorrower.email,
        name: updatedBorrower.name,
        role: updatedBorrower.role,
      },
    });
  }),
);

router.delete(
  '/:id',
  isAdmin,
  asyncWrapper(async (req, res, next) => {
    const { id } = borrowerIdParamSchema.parse(req.params);
    const borrower = await userService.findOne({ id });

    if (!borrower) {
      return next(new ApiError('Borrower not found', 404));
    }

    await userService.deleteOne({ id });

    res.status(204).send();
  }),
);

export default router;
