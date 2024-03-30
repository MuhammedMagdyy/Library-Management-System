import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(255).trim(),
});

export const categoryIdParamSchema = z.object({
  id: z.coerce.number().int(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(255).trim().optional(),
});
