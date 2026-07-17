export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "MIXED";

export type QuestionType = "MCQ" | "QUESTION_ANSWERE";

export interface Question {
  id: string;
  number: number;
  question: string;
  type: QuestionType;
  marks: number;
  difficulty: Difficulty;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuestionPaper {
  id: string;
  title: string;
  instructions: string;
  assessmentType: "QUESTION-PAPER";
  subjectId: string;
  batchId: string;
  topic: string[];
  difficulty: Difficulty;
  questionTypes: QuestionType[];
  questionCount: number;
  totalMarks: number;
  additionalInstructions: string;
  questions: Question[];
  status: "PUBLISHED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type SubmitAssessmentPayload = {
  assessmentId: string;
  answers: Record<string, string>;
};

export type AssessmentReview = {
  questionId: string;
  number: number;
  question: string;
  id:string;
  selectedAnswer?: string;

  correctAnswer: string;

  explanation?: string;

  isCorrect: boolean;

  marks: number;
};

export type AssessmentResult = {
  assessmentId: string;

  title: string;

  obtainedMarks: number;

  totalMarks: number;

  correctCount: number;

  wrongCount: number;

  skippedCount: number;

  percentage: number;

  reviews: AssessmentReview[];
};