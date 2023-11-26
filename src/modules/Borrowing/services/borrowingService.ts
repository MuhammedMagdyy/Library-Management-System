import { Prisma } from '@prisma/client';
import { borrowingRepo, type BorrowingRepo } from '../repos/borrowingRepo';

export class BorrowingService {
  constructor(private readonly borrowingRepo: BorrowingRepo) {}

  async createOne(args: Prisma.BorrowingUncheckedCreateInput) {
    return await this.borrowingRepo.createOne(args);
  }

  async findOne(query: Prisma.BorrowingWhereInput) {
    return await this.borrowingRepo.findOne(query);
  }

  async findManyWithPagination(
    query: Prisma.BorrowingWhereInput,
    options: { page: number; limit: number },
  ) {
    return await this.borrowingRepo.findManyWithPagination(query, options);
  }

  async updateOne(
    query: Prisma.BorrowingWhereUniqueInput,
    args: Prisma.BorrowingUncheckedUpdateInput,
  ) {
    return await this.borrowingRepo.updateOne(query, args);
  }

  async deleteOne(query: Prisma.BorrowingWhereUniqueInput) {
    return await this.borrowingRepo.deleteOne(query);
  }
}

export const borrowingService = new BorrowingService(borrowingRepo);
