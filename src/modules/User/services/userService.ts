import { Prisma } from '@prisma/client';
import { userRepo, type UserRepo } from '../repos/userRepo';

export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  async findOne(query: Prisma.UserWhereUniqueInput) {
    return await this.userRepo.findOne(query);
  }

  async findMany() {
    return await this.userRepo.findMany();
  }

  async updateOne(
    query: Prisma.UserWhereUniqueInput,
    args: Prisma.UserUncheckedUpdateInput,
  ) {
    return await this.userRepo.updateOne(query, args);
  }

  async deleteOne(query: Prisma.UserWhereUniqueInput) {
    return await this.userRepo.deleteOne(query);
  }
}

export const userService = new UserService(userRepo);
