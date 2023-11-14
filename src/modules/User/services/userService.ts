import { Prisma } from '@prisma/client';
import { userRepo, type UserRepo } from '../repos/userRepo';
import {
  PasswordService,
  generateJwt,
  expiryDateJwt,
  verifyJwt,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from '../../../helpers';
import { ApiError } from '../../../middlewares';

export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  async createOne(args: Prisma.UserUncheckedCreateInput) {
    const existUser = await this.userRepo.findOne({ email: args.email });

    if (existUser) {
      throw new ApiError('User already exists', 409);
    }

    const password = await PasswordService.hashPassword(args.password);
    const userObject = await this.userRepo.createOne({ ...args, password });

    if (userObject) {
      const { accessToken, refreshToken } = generateJwt(
        { id: userObject.id, role: userObject.role },
        [ACCESS_TOKEN, REFRESH_TOKEN],
      );

      const user = {
        id: userObject.id,
        name: userObject.name,
        email: userObject.email,
        role: userObject.role,
        registeredDate: userObject.registeredDate,
      };

      const { accessTokenExpiryDate, refreshTokenExpiryDate } = expiryDateJwt([
        ACCESS_TOKEN,
        REFRESH_TOKEN,
      ]);

      return {
        user,
        accessToken,
        refreshToken,
        accessTokenExpiryDate,
        refreshTokenExpiryDate,
      };
    }
  }

  async findOne(
    query: Prisma.UserWhereUniqueInput,
    options?: { select: Prisma.UserSelect },
  ) {
    return await this.userRepo.findOne(query, options);
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

  async authenticateUser(accessToken: string) {
    const { payload } = verifyJwt(accessToken, ACCESS_TOKEN);

    const user = await this.userRepo.findOne({ id: payload.id });

    if (!user) {
      throw new ApiError('You are not authorized', 401);
    }

    return { id: user.id, role: user.role };
  }

  async verifyRefreshToken(refreshToken: string) {
    const { payload } = verifyJwt(refreshToken, REFRESH_TOKEN);

    const user = await this.userRepo.findOne({ id: payload.id });

    if (!user) {
      throw new ApiError('You are not authorized', 401);
    }

    const { accessToken } = generateJwt({ id: user.id, role: user.role }, [
      ACCESS_TOKEN,
    ]);

    const { accessTokenExpiryDate } = expiryDateJwt([ACCESS_TOKEN]);

    return {
      user: { id: user.id, role: user.role },
      accessToken,
      accessTokenExpiryDate,
    };
  }

  async login(email: string, password: string) {
    const existingUser = await this.userRepo.findOne({ email });

    if (existingUser) {
      const isCorrectPassword = await PasswordService.comparePasswords(
        password,
        existingUser?.password,
      );

      if (!isCorrectPassword) {
        throw new ApiError('Invalid email or password', 401);
      }

      const user = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        registeredDate: existingUser.registeredDate,
      };

      const { accessToken, refreshToken } = generateJwt(
        { id: user.id, role: user.role },
        [ACCESS_TOKEN, REFRESH_TOKEN],
      );

      const { accessTokenExpiryDate, refreshTokenExpiryDate } = expiryDateJwt([
        ACCESS_TOKEN,
        REFRESH_TOKEN,
      ]);

      return {
        user,
        accessToken,
        accessTokenExpiryDate,
        refreshToken,
        refreshTokenExpiryDate,
      };
    }
  }
}

export const userService = new UserService(userRepo);
