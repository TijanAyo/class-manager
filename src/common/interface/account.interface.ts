export interface verifyEmailAddressPayload {
  otp: string;
}

export interface editProfilePayload {
  firstName?: string;
  lastName?: string;
  bio?: string;
  gender?: string;
  age?: number;
  city?: string;
  state?: string;
  streetAddress?: string;
  phoneNumber?: string;
}

export interface changePasswordPayload {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}
