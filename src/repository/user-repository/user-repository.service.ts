import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppResponse, ErrorMessage } from '../../common/helpers';

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
}
