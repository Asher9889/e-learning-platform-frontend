export type ProgramType =
  | "SCHOOL"
  | "UNDERGRADUATE"
  | "POSTGRADUATE"
  | "DOCTORATE"
  | "CERTIFICATION"
  | "COACHING";

export interface Program {
  id: string;
  name: string;
  fullName?: string;
  programType: ProgramType;
  description?: string;
  durationMonths?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const PROGRAM_TYPES: { value: ProgramType; label: string }[] = [
  { value: "SCHOOL", label: "School" },
  { value: "UNDERGRADUATE", label: "Undergraduate" },
  { value: "POSTGRADUATE", label: "Postgraduate" },
  { value: "DOCTORATE", label: "Doctorate" },
  { value: "CERTIFICATION", label: "Certification" },
  { value: "COACHING", label: "Coaching" },
];

export const HIGHER_ED_TYPES: ProgramType[] = [
  "UNDERGRADUATE",
  "POSTGRADUATE",
  "DOCTORATE",
  "CERTIFICATION",
];
