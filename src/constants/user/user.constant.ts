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


// Role-specific information interfaces
// interface IAdminRoleInfo { }
interface ITeacherRoleInfo {
  qualification: string;
  specialization: string;
  experienceYears: number;
  joiningDate: string;
  bio?: string;
}
export interface IStudentRoleInfo {
  rollNumber: string;
  programId: string;
  batch: string;
  admissionDate: string;
  guardianName: string;
  guardianPhoneNumber: string;
}

// Main user state interface
export interface IUserState {
  id: string;

  email: string;
  phoneNumber: string;

  role: TUserRole;
  // status: TUserStatus;

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

  // roleInfo: IAdminRoleInfo | ITeacherRoleInfo | IStudentRoleInfo;
  roleInfo:  ITeacherRoleInfo | IStudentRoleInfo;


  lastLoginAt?: string;

  createdAt: string;
  updatedAt: string;

}

export interface ISection {
  id: string;
  sectionName: string;
  strength: number;
}

export interface IClass {
  id: string;
  className: string;
  strength: number;
  sections: ISection[];
}