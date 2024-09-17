export const constants = {
  secret: String(process.env.JWT_SECRET),
  TTL: String(process.env.JWT_SECRET_TTL),
  SALT_ROUNDS: Number(process.env.SALT),

  RESEND_ACCESS_KEY: String(process.env.RESEND_ACCESS_KEY),
  ALLOWED_RESEND_MAIL: String(process.env.ALLOWED_RESEND_MAIL),

  REDIS_HOST: String(process.env.REDIS_HOST),
  REDIS_PASSWORD: String(process.env.REDIS_PASSWORD),
  REDIS_PORT: Number(process.env.REDIS_PORT),
};
