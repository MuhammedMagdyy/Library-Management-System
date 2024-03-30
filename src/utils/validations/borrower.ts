import { z } from 'zod';

export const createBorrowerSchema = z.object({
  name: z.string().min(1).max(255).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(6).trim(),
  image: z.string().trim().optional(),
  category_id: z.coerce.number().int(),
});

export const loginBorrowerSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().trim(),
});

export const borrowerIdParamSchema = z.object({
  id: z.coerce.number().int(),
});

export const updateBorrowerSchema = z.object({
  name: z.string().min(1).max(255).trim().optional(),
  image: z.string().trim().optional(),
});
