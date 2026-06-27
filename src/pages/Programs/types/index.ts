export const TOTAL_PROGRAM_TYPES = {
  SCHOOL: "SCHOOL",
  UNDERGRADUATE: "UNDERGRADUATE",
  POSTGRADUATE: "POSTGRADUATE",
  DOCTORATE: "DOCTORATE",
  CERTIFICATION: "CERTIFICATION",
  COACHING: "COACHING",
} as const;

export type ProgramType =
  typeof TOTAL_PROGRAM_TYPES[keyof typeof TOTAL_PROGRAM_TYPES];
// export type ProgramType =
//   | "SCHOOL"
//   | "UNDERGRADUATE"
//   | "POSTGRADUATE"
//   | "DOCTORATE"
//   | "CERTIFICATION"
//   | "COACHING";
export type PROGRAM_MODES = 
 | "Online"
| "Offline"
  | "Hybrid";


  export type FEE_TYPES = 
 | "One Time"
  |"Monthly"
  |"Quarterly"
  |"Semester"
  |"Yearly";
export interface Program {
  id: string;
  name: string;
  fullName?: string;
   thumbnail?: string;
  programType: ProgramType;
  mode:PROGRAM_MODES;
  feeAmount?: number;
  feeType?: FEE_TYPES;
  benefits?: string[];
  featured?: boolean;
  description?: string;
  durationMonths?: number ;
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
