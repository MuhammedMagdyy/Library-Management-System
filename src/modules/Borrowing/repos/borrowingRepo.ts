import { Prisma, type PrismaClient } from '@prisma/client';
import prisma from '../../../database/client';
import { paginationService } from '../../Services';

export class BorrowingRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async createOne(args: Prisma.BorrowingUncheckedCreateInput) {
    return await this.prisma.borrowing.create({ data: args });
  }

  async findOne(query: Prisma.BorrowingWhereInput) {
    return await this.prisma.borrowing.findFirst({ where: query });
  }

  async findManyWithPagination(
    query: Prisma.BorrowingWhereInput,
    options: { page: number; limit: number },
  ) {
    return await this.prisma.borrowing.findMany({
      where: query,
      ...paginationService(options.page, options.limit),
      select: {
        id: true,
        bookId: true,
        userId: true,
        status: true,
        book: {
          select: {
            title: true,
            author: true,
            image: true,
          },
        },
      },
    });
  }

  async updateOne(
    query: Prisma.BorrowingWhereUniqueInput,
    args: Prisma.BorrowingUncheckedUpdateInput,
  ) {
    return await this.prisma.borrowing.update({ where: query, data: args });
  }

  async deleteOne(query: Prisma.BorrowingWhereUniqueInput) {
    return await this.prisma.borrowing.delete({ where: query });
  }
}

export const borrowingRepo = new BorrowingRepo(prisma);
