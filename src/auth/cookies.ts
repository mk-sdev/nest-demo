import { CookieOptions } from 'express';

export const accessTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax', // teraz wie, że to nie zwykły string, tylko literal 'lax'
  maxAge: 1000 * 20,
};

export const refreshTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 1000 * 60,
};
