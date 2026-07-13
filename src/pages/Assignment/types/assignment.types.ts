import type { QuestionPaper } from "./question-paper.types";

export interface AssignmentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "DRAFT" | "PUBLISHED";
  assessmentType?: "ASSIGNMENT";
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  subjectId?: string;
  programId?: string;
}

// export interface Assignment {
//   id: string;
//   title: string;
//   instructions: string;
//   assessmentType: "ASSIGNMENT";
//   difficulty: "EASY" | "MEDIUM" | "HARD";
//   status: "DRAFT" | "PUBLISHED";
//   questionCount: number;
//   totalMarks: number;
//   subjectId: string;
//   batchId: string;
//   createdAt: string;
//   updatedAt: string;
// }

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  questions: number;
  marks: number;
  duration: number;
  status: "PUBLISHED";
  attempted: boolean;
  score?: number;
}
export interface AssignmentsResponse {
  success: boolean;
  message: string;
  data: {
    assessments: QuestionPaper[];
    totalAssessments: number;
  };
}