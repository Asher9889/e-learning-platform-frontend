import type { TUserStatus } from "@/constants/user/user.constant";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

export const studentEnrollSchema = z
  .object({
    email: z.email("Please enter a valid email address"),

    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(10, "Phone number is too long")
      .refine(
        (value) => {
          const phone = parsePhoneNumberFromString(value, "IN");
          return phone?.isValid() ?? false;
        },
        { message: "Invalid Indian mobile number" }
      )
      .transform((value) => {
        const phone = parsePhoneNumberFromString(value, "IN");
        return phone?.number ?? value; // E.164 format: +919876543210
      }),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),

    personalInfo: z.object({
      name: z.string().min(2, "Name is required"),
      // dateOfBirth: z.string().min(1, "Date of birth is required"),
      dateOfBirth: z
        .string()
        .nonempty("Date of birth is required"),
      gender: z.enum(["MALE", "FEMALE", "OTHER"]),
       profileImage: z.string().optional(),


      address: z.object({
        line1: z.string().optional(),
        city: z.string().min(2, "City is required"),
        state: z.string().min(2, "State is required"),
        country: z.string().min(2, "Country is required"),
        zipCode: z.string().min(4, "Zip code is required"),
      }),

    }),

    // address: z.object({
    //   line1: z.string().min(3, "Address is required"),
    //   city: z.string().min(2, "City is required"),
    //   state: z.string().min(2, "State is required"),
    //   country: z.string().min(2, "Country is required"),
    //   zipCode: z.string().min(4, "Zip code is required"),
    // }),

    roleInfo: z.object({
      programId: z.string().min(1, "Grade is required"),
      rollNumber: z.string().min(1, "Roll number is required"),
      batchId: z.string().min(1, "Batch is required"),
      admissionDate: z.string().min(1, "Admission date is required"),
      guardianName: z.string().min(2, "Guardian name is required"),
      guardianPhoneNumber: z.string().min(10, "Guardian phone number is required").max(10, "Phone number is too long").refine(
        (value) => {
          const phone = parsePhoneNumberFromString(value, "IN");
          return phone?.isValid() ?? false;
        },
        { message: "Invalid Indian mobile number" }
      )
      .transform((value) => {
        const phone = parsePhoneNumberFromString(value, "IN");
        return phone?.number ?? value; // E.164 format: +919876543210
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// ✅ Input type  — useForm mein use karo (raw form values, phoneNumber: string)
export type StudentEnrollFormInput = z.input<typeof studentEnrollSchema>;


export type StudentDataFromApi = Omit<
  StudentEnrollFormInput,
  "confirmPassword" | "personalInfo"
> & {
  id: string;
  role: "STUDENT";
  createdAt: string;
  updatedAt: string;
  status: TUserStatus;

  personalInfo: Omit<
    StudentEnrollFormInput["personalInfo"],
    "profileImage"
  > & {
    profileImage: string | null;
  };
  roleInfo: {
    rollNumber: string;
    admissionDate: string;
    guardianName: string;
    guardianPhoneNumber: string;
    batchId: string;
    batchName: string;
    programId: string;
    programName: string;
  };
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type StudentsListResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    students: StudentDataFromApi[];
    pagination: Pagination;
  };
};

export type StudentStatsResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    newlyAddedThisMonth: number;
  };
};

export type StudentFilters = {
  programId?: string;
  batchId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
export type UpdateStudentStatusInput = {
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

export type BulkUpdateStatusInput = {
  studentIds: string[];
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

export type UpdateStatusResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    status: string;
  };
};

export type BulkUpdateStatusResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    updatedCount: number;
  };
};

export type DeleteStudentResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
};

export type SingleStudentResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: StudentDataFromApi;
};

// ✅ Output type — onSubmit mein use karo (after transform, phoneNumber: string)
export type StudentEnrollFormOutput = z.output<typeof studentEnrollSchema>;