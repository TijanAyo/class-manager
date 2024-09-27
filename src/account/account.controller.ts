import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { changePasswordDto, editProfileDto, verifyEmailDto } from './dto';
import { AuthorizeGuard, PermissionGuard } from '../common/guards';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { constants } from '../common/utils';
import * as crypto from 'crypto';

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
  @UseInterceptors(FileInterceptor('profile_img'))
  @UseGuards(AuthorizeGuard, PermissionGuard)
  @HttpCode(200)
  async uploadProfileImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /png|jpg|jpeg/, // Allow png, jpg and jpeg
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5MB in bytes
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    profile_img: Express.Multer.File,
    @Req() req: any,
  ) {
    const user = req.user;

    const randomImageName = crypto.randomBytes(21).toString('hex');

    const params = {
      Bucket: constants.AWS_BUCKET_NAME,
      Key: randomImageName,
      Body: profile_img.buffer,
      ContentType: profile_img.mimetype,
    };

    return await this.accountService.uploadProfileImage(user.sub, params);
  }

  @Patch('change-password')
  @UseGuards(AuthorizeGuard, PermissionGuard)
  @HttpCode(200)
  async changePassword(@Body() payload: changePasswordDto, @Req() req: any) {
    const user = req.user;
    return await this.accountService.changePassword(user.sub, payload);
  }
}
