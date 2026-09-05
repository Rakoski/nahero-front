export const NAHERO_API = {
  PRACTICE_EXAMS: {
    LIST: "/practice-exams/list",
    GET_BY_SLUG: "/practice-exams/by-slug",
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
