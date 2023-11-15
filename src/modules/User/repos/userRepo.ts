import { Prisma, type PrismaClient } from '@prisma/client';
import prisma from '../../../database/client';
import { paginationService } from '../../Services';

export class UserRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async createOne(args: Prisma.UserUncheckedCreateInput) {
    return await this.prisma.user.create({ data: args });
  }

  async findOne(
    query: Prisma.UserWhereUniqueInput,
    options?: { select: Prisma.UserSelect },
  ) {
    return await this.prisma.user.findFirst({ where: query, ...options });
  }

  async findManyWithPagination(
    query: Prisma.UserWhereInput,
    options: { page: number; limit: number },
  ) {
    return await this.prisma.user.findMany({
      where: query,
      ...paginationService(options.page, options.limit),
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        registeredDate: true,
      },
    });
  }

  async updateOne(
    query: Prisma.UserWhereUniqueInput,
    args: Prisma.UserUncheckedUpdateInput,
  ) {
    return await this.prisma.user.update({ where: query, data: args });
  }

  async deleteOne(query: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.delete({ where: query });
  }
}

export const userRepo = new UserRepo(prisma);
