import z from "zod";



const registerSchema = z.object({
  name:     z.string().min(1, 'Full name is required'),
  regEmail: z.string().min(1, 'Email is required'),
  regPass:  z.string().min(8, 'Password must be at least 8 characters'),
});


type TRegisterSchema = z.infer<typeof registerSchema>;

export default registerSchema;
export { type TRegisterSchema };