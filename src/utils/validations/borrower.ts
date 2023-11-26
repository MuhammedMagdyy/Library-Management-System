import { z } from 'zod';

export const createBorrowerSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(6).trim(),
  name: z.string().min(1).max(255).trim(),
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
});
