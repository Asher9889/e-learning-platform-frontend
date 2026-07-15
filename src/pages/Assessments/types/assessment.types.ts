export type AssessmentStatus =
  | "DRAFT"
  | "PUBLISHED";

export interface AssessmentQuestion {
  question: string;
  marks: number;
  difficulty: string;
  explanation: string;
  type: string;
  options: string[];
  correctAnswer: string;
  id: string;
  number: number;
}

export interface Assessment {
  id: string;

  title: string;

  instructions: string;

  assessmentType: string;

  subjectId: string;

  batchId: string[];

  topic: string[];

  difficulty: string;

  questionTypes: string[];

  questionCount: number;

  totalMarks: number;

  additionalInstructions: string;

  questions: AssessmentQuestion[];

  status: AssessmentStatus;

  createdBy: string;

  createdAt: string;

  updatedAt: string;
}

export interface AssessmentsResponse {
  assessments: Assessment[];
  totalAssessments: number;
}

export interface AssessmentApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AssessmentsResponse;
}