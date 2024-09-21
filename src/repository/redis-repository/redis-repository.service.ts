import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RedisService } from '../../redis';
import { AppResponse, ErrorMessage } from 'src/common/helpers';

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
        otpExpiresIn: otpExpiresIn.toString(),
      });

      // redis hash TTL
      await this.client.expire(redisKey, 1800); // Hash expires in 30min
    } catch (e) {
      console.error(`storeOTP error: Unable to store OTP`, e.message, e.stack);
      throw e;
    }
  }

  private async retrieveOTP(email: string, reason: string) {
    try {
      const redisKey = `${reason}:${email}`;

      const [otp, isValidated, otpExpiresIn] = await Promise.all([
        this.client.HGET(redisKey, 'otp'),
        this.client.HGET(redisKey, 'isValidated'),
        this.client.HGET(redisKey, 'otpExpiresIn'),
      ]);

      // console.log(otp, isValidated, otpExpiresIn);

      /* return otp != null ||
        isValidated !== null ||
        otpExpiresIn !== null 
        ? {
            otpCode: otp ?? null,
            isValidated: isValidated ?? null,
            otpExpiresIn: otpExpiresIn ?? null,
          } as { otpCode: string, isValidated: string, otpExpiresIn: string }
        : null; */

      return {
        otpCode: otp ?? null,
        isValidated: isValidated ?? null,
        otpExpiresIn: otpExpiresIn ?? null,
      };
    } catch (e) {
      console.error(
        `retrieveOTP error: Unable to retrived values from hash`,
        e.message,
        e.stack,
      );
      throw e;
    }
  }

  async validateOTP(email: string, providedOTP: string, reason: string) {
    try {
      const { otpCode, isValidated, otpExpiresIn } = await this.retrieveOTP(
        email,
        reason,
      );

      if (otpCode === null || isValidated === null || otpExpiresIn === null) {
        console.log(`The redis key was not found resulting in this error`);
        throw new NotFoundException(
          AppResponse.Error(`OTP not found`, ErrorMessage.NOT_FOUND),
        );
      }

      const currentTime = Date.now();
      const otpExpiry = parseInt(otpExpiresIn, 10);

      if (isValidated === 'true') {
        throw new BadRequestException(
          AppResponse.Error(
            `Invalid OTP code, code has been utilized`,
            ErrorMessage.BAD_REQUEST,
          ),
        );
      }

      if (currentTime > otpExpiry) {
        throw new BadRequestException(
          AppResponse.Error(
            `The provided code has expired`,
            ErrorMessage.BAD_REQUEST,
          ),
        );
      }

      if (otpCode !== providedOTP) {
        throw new BadRequestException(
          AppResponse.Error(`Invalid OTP code`, ErrorMessage.BAD_REQUEST),
        );
      }
    } catch (e) {
      console.error(
        `validateOTP error: Unable to validate otp`,
        e.message,
        e.stack,
      );
      throw e;
    }
  }

  async markOTPHasValidated(email: string, reason: string) {
    try {
      const redisKey = `${reason}:${email}`;
      const updateField = await this.client.HSET(redisKey, {
        isValidated: 'true',
      });

      if (updateField !== 0) {
        throw new BadRequestException(
          AppResponse.Error(
            `OTP could not be marked has validated`,
            ErrorMessage.BAD_REQUEST,
          ),
        );
      }
    } catch (e) {
      console.error(
        `markOTPHasValidated error: Unable to mark otp has validated`,
        e.message,
        e.stack,
      );
      throw e;
    }
  }
}
