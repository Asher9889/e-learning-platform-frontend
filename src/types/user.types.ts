

export const USER_ROLE = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT"
} as const;

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED",
} as const;

export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER" 
} as const;

export type TUserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];
export type TGender = typeof GENDER[keyof typeof GENDER];
export type TUserRole = typeof USER_ROLE[keyof typeof USER_ROLE];


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface IAuthState {
  user: IUserState | null;
  isAuthenticated: boolean;
}

export interface IUserState {
  id: string;

  email: string;
  phoneNumber?: string;

  role: TUserRole;
  status: TUserStatus;

  personalInfo: {
    name: string;
    dateOfBirth: string;
    gender: TGender;
    profileImage?: string;
    address: {
      line1?: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };

  roleInfo: {} | {
    qualification: string;
    specialization: string;
    experienceYears: number;
    joiningDate: string;
    bio?: string;
  } | {
    rollNumber: string;
    batch: string;
    admissionDate: string;
    guardianName: string;
    guardianPhoneNumber: string;
  };

  lastLoginAt?: string;

  createdAt: string;
  updatedAt: string;

}