import { z } from 'zod';

export const createBorrowingSchema = z.object({
  user_id: z.coerce.number().int(),
  book_id: z.coerce.number().int(),
  borrow_date: z.coerce.date().optional(),
  return_date: z.coerce.date().optional(),
});

export const borrowingIdParamSchema = z.object({
  id: z.coerce.number().int().optional(),
  user_id: z.coerce.number().int().optional(),
});

export const updateBorrowingSchema = z.object({
  user_id: z.coerce.number().int().optional(),
  book_id: z.coerce.number().int().optional(),
  return_date: z.string().optional(),
});
