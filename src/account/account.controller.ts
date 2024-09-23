import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { editProfileDto, verifyEmailDto } from './dto';
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

  @Post('edit-profile')
  @UseGuards(AuthorizeGuard)
  @HttpCode(200)
  async editProfile(@Body() payload: editProfileDto, @Req() req: any) {
    const user = req.user;
    return await this.accountService.editProfile(user.sub, payload);
  }

  async uploadProfileImage() {}

  async changePassword() {}
}
