// // schemas/student.schema.ts

// import { z } from "zod";

// export const studentEnrollSchema = z.object({
//   email: z.email("Invalid email"),

//   phoneNumber: z
//     .string()
//     .min(10)
//     .max(15),

//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters"),

//   confirmPassword: z.string(),

//   personalInfo: z.object({
//     name: z.string().min(2),

//     dateOfBirth: z.string(),

//     gender: z.enum([
//       "male",
//       "female",
//       "other",
//     ]),

//     profileImage: z.string().optional(),
//   }),

//   address: z.object({
//     line1: z.string().min(3),

//     city: z.string().min(2),

//     state: z.string().min(2),

//     country: z.string(),

//     zipCode: z.string().min(4),
//   }),

//   roleInfo: z.object({
//     rollNumber: z.string().min(1),

//     batch: z.string().min(1),

//     admissionDate: z.string(),

//     guardianName: z.string().min(2),

//     guardianPhoneNumber: z.string().min(10),
//   }),
// })
// .refine(
//   (data) => data.password === data.confirmPassword,
//   {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   }
// );

// export type StudentEnrollFormData =
//   z.infer<typeof studentEnrollSchema>;

import { z } from "zod";

export const studentEnrollSchema = z
  .object({
    email: z
      .email("Please enter a valid email address"),

    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long"),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      ),

    confirmPassword: z.string(),

    personalInfo: z.object({
      name: z
        .string()
        .min(2, "Name is required"),

      dateOfBirth: z.string().min(
        1,
        "Date of birth is required"
      ),

      gender: z.enum([
        "male",
        "female",
        "other",
      ]),

      profileImage: z
        .string()
        .optional(),
    }),

    address: z.object({
      line1: z
        .string()
        .min(3, "Address is required"),

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

    roleInfo: z.object({
      rollNumber: z
        .string()
        .min(1, "Roll number is required"),

      batch: z
        .string()
        .min(1, "Batch is required"),

      admissionDate: z.string().min(
        1,
        "Admission date is required"
      ),

      guardianName: z
        .string()
        .min(
          2,
          "Guardian name is required"
        ),

      guardianPhoneNumber: z
        .string()
        .min(
          10,
          "Guardian phone number is required"
        ),
    }),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

export type StudentEnrollFormData =
  z.infer<typeof studentEnrollSchema>;