import { Prisma } from '@prisma/client';
import { categoryRepo, type CategoryRepo } from '../repos/categoryRepo';

export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async createOne(args: Prisma.CategoryUncheckedCreateInput) {
    return await this.categoryRepo.createOne(args);
  }

  async findOne(query: Prisma.CategoryWhereUniqueInput) {
    return await this.categoryRepo.findOne(query);
  }

  async findManyWithPagination(
    query: Prisma.CategoryWhereInput,
    options: { page: number; limit: number },
  ) {
    return await this.categoryRepo.findManyWithPagination(query, options);
  }

  async updateOne(
    query: Prisma.CategoryWhereUniqueInput,
    args: Prisma.CategoryUncheckedUpdateInput,
  ) {
    return await this.categoryRepo.updateOne(query, args);
  }

  async deleteOne(query: Prisma.CategoryWhereUniqueInput) {
    return await this.categoryRepo.deleteOne(query);
  }
}

export const categoryService = new CategoryService(categoryRepo);
