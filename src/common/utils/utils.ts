import * as argon2 from 'argon2';

export const hashPassword = async (password: string): Promise<string> => {
  return await argon2.hash(password);
};

export const verifyPasswordHash = async (
  hashedPassword: string,
  unhashedPassword: string,
): Promise<boolean> => {
  return await argon2.verify(hashedPassword, unhashedPassword);
};

export const generateRandomOTP = (size: number): string => {
  let otp = '';
  for (let i = 0; i < size; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};
