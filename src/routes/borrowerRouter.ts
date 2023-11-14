import { Router } from 'express';
import { asyncWrapper } from '../core';
import { userService } from '../modules';
import { responseStatus } from '../helpers';
import {
  borrowerIdParamSchema,
  updateBorrowerSchema,
  queryPaginationSchema,
} from '../utils';
import { ApiError } from '../middlewares';

const router = Router();

router.get(
  '/',
  asyncWrapper(async (req, res) => {
    const { page, limit } = queryPaginationSchema.parse(req.query);

    const borrowers = await userService.findManyWithPagination(
      {},
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

    if (!borrower) {
      return next(new ApiError('Borrower not found', 404));
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
