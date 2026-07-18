export const TOTAL_PROGRAM_TYPES = {
  SCHOOL: "SCHOOL",
  DIPLOMA: "DIPLOMA",
  UNDERGRADUATE: "UNDERGRADUATE",
  POSTGRADUATE: "POSTGRADUATE",
  PROFESSIONAL: "PROFESSIONAL",
} as const;

export type ProgramType =
  typeof TOTAL_PROGRAM_TYPES[keyof typeof TOTAL_PROGRAM_TYPES];

export type ProgramMode = "ONLINE" | "OFFLINE" | "HYBRID";

export type FeeType = "ONE_TIME" | "MONTHLY" | "QUARTERLY" | "SEMESTER" | "YEARLY";

export interface Program {
  id: string;
  name: string;
  fullName?: string;
  thumbnail?: string;
  programType: ProgramType;
  mode: ProgramMode;
  feeAmount?: number;
  feeType?: FeeType;
  benefits?: string[];
  featured?: boolean;
  description?: string;
  durationMonths?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const PROGRAM_TYPES: { value: ProgramType; label: string }[] = [
  { value: "SCHOOL", label: "School" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "UNDERGRADUATE", label: "Undergraduate" },
  { value: "POSTGRADUATE", label: "Postgraduate" },
  { value: "PROFESSIONAL", label: "Professional" },
];
