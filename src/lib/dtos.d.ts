// Backend DTOs matching Java response structures

/**
 * Practice Exam List Response - matches ListPracticeExamsResponse.java
 */
export interface PracticeExamTeacher {
  id: number;
  name: string;
}

export interface PracticeExamExam {
  id: number;
  title: string;
  difficultyLevel: number;
}

export interface PracticeExamDTO {
  id: number;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  teacher: PracticeExamTeacher;
  exam: PracticeExamExam;
}

/**
 * Paginated Response Structure
 * Matches Spring Boot Page<T> structure
 */
export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export type PracticeExamsPageableResponse = PageableResponse<PracticeExamDTO>;

/**
 * Question Type - matches QuestionType entity
 */
export interface QuestionType {
  id: number;
  name: string;
}

/**
 * Question Response for Student - matches ListQuestionsByStudentResponse.java
 */
export interface ListQuestionsByStudentResponse {
  timeLimit: number;
  id: string;
  content: string;
  imageUrl?: string;
  points: number;
  questionType: QuestionType;
}

/**
 * Simplified Page Response Structure
 * Mirrors Spring Boot Page<T> interface with essential fields
 */
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Current page index
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type QuestionsPageResponse =
  PageResponse<ListQuestionsByStudentResponse>;

/**
 * Alternative Response - matches ListAlternativeByQuestionResponse.java
 */
export interface ListAlternativeByQuestionResponse {
  id: number;
  imageUrl?: string;
  content: string;
}

/**
 * Answer Request for finishing exam - matches AnswerRequest inside FinishStudentPracticeAttemptRequest.java
 */
export interface AnswerRequest {
  questionId: string;
  alternativeIds?: string[]; // MULTIPLE_CHOICE, TRUE_FALSE, OBJECTIVE
  descriptiveAnswer?: string; // DESCRIPTIVE
  sumAnswer?: number; // SUM
}

/**
 * Finish Exam Request - matches FinishStudentPracticeAttemptRequest.java
 */
export interface FinishStudentPracticeAttemptRequest {
  studentPracticeAttemptId: number;
  answers: AnswerRequest[];
}

/**
 * Finish Exam Response - matches FinishStudentPracticeAttemptResponse.java
 */
export interface FinishStudentPracticeAttemptResponse {
  passed: boolean;
  score: number;
  answers: number;
  correctAnswers: number;
  incorrectAnswers: number;
  startTime: string;
  endTime: string;
  timeLimit: number;
  timeSpentInMinutes: number;
  passingPercentageScore: number;
  attemptStatus: string;
  numberOfQuestions: number;
}

export interface AlternativeResponse {
  alternativeId: number;
  alternativeVersion: number;
  content: string;
  imageUrl: string | null;
  isCorrect: boolean;
  isActive: boolean;
}

export interface ListAnsweredAnswersResponse {
  // Student Answer fields
  studentAnswerId: number;
  studentPracticeAttemptId: number;
  questionId: number;
  questionVersion: number;
  selectedAlternativeId: number | null;
  selectedAlternativeVersion: number | null;
  isCorrect: boolean | null;

  // Question fields
  questionContent: string;
  questionImageUrl: string | null;
  questionPoints: number;
  questionType: string;
  explanation: string | null;

  // Alternatives list
  alternatives: AlternativeResponse[];
}

// If you need a paginated response wrapper
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page number
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
