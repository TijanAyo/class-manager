import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppResponse, ErrorMessage } from '../helpers';

@Injectable()
export class PermissionGuard implements CanActivate {
  private prisma = new PrismaClient();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userAccount = await this.prisma.user.findUnique({
      where: { id: user.sub },
    });

    if (userAccount.isAccountSuspended) {
      throw new ForbiddenException(
        AppResponse.Error(
          `This account has been suspended, kindly contact support for assistance`,
          ErrorMessage.FORBIDDEN,
        ),
      );
    }

    if (!userAccount.isEmailVerified) {
      throw new ForbiddenException(
        AppResponse.Error(
          `This reqeust cannot be performed until you verify your email address`,
          ErrorMessage.FORBIDDEN,
        ),
      );
    }

    return true;
  }
}
