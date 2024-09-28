import { Prisma, type PrismaClient } from '@prisma/client';
import prisma from '../../../database/client';
import { paginationService } from '../../Services';

export class CategoryRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async createOne(args: Prisma.CategoryUncheckedCreateInput) {
    return await this.prisma.category.create({ data: args });
  }

  async findOne(query: Prisma.CategoryWhereUniqueInput) {
    return await this.prisma.category.findFirst({ where: query });
  }

  async findManyWithPagination(
    query: Prisma.CategoryWhereInput,
    options: { page: number; limit: number },
  ) {
    return await this.prisma.category.findMany({
      where: query,
      ...paginationService(options.page, options.limit),
      orderBy: { created_at: 'asc' },
    });
  }

  async updateOne(
    query: Prisma.CategoryWhereUniqueInput,
    args: Prisma.CategoryUncheckedUpdateInput,
  ) {
    return await this.prisma.category.update({ where: query, data: args });
  }

  async deleteOne(query: Prisma.CategoryWhereUniqueInput) {
    return await this.prisma.category.delete({ where: query });
  }
}

export const categoryRepo = new CategoryRepo(prisma);
