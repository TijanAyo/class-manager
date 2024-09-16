export interface registerPayload {
  firstName: string;
  lastName: string;
  emailAddress: string;
  role?: string;
  password: string;
  age: number;
  gender: string;
  guardianInformation?: GuardianInformation;
}

interface GuardianInformation {
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianPhoneNumber?: string;
  guardianAddress?: string;
}

export interface loginPayload {
  emailAddress: string;
  password: string;
}
