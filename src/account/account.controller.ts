import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { changePasswordDto, editProfileDto, verifyEmailDto } from './dto';
import { AuthorizeGuard, PermissionGuard } from '../common/guards';

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

  @Patch('edit-profile')
  @UseGuards(AuthorizeGuard, PermissionGuard)
  @HttpCode(200)
  async editProfile(@Body() payload: editProfileDto, @Req() req: any) {
    const user = req.user;
    return await this.accountService.editProfile(user.sub, payload);
  }

  @Post('upload-image')
  async uploadProfileImage() {}

  @Patch('change-password')
  @UseGuards(AuthorizeGuard, PermissionGuard)
  @HttpCode(200)
  async changePassword(@Body() payload: changePasswordDto, @Req() req: any) {
    const user = req.user;
    return await this.accountService.changePassword(user.sub, payload);
  }
}
