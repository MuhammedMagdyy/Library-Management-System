import { Prisma, type PrismaClient } from '@prisma/client';
import prisma from '../../../database/client';

export class UserRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async findOne(query: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.findFirst({ where: query });
  }

  async findMany() {
    return await this.prisma.user.findMany();
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
