export const constants = {
  secret: String(process.env.JWT_SECRET),
  TTL: String(process.env.JWT_SECRET_TTL),
  SALT_ROUNDS: Number(process.env.SALT),
};
