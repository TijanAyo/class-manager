import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepositoryService } from '../repository/user-repository';
import { loginPayload, registerPayload } from '../common/interface';
import { AppResponse, ErrorMessage } from '../common/helpers';
import { verifyPasswordHash } from '../common/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepositoryService,
    private jwtService: JwtService,
  ) {}

  async register(payload: registerPayload) {
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

      // TODO: send an `email-verification` mail to the provided email address

      return AppResponse.Ok(
        null,
        'Account created successfully, kindly check your inbox and verify your email address',
      );
    } catch (e) {
      console.error(`registerError: Unable to register user`);
      throw e;
    }
  }

  async login(payload: loginPayload) {
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

  async forgotPassword() {}
}
