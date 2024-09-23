import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  editProfilePayload,
  verifyEmailAddressPayload,
} from '../common/interface';
import { RedisRepositoryService } from '../repository/redis-repository';
import { UserRepositoryService } from '../repository/user-repository';
import { AppResponse, ErrorMessage } from '../common/helpers';

@Injectable()
export class AccountService {
  constructor(
    private redisService: RedisRepositoryService,
    private userRepository: UserRepositoryService,
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

  async uploadProfileImage() {
    // Would love to make use of AWS s3 bucket to make this possible
  }

  async changePassword() {
    // Can only change password if
    // 1. email is verified
    // hash password and store in the database
  }
}
