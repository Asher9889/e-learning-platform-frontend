export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface Address {
  line1: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface PersonalInfo {
  name: string;
  dateOfBirth: string;
  gender: Gender;
  profileImage: string;
  address: Address;
}

// export interface StudentRoleInfo {
//   rollNumber: string;
//   admissionDate: string;
//   guardianName: string;
//   guardianPhoneNumber: string;
//   batchId: string;
//   programId: string;
// }

export interface StudentRoleInfo {
  rollNumber: string;

  admissionDate: string;

  guardianName: string;

  guardianPhoneNumber: string;

  batch?: {
    id: string;
    name: string;
  };

  program?: {
    id: string;
    name: string;
  };
}

export interface TeacherRoleInfo {
  employeeId: string;
  designation: string;
  qualification: string;
  department: string;
  experience: number;
  joiningDate: string;
  subjects: string[];
}

export interface AdminRoleInfo {
  employeeId: string;
  designation: string;
  accessLevel: string;
  joiningDate: string;
}

export type RoleInfo =
  | StudentRoleInfo
  | TeacherRoleInfo
  | AdminRoleInfo;

// export interface Profile {
//   id: string;

//   email: string;

//   phoneNumber: string;

//   role: UserRole;

//   status: UserStatus;

//   personalInfo: PersonalInfo;

//   roleInfo: RoleInfo;

//   createdAt: string;

//   updatedAt: string;
// }

export interface BaseProfile {
  id: string;
  email: string;
  phoneNumber: string;
  status: UserStatus;
  personalInfo: PersonalInfo;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile extends BaseProfile {
  role: "STUDENT";
  roleInfo: StudentRoleInfo;
}

export interface TeacherProfile extends BaseProfile {
  role: "TEACHER";
  roleInfo: TeacherRoleInfo;
}

export interface AdminProfile extends BaseProfile {
  role: "ADMIN";
  roleInfo: AdminRoleInfo;
}

export type Profile =
  | StudentProfile
  | TeacherProfile
  | AdminProfile;