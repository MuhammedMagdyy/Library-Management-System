import { Router } from 'express';
import { asyncWrapper } from '../core';
import { bookService, imgbbService } from '../modules';
import { responseStatus } from '../helpers';
import {
  createBookSchema,
  bookIdParamSchema,
  updateBookSchema,
  bookQuerySchema,
  queryPaginationSchema,
} from '../utils';
import { ApiError, isAdmin, multerOptions } from '../middlewares';

const router = Router();

router.post(
  '/',
  isAdmin,
  multerOptions.single('image'),
  asyncWrapper(async (req, res) => {
    let image;
    if (req.file) {
      const localImagePath = req.file.path;
      const img = await imgbbService.uploadImage(localImagePath);

      image = img;
    }

    const bookSchema = createBookSchema.parse({ ...req.body, image });
    const book = await bookService.createOne(bookSchema);

    res.status(201).json({
      status: responseStatus.SUCCESS,
      message: 'Book created successfully',
      data: book,
    });
  }),
);

router.get(
  '/',
  asyncWrapper(async (req, res) => {
    const { page, limit } = queryPaginationSchema.parse(req.query);

    const books = await bookService.findManyWithPagination({}, { page, limit });

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Books fetched successfully',
      data: books,
    });
  }),
);

router.get(
  '/search',
  asyncWrapper(async (req, res) => {
    const { field, query } = bookQuerySchema.parse(req.query);

    const books = await bookService.findManyWithSearch(field, query);

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Books fetched successfully',
      data: books,
    });
  }),
);

router.get(
  '/:id',
  asyncWrapper(async (req, res, next) => {
    const { id } = bookIdParamSchema.parse(req.params);
    const book = await bookService.findOne({ id });

    if (!book) {
      return next(new ApiError('Book not found', 404));
    }

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Book fetched successfully',
      data: book,
    });
  }),
);

router.put(
  '/:id',
  isAdmin,
  multerOptions.single('image'),
  asyncWrapper(async (req, res, next) => {
    let image;

    if (req.file) {
      const localImagePath = req.file.path;
      const img = await imgbbService.uploadImage(localImagePath);

      image = img;
    }

    const { id } = bookIdParamSchema.parse(req.params);
    const book = await bookService.findOne({ id });

    if (!book) {
      return next(new ApiError('Book not found', 404));
    }

    const bookSchema = updateBookSchema.parse({ ...req.body, image });
    const updatedBook = await bookService.updateOne({ id }, bookSchema);

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Book updated successfully',
      data: updatedBook,
    });
  }),
);

router.delete(
  '/:id',
  isAdmin,
  asyncWrapper(async (req, res, next) => {
    const { id } = bookIdParamSchema.parse(req.params);
    const book = await bookService.findOne({ id });

    if (!book) {
      return next(new ApiError('Book not found', 404));
    }

    await bookService.deleteOne({ id });

    res.status(204).send();
  }),
);

export default router;
