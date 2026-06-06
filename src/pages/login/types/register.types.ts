import z from "zod";
import registerSchema from "../schema/register.schema";

export type TRegisterSchema = z.infer<typeof registerSchema>;
