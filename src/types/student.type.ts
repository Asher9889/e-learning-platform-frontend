// types.ts

import type { StudentEnrollFormOutput } from "@/pages/Student/schema/student.schema";
import type { UseFormReturn } from "react-hook-form";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  batch: string;
  rollNumber: string;
  status: "active" | "inactive";
}


export interface StepProps {
  form: UseFormReturn<StudentEnrollFormOutput>;
}