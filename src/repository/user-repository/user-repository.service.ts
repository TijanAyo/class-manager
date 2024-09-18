import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppResponse, ErrorMessage } from '../../common/helpers';
import { registerPayload } from '../../common/interface';
import { hashPassword } from '../../common/utils';

@Injectable()
export class UserRepositoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { emailAddress: email },
      });
    } catch (e) {
      console.error(
        `findByEmailError: Unable to find user with email`,
        e.message,
        e.stack,
      );
      throw new InternalServerErrorException(
        AppResponse.Error(
          `An unexpected error has occurred`,
          ErrorMessage.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async createNewUser(payload: registerPayload) {
    try {
      return await this.prismaService.user.create({
        data: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          emailAddress: payload.emailAddress,
          password: await hashPassword(payload.password),
          gender: payload.gender,
          age: payload.age,
          role: payload.role || undefined,
          guardianFirstName:
            payload.guardianInformation?.guardianFirstName || undefined,
          guardianLastName:
            payload.guardianInformation?.guardianLastName || undefined,
          guardianPhoneNumber:
            payload.guardianInformation?.guardianPhoneNumber || undefined,
          guardianAddress:
            payload.guardianInformation?.guardianAddress || undefined,
        },
      });
    } catch (e) {
      console.error(
        `createNewUserError: Unable to create new user`,
        e.message,
        e.stack,
      );
      throw new InternalServerErrorException(
        AppResponse.Error(
          `An unexpected error has occurred`,
          ErrorMessage.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async updatePassword(email: string, password: string) {
    try {
      return await this.prismaService.user.update({
        data: { password },
        where: { emailAddress: email },
      });
    } catch (e) {
      console.error(
        `updatePassword error: Unable to update password`,
        e.message,
        e.stack,
      );
      throw e;
    }
  }
}
