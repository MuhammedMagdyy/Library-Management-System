import { z } from 'zod';
import { QUERIES } from '../../helpers';

export const createBookSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  author: z.string().min(1).max(255).trim(),
  isbn: z.string().min(1).max(255).trim(),
  available_quantity: z.coerce.number().int().min(1).default(1),
  published_date: z.date(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  views: z.coerce.number().int().default(0),
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
  available_quantity: z.coerce.number().int().min(1).default(1),
  published_date: z.date().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  views: z.coerce.number().int().default(0).optional(),
  image: z.string().trim().optional(),
});
