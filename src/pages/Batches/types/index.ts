export interface Batch {
  id: string;
  programId: string;
  academicSession: string;
  name: string;
  maxStudents?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  program?: { id: string; name: string };
}

export const ACADEMIC_SESSIONS = [
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
  "2028-2029",
  "2029-2030",
];
