import type { TUserStatus } from "@/constants/user/user.constant";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

// 👇 Common fields jo create aur edit dono schema mein same hain
const personalInfoSchema = z.object({
  name: z.string().min(2, "Name is required"),

  dateOfBirth: z.string().nonempty("Date of birth is required"),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]),

  profileImage: z.union([z.instanceof(File), z.string()]).optional(),

  address: z.object({
    line1: z.string().optional(),

    city: z.string().min(2, "City is required"),

    state: z.string().min(2, "State is required"),

    country: z.string().min(2, "Country is required"),

    zipCode: z.string().min(4, "Zip code is required"),
  }),
});

const roleInfoSchema = z.object({
  qualification: z.string().min(2, "Qualification is required"),

  specialization: z.string().min(2, "Specialization is required"),

  experienceYears: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience seems invalid"),

  joiningDate: z.string().nonempty("Joining date is required"),

  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional(),
});

const emailField = z.email("Please enter a valid email address");

const phoneNumberField = z
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
    return phone?.number ?? value;
  });

// ✅ CREATE schema — password required (aapka original schema, as-is)
export const teacherEnrollSchema = z
  .object({
    email: emailField,

    phoneNumber: phoneNumberField,

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    personalInfo: personalInfoSchema,

    roleInfo: roleInfoSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// ✅ EDIT schema — password optional (edit ke time khaali chhod sakte hain)
export const teacherEditSchema = z
  .object({
    email: emailField,

    phoneNumber: phoneNumberField,

    password: z
      .union([
        z.string().min(8, "Password must be at least 8 characters"),
        z.literal(""),
      ])
      .optional(),

    confirmPassword: z
      .union([
        z.string().min(8, "Password must be at least 8 characters"),
        z.literal(""),
      ])
      .optional(),

    personalInfo: personalInfoSchema,

    roleInfo: roleInfoSchema,
  })
  .refine(
    (data) => {
      // agar dono khaali hain to password change nahi ho raha, valid hai
      if (!data.password && !data.confirmPassword) return true;
      return data.password === data.confirmPassword;
    },
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

// Raw form values (before transforms)
export type TeacherEnrollFormInput = z.input<typeof teacherEnrollSchema>;

// Parsed values (after transforms)
export type TeacherEnrollFormOutput = z.output<typeof teacherEnrollSchema>;

// Edit variants
export type TeacherEditFormInput = z.input<typeof teacherEditSchema>;
export type TeacherEditFormOutput = z.output<typeof teacherEditSchema>;

export type TeacherDataFromApi = Omit<
  TeacherEnrollFormInput,
  "confirmPassword" | "personalInfo"
> & {
  id?: string;
  role: "TEACHER";
  createdAt: string;
  updatedAt: string;
  status: TUserStatus;

  personalInfo: Omit<
    TeacherEnrollFormInput["personalInfo"],
    "profileImage"
  > & {
    profileImage: string;
  };
};

export type TeachersListResponse = {
  teachers: TeacherDataFromApi[];
  totalTeachers: number;
};

export type Teacher = {
  id: string;
  name: string;
};

export type Options = {
  value: string;
  label: string;
};

export type TeachersSummary = {
  teachers: Teacher[];
  totalTeachers: number;
};