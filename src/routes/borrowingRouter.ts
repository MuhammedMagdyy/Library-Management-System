import { Router } from 'express';
import { Status } from '@prisma/client';
import { asyncWrapper } from '../core';
import { bookService, borrowingService } from '../modules';
import { responseStatus } from '../helpers';
import {
  borrowingIdParamSchema,
  createBorrowingSchema,
  updateBorrowingSchema,
  queryPaginationSchema,
} from '../utils';
import { ApiError } from '../middlewares';

const router = Router();

router.post(
  '/borrow-book',
  asyncWrapper(async (req, res, next) => {
    const userId = req.user?.id;
    const borrowingSchema = createBorrowingSchema.parse(req.body);
    const book = await bookService.findOne({
      id: borrowingSchema.bookId,
      availableQuantity: { gt: 0 },
      status: Status.AVAILABLE,
    });
    const alreadyBorrowed = await borrowingService.findOne({
      bookId: borrowingSchema.bookId,
      userId,
      status: Status.BORROWED,
    });

    if (!book) {
      return next(new ApiError('Book not available for checkout', 404));
    }

    if (userId !== borrowingSchema.userId) {
      return next(new ApiError('You can only borrow books for yourself', 401));
    }

    if (alreadyBorrowed) {
      return next(new ApiError('You already borrowed this book', 400));
    }

    let bookQty = book.availableQuantity,
      bookStatus = Status.AVAILABLE as Status;

    if (book.availableQuantity === 1) {
      bookQty -= 1;
      bookStatus = Status.BORROWED;
    } else {
      bookQty -= 1;
    }

    await bookService.updateOne(
      { id: borrowingSchema.bookId },
      { availableQuantity: bookQty, status: bookStatus },
    );

    const borrowing = await borrowingService.createOne(borrowingSchema);

    res.status(201).json({
      status: responseStatus.SUCCESS,
      message: 'Borrowing created successfully',
      data: borrowing,
    });
  }),
);

router.put(
  '/return-book',
  asyncWrapper(async (req, res, next) => {
    const { bookId } = updateBorrowingSchema.parse(req.body);
    const userId = req.user?.id;

    const borrowing = await borrowingService.findOne({
      bookId,
      userId,
      returnDate: null,
    });

    const book = await bookService.findOne({ id: bookId });

    if (!borrowing || !book) {
      return next(new ApiError('Borrowing not found', 404));
    }

    await Promise.all([
      borrowingService.updateOne(
        { id: borrowing.id },
        { returnDate: new Date(), status: Status.RETURNED },
      ),
      bookService.updateOne(
        { id: bookId },
        {
          availableQuantity: book.availableQuantity + 1,
          status: Status.AVAILABLE,
        },
      ),
    ]);

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Book returned successfully',
    });
  }),
);

router.get(
  '/:borrowerId',
  asyncWrapper(async (req, res) => {
    const { page, limit } = queryPaginationSchema.parse(req.query);
    const { borrowerId } = borrowingIdParamSchema.parse(req.params);

    const borrowings = await borrowingService.findManyWithPagination(
      { userId: borrowerId },
      { page, limit },
    );

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Borrowings fetched successfully',
      data: borrowings,
    });
  }),
);

export default router;
