import { expiryDate } from './expiryDate';
import { sign, verify, Secret } from 'jsonwebtoken';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { ApiError } from '../middlewares';

type Token = typeof ACCESS_TOKEN | typeof REFRESH_TOKEN;

export function generateJwt(
  payload: { id: number; role: string },
  tokenType: Token[],
) {
  const tokens: Record<Token, string> = {
    accessToken: '',
    refreshToken: '',
  };

  tokenType.forEach((type) => {
    const secretKey =
      type === ACCESS_TOKEN
        ? process.env.ACCESS_TOKEN_SECRET_KEY
        : process.env.REFRESH_TOKEN_SECRET_KEY;

    const expiresIn =
      type === ACCESS_TOKEN
        ? process.env.ACCESS_TOKEN_EXPIRY_TIME
        : process.env.REFRESH_TOKEN_EXPIRY_TIME;

    tokens[type] = sign(payload, secretKey as Secret, { expiresIn });
  });
  return tokens;
}

export function verifyJwt(token: string, tokenType: Token) {
  let payload;
  try {
    payload = verify(
      token,
      tokenType === ACCESS_TOKEN
        ? (process.env.ACCESS_TOKEN_SECRET_KEY as Secret)
        : (process.env.REFRESH_TOKEN_SECRET_KEY as Secret),
    ) as { id: number };
  } catch {
    throw new ApiError('Invalid token', 401);
  }
  return { payload };
}

export function expiryDateJwt(tokenType: Token[]) {
  const now = new Date();

  const expirateDates: Record<Token, Date> = {
    accessToken: now,
    refreshToken: now,
  };

  tokenType.forEach((type) => {
    const expiryTime =
      type === ACCESS_TOKEN
        ? process.env.ACCESS_TOKEN_EXPIRY_TIME
        : process.env.REFRESH_TOKEN_EXPIRY_TIME;

    expirateDates[type] = new Date(
      now.getTime() + expiryDate(expiryTime as string),
    );
  });

  return {
    accessTokenExpiryDate: expirateDates.accessToken,
    refreshTokenExpiryDate: expirateDates.refreshToken,
  };
}
