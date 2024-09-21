import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { verifyEmailDto } from './dto';
import { AuthorizeGuard } from '../common/guards';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('verify-email')
  @UseGuards(AuthorizeGuard)
  @HttpCode(200)
  async verifyEmailAddress(@Body() payload: verifyEmailDto, @Req() req: any) {
    const user = req.user;
    return await this.accountService.verifyEmailAddress(user.sub, payload);
  }

  async editProfile() {}

  async uploadProfileImage() {}

  async changePassword() {}
}
