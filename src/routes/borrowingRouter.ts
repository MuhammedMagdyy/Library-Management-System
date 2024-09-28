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
      id: borrowingSchema.book_id,
      available_quantity: { gt: 0 },
      status: Status.AVAILABLE,
    });
    const alreadyBorrowed = await borrowingService.findOne({
      book_id: borrowingSchema.book_id,
      user_id: userId,
      status: Status.BORROWED,
    });

    if (!book) {
      return next(new ApiError('Book not available for checkout', 404));
    }

    if (userId !== borrowingSchema.user_id) {
      return next(new ApiError('You can only borrow books for yourself', 401));
    }

    if (alreadyBorrowed) {
      return next(new ApiError('You already borrowed this book', 400));
    }

    let bookQty = book.available_quantity,
      bookStatus = Status.AVAILABLE as Status;

    if (bookQty) {
      if (book.available_quantity === 1) {
        bookQty -= 1;
        bookStatus = Status.BORROWED;
      } else {
        bookQty -= 1;
      }
    }

    await bookService.updateOne(
      { id: borrowingSchema.book_id },
      { available_quantity: bookQty, status: bookStatus },
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
    const { book_id } = updateBorrowingSchema.parse(req.body);
    const userId = req.user?.id;

    const borrowing = await borrowingService.findOne({
      book_id,
      user_id: userId,
      return_date: null,
    });

    const book = await bookService.findOne({ id: book_id });

    if (!borrowing || !book) {
      return next(new ApiError('Borrowing not found', 404));
    }

    const updatedAvailableQuantity = book.available_quantity
      ? book.available_quantity + 1
      : 1;

    await Promise.all([
      borrowingService.updateOne(
        { id: borrowing.id },
        { return_date: new Date(), status: Status.RETURNED },
      ),
      bookService.updateOne(
        { id: book_id },
        {
          available_quantity: updatedAvailableQuantity,
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
    const { user_id } = borrowingIdParamSchema.parse(req.params);

    const borrowings = await borrowingService.findManyWithPagination(
      { user_id },
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
