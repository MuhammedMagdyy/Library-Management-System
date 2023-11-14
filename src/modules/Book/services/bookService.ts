import { Prisma } from '@prisma/client';
import { bookRepo, type BookRepo } from '../repos/bookRepo';

export class BookService {
  constructor(private readonly bookRepo: BookRepo) {}

  async createOne(args: Prisma.BookUncheckedCreateInput) {
    return await this.bookRepo.createOne(args);
  }

  async findOne(query: Prisma.BookWhereUniqueInput) {
    return await this.bookRepo.findOne(query);
  }

  async findManyWithPagination(
    query: Prisma.BookWhereInput,
    options: { page: number; limit: number },
  ) {
    return await this.bookRepo.findManyWithPagination(query, options);
  }

  async findManyWithSearch(field: string, query: string) {
    return await this.bookRepo.findManyWithSearch(field, query);
  }

  async updateOne(
    query: Prisma.BookWhereUniqueInput,
    args: Prisma.BookUncheckedUpdateInput,
  ) {
    return await this.bookRepo.updateOne(query, args);
  }

  async deleteOne(query: Prisma.BookWhereUniqueInput) {
    return await this.bookRepo.deleteOne(query);
  }
}

export const bookService = new BookService(bookRepo);
