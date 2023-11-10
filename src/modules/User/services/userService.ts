import { Prisma } from '@prisma/client';
import { userRepo, type UserRepo } from '../repos/userRepo';
import { PasswordService, expiryDate, jwtExpiryDate } from '../../../helpers';
import { sign, verify, JwtPayload, Secret } from 'jsonwebtoken';
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
      const accessToken = sign(
        { id: userObject.id, role: userObject.role },
        process.env.ACCESS_TOKEN_SECRET_KEY as Secret,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME,
        },
      );

      const refreshToken = sign(
        { id: userObject.id, role: userObject.role },
        process.env.REFRESH_TOKEN_SECRET_KEY as Secret,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME,
        },
      );

      const user = {
        id: userObject.id,
        name: userObject.name,
        email: userObject.email,
        role: userObject.role,
        registeredDate: userObject.registeredDate,
      };

      const { accessTokenExpiryDate, refreshTokenExpiryDate } = jwtExpiryDate();

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
    let payload;
    try {
      payload = verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET_KEY as Secret,
      ) as JwtPayload;
    } catch {
      throw new ApiError('Invalid token', 401);
    }

    const user = await this.userRepo.findOne({ id: payload.id as number });

    if (!user) {
      throw new ApiError('You are not authorized', 401);
    }

    return { id: user.id, role: user.role };
  }

  async verifyRefreshToken(refreshToken: string) {
    let payload;
    try {
      payload = verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY as Secret,
      ) as JwtPayload;
    } catch {
      throw new ApiError('Invalid token', 401);
    }

    const user = await this.userRepo.findOne({ id: payload.id as number });

    if (!user) {
      throw new ApiError('You are not authorized', 401);
    }

    const accessToken = sign(
      { id: payload.id as number, role: payload.role as string },
      process.env.ACCESS_TOKEN_SECRET_KEY as Secret,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME,
      },
    );

    const now = new Date();
    const accessTokenExpiryDate = new Date(
      now.getTime() +
        expiryDate(process.env.ACCESS_TOKEN_EXPIRY_TIME as string),
    );

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

      const accessToken = sign(
        { id: existingUser.id, role: existingUser.role },
        process.env.ACCESS_TOKEN_SECRET_KEY as Secret,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME,
        },
      );

      const refreshToken = sign(
        { id: existingUser.id, role: existingUser.role },
        process.env.REFRESH_TOKEN_SECRET_KEY as Secret,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME,
        },
      );

      const { accessTokenExpiryDate, refreshTokenExpiryDate } = jwtExpiryDate();

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
