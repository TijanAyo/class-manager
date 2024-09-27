import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  changePasswordPayload,
  editProfilePayload,
  putCommandParams,
  verifyEmailAddressPayload,
} from '../common/interface';
import { RedisRepositoryService } from '../repository/redis-repository';
import { UserRepositoryService } from '../repository/user-repository';
import {
  addItemToBucket,
  AppResponse,
  deleteItemFromBucket,
  ErrorMessage,
  generateImageURLFromRandomName,
  grabImageNameFromUrl,
} from '../common/helpers';
import { hashPassword } from '../common/utils';
import { MailService } from '../mail/mail.service';
import * as sharp from 'sharp';

@Injectable()
export class AccountService {
  constructor(
    private redisService: RedisRepositoryService,
    private userRepository: UserRepositoryService,
    private mailService: MailService,
  ) {}

  async verifyEmailAddress(userId: string, payload: verifyEmailAddressPayload) {
    try {
      const user = await this.userRepository.findById(userId);

      if (user.isEmailVerified) {
        throw new BadRequestException(
          AppResponse.Error(
            `This email has been verified initially. No further action is needed`,
            ErrorMessage.BAD_REQUEST,
          ),
        );
      }

      // Validate OTP provided by the user
      await this.redisService.validateOTP(
        user.emailAddress,
        payload.otp,
        `VERIFY_EMAIL`,
      );

      // Toggle email-verification to true
      await this.userRepository.updateIsEmailVerified(user.emailAddress);

      // Validate OTP so it cannot be used again
      await this.redisService.markOTPHasValidated(
        user.emailAddress,
        `VERIFY_EMAIL`,
      );

      return AppResponse.Ok(
        null,
        `Your email address has been verified successfully. Thank you`,
      );
    } catch (e) {
      console.error(
        `verifyEmailAddress Error: Unable to verify email address`,
        e.message,
        e.stack,
      );
      throw e;
    }
  }

  async editProfile(userId: string, payload: editProfilePayload) {
    try {
      const { emailAddress, role } = await this.userRepository.findById(userId);
      const allowedFields = {
        Teacher: [
          'firstName',
          'lastName',
          'bio',
          'gender',
          'city',
          'state',
          'streetAddress',
          'phoneNumber',
        ],
        Student: ['firstName', 'lastName', 'bio', 'gender', 'phoneNumber'],
      };

      const invalidFields = Object.keys(payload).filter(
        (field) => !allowedFields[role].includes(field),
      );

      if (invalidFields.length > 0) {
        throw new ForbiddenException(
          AppResponse.Error(
            `You are not allowed to update the following fields: [${invalidFields.join(', ')}] as a ${role}`,
            ErrorMessage.FORBIDDEN,
          ),
        );
      }

      const updateProfile = await this.userRepository.updateProfileInfo(
        emailAddress,
        payload,
      );

      if (!updateProfile) {
        throw new BadRequestException(
          AppResponse.Error(
            `An unexpected error has occurred, profile could not be updated`,
            ErrorMessage.BAD_REQUEST,
          ),
        );
      }

      return AppResponse.Ok(null, `Your profile has been updated successfully`);
    } catch (e) {
      console.error(
        `editProfile Error: Unable to verify email address`,
        e.message,
        e.stack,
      );
      throw e;
    }
  }

  async uploadProfileImage(userId: string, payload: putCommandParams) {
    try {
      const user = await this.userRepository.findById(userId);

      if (user.profileImage !== undefined || user.profileImage !== null) {
        const imageName = await grabImageNameFromUrl(user.profileImage);
        await deleteItemFromBucket(imageName, 'photos');
      }

      const buffer = await sharp(payload.Body).resize(200, 200).toBuffer();

      const response = {
        Bucket: payload.Bucket,
        Key: payload.Key,
        Body: buffer,
        ContentType: payload.ContentType,
      };

      await addItemToBucket(response, 'photos');
      const presignedUrl = await generateImageURLFromRandomName(payload.Key);

      await this.userRepository.updateProfileImage(
        user.emailAddress,
        presignedUrl,
      );

      return AppResponse.Ok(
        null,
        `Profile image has been updated successfully`,
      );
    } catch (e) {
      console.error(
        `uploadProfileImage Error: Unable to upload profile image`,
        e.message,
        e.stack,
      );
      throw e;
    }
  }

  async changePassword(userId: string, payload: changePasswordPayload) {
    try {
      const { emailAddress, firstName } =
        await this.userRepository.findById(userId);

      // Validate OTP provided by the user
      await this.redisService.validateOTP(
        emailAddress,
        payload.otp,
        `CHANGE_PASSWORD`,
      );

      if (payload.newPassword !== payload.confirmPassword) {
        throw new BadRequestException(
          AppResponse.Error(
            `Password does not match, kindly check input and try again`,
            ErrorMessage.BAD_REQUEST,
          ),
        );
      }

      const hashedPassword = await hashPassword(payload.confirmPassword);

      await this.userRepository.updatePassword(emailAddress, hashedPassword);

      // Validate OTP so it cannot be used again
      await this.redisService.markOTPHasValidated(
        emailAddress,
        `CHANGE_PASSWORD`,
      );

      // TODO: Put this inside of a queue
      await this.mailService.sendPasswordUpdateNotice(emailAddress, firstName);

      return AppResponse.Ok(
        null,
        `Your password has been updated successfully`,
      );
    } catch (e) {
      console.error(
        `changePassword Error: Unable to change password`,
        e.message,
        e.stack,
      );
      throw e;
    }
  }
}
