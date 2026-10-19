export const NAHERO_API = {
  PRACTICE_EXAMS: {
    LIST: "/practice-exams/list",
    GET_BY_SLUG: "/practice-exams/by-slug",
    GET_SAMPLE_QUESTIONS: (slug: string) =>
      `/practice-exams/by-slug/${encodeURIComponent(slug)}/sample-questions`,
  },
  FEEDBACK: {
    GET_PAGE: "/feedback",
    ANSWER_PRACTICE_QUESTION: (questionId: string | number) =>
      `/feedback/practice-questions/${questionId}/answer`,
  },
  STUDENT_PRACTICE_ATTEMPTS: {
    CREATE: "/student-practice-attempts",
    FINISH: "/student-practice-attempts/finish",
    ABANDON: (attemptId: string | number) =>
      `/student-practice-attempts/${attemptId}/abandon`,
    TIMEOUT: (attemptId: string | number) =>
      `/student-practice-attempts/${attemptId}/timeout`,
    GET_RESULT: "/student-practice-attempts",
    GET_HISTORY: "/student-practice-attempts/history",
    GET_DASHBOARD_SUMMARY: "/student-practice-attempts/dashboard-summary",
    GET_IN_PROGRESS: "/student-practice-attempts/in-progress",
    GET_STATE: (attemptId: string | number) =>
      `/student-practice-attempts/${attemptId}/state`,
    SAVE_PROGRESS: (attemptId: string | number) =>
      `/student-practice-attempts/${attemptId}/progress`,
    GET_FEEDBACK: (attemptId: string | number) =>
      `/student-practice-attempts/${attemptId}/feedback`,
  },
  QUESTION_BANK: {
    FILTERS: "/question-bank/filters",
    LIST: "/question-bank",
    GET_QUESTION: (questionId: string | number) =>
      `/question-bank/questions/${questionId}`,
    ANSWER_QUESTION: (questionId: string | number) =>
      `/question-bank/questions/${questionId}/answer`,
  },
  QUESTION_LISTS: {
    CREATE: "/question-lists",
    LIST_MINE: "/question-lists",
    GET: (listId: string | number) => `/question-lists/${listId}`,
    DELETE: (listId: string | number) => `/question-lists/${listId}`,
    ADD_QUESTIONS: (listId: string | number) =>
      `/question-lists/${listId}/questions`,
    REMOVE_QUESTION: (listId: string | number, questionId: string | number) =>
      `/question-lists/${listId}/questions/${questionId}`,
    ANSWER_QUESTION: (listId: string | number, questionId: string | number) =>
      `/question-lists/${listId}/questions/${questionId}/answer`,
  },
  INSTRUCTOR: {
    EXAMS: "/instructor/exams",
    PRACTICE_EXAMS: "/instructor/practice-exams",
    PRACTICE_EXAM: (practiceExamId: string | number) =>
      `/instructor/practice-exams/${practiceExamId}`,
    PRACTICE_EXAM_STATUS: (practiceExamId: string | number) =>
      `/instructor/practice-exams/${practiceExamId}/status`,
    DOMAINS: (practiceExamId: string | number) =>
      `/instructor/practice-exams/${practiceExamId}/domains`,
    DOMAIN: (practiceExamId: string | number, domainId: string | number) =>
      `/instructor/practice-exams/${practiceExamId}/domains/${domainId}`,
    QUESTIONS: (practiceExamId: string | number) =>
      `/instructor/practice-exams/${practiceExamId}/questions`,
    QUESTION: (practiceExamId: string | number, questionId: string | number) =>
      `/instructor/practice-exams/${practiceExamId}/questions/${questionId}`,
  },
  QUESTITONS: {
    LIST_STUDENT: "/questions/list-student",
  },
  ALTERNATIVES: {
    LIST_BY_QUESTION: "/alternatives",
  },
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USERS: {
    REGISTER: "/users",
    VERIFY_EMAIL: "/users/verify-email",
    RESEND_VERIFICATION: "/users/verify-email/resend",
  },
  PAYMENT: {
    CREATE_CHECKOUT_SUBSCRIPTION: "/payment/checkout/subscription",
  },
  SUBSCRIPTION: {
    GET: "/subscription",
    CANCEL: "/subscription/cancel",
  },
};
