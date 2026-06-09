// types.ts


import type { TeacherEnrollFormOutput } from "@/pages/Teacher/schema/teacher.schema";
import type { UseFormReturn } from "react-hook-form";

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  specialization: string;
  experienceYears: number;
  joiningDate: string;
  status: "active" | "inactive";
}


export interface StepProps {
  form: UseFormReturn<TeacherEnrollFormOutput>;
}