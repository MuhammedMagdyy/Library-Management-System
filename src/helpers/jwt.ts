import { expiryDate } from './expiryDate';

export function jwtExpiryDate() {
  const now = new Date();

  const accessTokenExpiryDate = new Date(
    now.getTime() + expiryDate(process.env.ACCESS_TOKEN_EXPIRY_TIME as string),
  );

  const refreshTokenExpiryDate = new Date(
    now.getTime() + expiryDate(process.env.REFRESH_TOKEN_EXPIRY_TIME as string),
  );

  return { accessTokenExpiryDate, refreshTokenExpiryDate };
}
