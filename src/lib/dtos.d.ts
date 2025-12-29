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
