import { z } from 'zod';

export const createBorrowingSchema = z.object({
  userId: z.coerce.number().int(),
  bookId: z.coerce.number().int(),
  returnDate: z.coerce.date().optional(),
});

export const borrowingIdParamSchema = z.object({
  id: z.coerce.number().int().optional(),
  borrowerId: z.coerce.number().int().optional(),
});

export const updateBorrowingSchema = z.object({
  userId: z.coerce.number().int().optional(),
  bookId: z.coerce.number().int().optional(),
  returnedAt: z.string().optional(),
});
