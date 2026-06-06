import z from "zod";

// ─── Zod Schemas ───────────────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});


type TLoginSchema = z.infer<typeof loginSchema>;

export default loginSchema;
export { type TLoginSchema };