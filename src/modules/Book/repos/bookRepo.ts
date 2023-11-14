import { Prisma, type PrismaClient } from '@prisma/client';
import prisma from '../../../database/client';
import { paginationService } from '../../../helpers';

export class BookRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async createOne(args: Prisma.BookUncheckedCreateInput) {
    return await this.prisma.book.create({ data: args });
  }

  async findOne(query: Prisma.BookWhereUniqueInput) {
    return await this.prisma.book.findFirst({ where: query });
  }

  async findManyWithPagination(
    query: Prisma.BookWhereInput,
    options: { page: number; limit: number },
  ) {
    return await this.prisma.book.findMany({
      where: query,
      ...paginationService(options.page, options.limit),
      orderBy: { createdAt: 'asc' },
    });
  }

  async findManyWithSearch(field: string, query: string) {
    return await this.prisma.book.findMany({
      where: {
        [field]: {
          contains: query,
        },
      },
    });
  }

  async updateOne(
    query: Prisma.BookWhereUniqueInput,
    args: Prisma.BookUncheckedUpdateInput,
  ) {
    return await this.prisma.book.update({ where: query, data: args });
  }

  async deleteOne(query: Prisma.BookWhereUniqueInput) {
    return await this.prisma.book.delete({ where: query });
  }
}

export const bookRepo = new BookRepo(prisma);
