import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepositoryService } from '../repository/user-repository';
import {
  loginPayload,
  registerPayload,
  sendOTPPayload,
} from '../common/interface';
import { AppResponse, ErrorMessage } from '../common/helpers';
import { generateRandomOTP, verifyPasswordHash } from '../common/utils';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { RedisRepositoryService } from '../repository/redis-repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepositoryService,
    private jwtService: JwtService,
    private mailService: MailService,
    private redisService: RedisRepositoryService,
  ) {}

  async register(
    payload: registerPayload,
  ): Promise<{ data: null; message: string; success: boolean }> {
    try {
      const userExist = await this.userRepository.findByEmail(
        payload.emailAddress,
      );

      if (userExist) {
        throw new BadRequestException(
          AppResponse.Error(
            `The email provided is already associated with another user`,
            ErrorMessage.BAD_REQUEST,
          ),
        );
      }

      const createNewUser = await this.userRepository.createNewUser(payload);

      if (!createNewUser) {
        throw new BadRequestException(
          AppResponse.Error(
            `An unexpected error occurred while create a new user`,
            ErrorMessage.BAD_REQUEST,
          ),
        );
      }

      // TODO: Put this inside a queue
      await this.mailService.sendEmailConfirmation(
        payload.emailAddress,
        payload.firstName,
        `random_token`,
      );

      return AppResponse.Ok(
        null,
        'Account created successfully, kindly check your inbox and verify your email address',
      );
    } catch (e) {
      console.error(
        `registerError: Unable to register user`,
        e.message,
        e.stack,
      );
      throw e;
    }
  }

  async login(
    payload: loginPayload,
  ): Promise<{ data: string; message: string; success: boolean }> {
    try {
      const userExist = await this.userRepository.findByEmail(
        payload.emailAddress,
      );

      if (!userExist) {
        throw new BadRequestException(
          AppResponse.Error(
            `Invalid credentials, check input and try again`,
            ErrorMessage.BAD_REQUEST,
          ),
        );
      }

      const isPasswordValid = await verifyPasswordHash(
        userExist.password,
        payload.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException(
          AppResponse.Error(
            `Invalid credentials, check input and try again`,
            ErrorMessage.UNAUTHORIZED,
          ),
        );
      }

      const accessToken = await this.jwtService.signAsync({
        sub: userExist.id,
        email: userExist.emailAddress,
      });

      return AppResponse.Ok(accessToken, `Authorization successful`);
    } catch (e) {
      console.error(`login error: Unable to authorize user`);
      throw e;
    }
  }

  async sendOTP(payload: sendOTPPayload) {
    try {
      const userExist = await this.userRepository.findByEmail(
        payload.emailAddress,
      );

      if (!userExist) {
        return AppResponse.Ok(
          null,
          `If email exist you will receive a code in your mail`,
        );
      } else {
        const OTPCODE = generateRandomOTP(6);
        await this.redisService.storeOTP(
          payload.emailAddress,
          OTPCODE,
          payload.reason,
        );

        // TODO: Put this function inside of a queue
        await this.mailService.sendOTPCode(userExist.emailAddress, OTPCODE);

        return AppResponse.Ok(
          null,
          `If email exist you will receive a code in your mail`,
        );
      }
    } catch (e) {
      console.error(
        `sendOTP error: Unable to generate / store OTP`,
        e.message,
        e.stack,
      );
      throw e;
    }
  }

  async forgotPassword() {}
}
