import { Prisma, type PrismaClient } from '@prisma/client';
import prisma from '../../../database/client';

export class BookRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async createOne(args: Prisma.BookUncheckedCreateInput) {
    return await this.prisma.book.create({ data: args });
  }

  async findOne(query: Prisma.BookWhereUniqueInput) {
    return await this.prisma.book.findFirst({ where: query });
  }

  async findMany() {
    return await this.prisma.book.findMany();
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
