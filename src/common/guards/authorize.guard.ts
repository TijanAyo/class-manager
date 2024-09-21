import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppResponse, ErrorMessage } from '../helpers';
import { Request } from 'express';
import { constants } from '../utils';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException(
        AppResponse.Error(
          'Authentication required, Kindly provide a valid token',
          ErrorMessage.UNAUTHORIZED,
        ),
      );
    }

    const [type, token] = authorization.split(' ');
    // console.log('token:', token);
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        AppResponse.Error('Token not found', ErrorMessage.UNAUTHORIZED),
      );
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: constants.secret,
      });

      request.user = decoded;
    } catch {
      throw new UnauthorizedException(
        AppResponse.Error(
          'Invalid or expired token',
          ErrorMessage.UNAUTHORIZED,
        ),
      );
    }

    return true;
  }
}
