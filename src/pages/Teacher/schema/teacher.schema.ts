import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

export const teacherEnrollSchema = z
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
        return phone?.number ?? value;
      }),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    personalInfo: z.object({
      name: z
        .string()
        .min(2, "Name is required"),

      dateOfBirth: z
        .string()
        .nonempty("Date of birth is required"),

      gender: z.enum([
        "MALE",
        "FEMALE",
        "OTHER",
      ]),

      profileImage: z
        .union([
          z.instanceof(File),
          z.string(),
        ])
        .optional(),

      address: z.object({
        line1: z.string().optional(),

        city: z
          .string()
          .min(2, "City is required"),

        state: z
          .string()
          .min(2, "State is required"),

        country: z
          .string()
          .min(2, "Country is required"),

        zipCode: z
          .string()
          .min(4, "Zip code is required"),
      }),
    }),

    roleInfo: z.object({
      qualification: z
        .string()
        .min(
          2,
          "Qualification is required"
        ),

      specialization: z
        .string()
        .min(
          2,
          "Specialization is required"
        ),

      experienceYears: z
        .number()
        .min(
          0,
          "Experience cannot be negative"
        )
        .max(
          50,
          "Experience seems invalid"
        ),

      joiningDate: z
        .string()
        .nonempty(
          "Joining date is required"
        ),

      bio: z
        .string()
        .max(
          1000,
          "Bio cannot exceed 1000 characters"
        )
        .optional(),
    }),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      path: ["confirmPassword"],
      message:
        "Passwords do not match",
    }
  );

// Raw form values (before transforms)
export type TeacherEnrollFormInput =
  z.input<
    typeof teacherEnrollSchema
  >;

// Parsed values (after transforms)
export type TeacherEnrollFormOutput =
  z.output<
    typeof teacherEnrollSchema
  >;