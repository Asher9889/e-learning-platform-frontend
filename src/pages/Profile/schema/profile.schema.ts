import { z } from "zod";

export const updateNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name is too long"),
});

export type TUpdateNameForm = z.infer<
  typeof updateNameSchema
>;