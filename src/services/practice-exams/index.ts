import { listPracticeExams } from "./list";
import { listAllPracticeExams } from "./list-all";
import { listFirstPracticeExamsPage } from "./list-first-page";
import { getPracticeExamBySlug } from "./get-by-slug";
import { getSampleQuestions } from "./get-sample-questions";

export const practiceExamsService = {
  listPracticeExams,
  listAllPracticeExams,
  listFirstPracticeExamsPage,
  getPracticeExamBySlug,
  getSampleQuestions,
};
