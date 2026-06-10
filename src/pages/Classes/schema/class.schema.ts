import { z } from "zod";

export const addClassSchema = z.object({
  className: z
    .string()
    .min(1, "Class name is required"),

  sectionName: z
    .string().toUpperCase()
    .min(1, "Section is required"),

  strength: z.coerce
    .number()
    .min(1, "Strength is required"),
});

export type AddClassFormInput =
  z.input<typeof addClassSchema>;

export type AddClassFormOutput =
  z.output<typeof addClassSchema>;