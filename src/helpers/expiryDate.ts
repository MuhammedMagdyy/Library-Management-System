import { ApiError } from '../middlewares';
import timestring from 'timestring';

export function expiryDate(date: string) {
  if (!date) {
    throw new ApiError('Invalid date', 400);
  }

  return timestring(date, 'ms');
}
