import { listInstructorExams } from "./list-exams";
import { createExam } from "./create-exam";
import { listInstructorPracticeExams } from "./list-practice-exams";
import { createPracticeExam } from "./create-practice-exam";
import { getInstructorPracticeExam } from "./get-practice-exam";
import { updatePracticeExamStatus } from "./update-status";
import { addPracticeExamDomains } from "./add-domains";
import { removePracticeExamDomain } from "./remove-domain";
import { listInstructorQuestions } from "./list-questions";
import { createInstructorQuestions } from "./create-questions";
import { deleteInstructorQuestion } from "./delete-question";

export const instructorService = {
  listInstructorExams,
  createExam,
  listInstructorPracticeExams,
  createPracticeExam,
  getInstructorPracticeExam,
  updatePracticeExamStatus,
  addPracticeExamDomains,
  removePracticeExamDomain,
  listInstructorQuestions,
  createInstructorQuestions,
  deleteInstructorQuestion,
};
