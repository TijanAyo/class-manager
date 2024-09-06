import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepositoryService } from '../repository/user-repository';
import { registerPayload } from '../common/interface';
import { AppResponse, ErrorMessage } from '../common/helpers';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepositoryService) {}

  async register(payload: registerPayload) {
    try {
      // check if the user email passed is not associated with any other user
      const userExist = await this.userRepository.findByEmail(
        payload.emailAddress,
      );

      if (userExist) {
        throw new BadRequestException(
          AppResponse.Error(
            `Email-address is already associated with another user`,
            ErrorMessage.BAD_REQUEST,
          ),
        );
      }

      // if the role of the user is `Student` the guardian field can not be undefined
      // hash the user password
      // store user into database

      // send an `email-verification` mail to the provided email address
    } catch (e) {
      console.error(`registerError: Unable to register user`);
      throw e;
    }
  }

  async login() {}

  async forgotPassword() {}
}
