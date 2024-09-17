import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis';

@Injectable()
export class RedisRepositoryService {
  constructor(private redisService: RedisService) {}

  private client = this.redisService.getClient();

  async storeOTP(email: string, otp_code: string, reason: string) {
    try {
      const redisKey = `${reason}:${email}`;
      const otpExpiresIn = Date.now() + 15 * 60 * 1000; // 15 min

      // Store OTP and validation status in redis hash
      await this.client.HSET(redisKey, {
        otp: otp_code,
        isValidated: 'false',
        otpExpiresIn: String(otpExpiresIn),
      });

      // redis hash TTL
      await this.client.expire(redisKey, 1800); // Hash expires in 30min
    } catch (e) {
      console.error(`storeOTP error: Unable to store OTP`, e.message, e.stack);
      throw e;
    }
  }

  private async retrieveOTP() {}

  async validateOTP() {}
}
