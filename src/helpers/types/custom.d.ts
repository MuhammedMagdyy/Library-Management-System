import { Prisma } from '@prisma/client';

declare global {
  namespace Express {
    interface Request extends Express.Request {
      user?: Prisma.UserGetPayload<{ select: { id: true } }>;
    }
  }
}
