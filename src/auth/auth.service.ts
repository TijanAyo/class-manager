import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepositoryService } from '../repository/user-repository';
import { registerPayload } from '../common/interface';
import { AppResponse, ErrorMessage } from '../common/helpers';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepositoryService) {}

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

  async login() {}

  async forgotPassword() {}
}
