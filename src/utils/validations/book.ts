import { z } from 'zod';
import { QUERIES } from '../../helpers';

export const createBookSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  author: z.string().min(1).max(255).trim(),
  isbn: z.string().min(1).max(255).trim(),
  availableQuantity: z.coerce.number().int().min(0),
  shelfLocation: z.string().min(1).max(255).trim(),
  image: z.string().trim(),
});

export const bookIdParamSchema = z.object({
  id: z.coerce.number().int(),
});

export const bookQuerySchema = z.object({
  field: z.string().refine((value) => QUERIES.includes(value)),
  query: z.string(),
});

export const updateBookSchema = z.object({
  title: z.string().min(1).max(255).trim().optional(),
  author: z.string().min(1).max(255).trim().optional(),
  isbn: z.string().min(1).max(255).trim().optional(),
  availableQuantity: z.coerce.number().int().min(0).optional(),
  shelfLocation: z.string().min(1).max(255).trim().optional(),
  image: z.string().trim().optional(),
});
