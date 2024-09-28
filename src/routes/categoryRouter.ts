import { Router } from 'express';
import { asyncWrapper } from '../core';
import { categoryService } from '../modules';
import { responseStatus } from '../helpers';
import {
  createCategorySchema,
  categoryIdParamSchema,
  updateCategorySchema,
} from '../utils';
import { ApiError, isAdmin } from '../middlewares';

const router = Router();

router.post(
  '/',
  isAdmin,
  asyncWrapper(async (req, res) => {
    const categorySchema = createCategorySchema.parse(req.body);
    const category = await categoryService.createOne(categorySchema);

    res.status(201).json({
      status: responseStatus.SUCCESS,
      message: 'Category created successfully',
      data: category,
    });
  }),
);

router.get(
  '/',
  isAdmin,
  asyncWrapper(async (_req, res) => {
    const categories = await categoryService.findManyWithPagination(
      {},
      { page: 1, limit: 10 },
    );

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Categories fetched successfully',
      data: categories,
    });
  }),
);

router.get(
  '/:id',
  isAdmin,
  asyncWrapper(async (req, res) => {
    const { id } = categoryIdParamSchema.parse(req.params);
    const category = await categoryService.findOne({ id });

    if (!category) {
      throw new ApiError('Category not found', 404);
    }

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Category fetched successfully',
      data: category,
    });
  }),
);

router.put(
  '/:id',
  isAdmin,
  asyncWrapper(async (req, res) => {
    const { id } = categoryIdParamSchema.parse(req.params);
    const categorySchema = updateCategorySchema.parse(req.body);
    const category = await categoryService.updateOne({ id }, categorySchema);

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Category updated successfully',
      data: category,
    });
  }),
);

router.delete(
  '/:id',
  isAdmin,
  asyncWrapper(async (req, res) => {
    const { id } = categoryIdParamSchema.parse(req.params);
    await categoryService.deleteOne({ id });

    res.status(200).json({
      status: responseStatus.SUCCESS,
      message: 'Category deleted successfully',
    });
  }),
);

export default router;
