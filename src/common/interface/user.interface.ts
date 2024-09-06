export interface registerPayload {
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: string;
  password: string;
  age: number;
  gender: string;
  guardianInformation: GuardianInfomation;
}

interface GuardianInfomation {
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianPhoneNumber?: string;
  guardianAddress?: string;
}
