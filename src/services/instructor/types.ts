export type InstructorQuestionType = "OBJECTIVE" | "MULTIPLE_CHOICE" | "TRUE_FALSE";

export interface InstructorExam {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  difficultyLevel: number;
  practiceExamCount: number;
}

export interface InstructorPracticeExamSummary {
  id: number;
  slug: string;
  title: string;
  isActive: boolean;
  numberOfQuestions: number | null;
  questionCount: number;
  examId: number | null;
  examTitle: string | null;
  createdAt: string;
}

export interface InstructorDomain {
  id: number;
  name: string;
  minWeight: number | null;
  maxWeight: number | null;
  questionCount: number;
}

export interface InstructorPracticeExam {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  passingScore: number;
  timeLimit: number | null;
  numberOfQuestions: number | null;
  isActive: boolean;
  questionCount: number;
  questionCountByLanguage: Record<string, number>;
  exam: {
    id: number;
    title: string;
    category: string | null;
    difficultyLevel: number;
  } | null;
  domains: InstructorDomain[];
}

export interface InstructorQuestion {
  id: number;
  preview: string;
  type: InstructorQuestionType;
  language: string;
  domain: { id: number; name: string } | null;
  alternativeCount: number;
  correctCount: number;
  createdAt: string;
}
