import { z } from "zod";
import type { Dictionary } from "@/dictionaries";
import type { InstructorQuestionType } from "@/services/instructor/types";

type QuestionsDict = Dictionary["instructor"]["wizard"]["questions"];

export const QUESTION_TYPES: InstructorQuestionType[] = ["OBJECTIVE", "MULTIPLE_CHOICE", "TRUE_FALSE"];
export const MAX_QUESTIONS_PER_BATCH = 50;
export const MIN_ALTERNATIVES = 2;
export const MAX_ALTERNATIVES = 10;

export const createQuestionsSchema = (dict: QuestionsDict) =>
  z.object({
    language: z.enum(["en", "pt"]),
    questions: z
      .array(
        z
          .object({
            type: z.enum(["OBJECTIVE", "MULTIPLE_CHOICE", "TRUE_FALSE"]),
            domainId: z.string().min(1, dict.domainRequired),
            content: z.string().trim().min(1, dict.contentRequired).max(10000, dict.tooLong),
            explanation: z.string().trim().max(10000, dict.tooLong),
            alternatives: z
              .array(
                z.object({
                  content: z.string().trim().min(1, dict.alternativeRequired).max(5000, dict.tooLong),
                  isCorrect: z.boolean(),
                }),
              )
              .min(MIN_ALTERNATIVES)
              .max(MAX_ALTERNATIVES),
          })
          .superRefine((question, context) => {
            const correct = question.alternatives.filter((alternative) => alternative.isCorrect).length;
            const issue = (message: string) => context.addIssue({ code: "custom", message, path: ["alternatives"] });

            if (question.type === "TRUE_FALSE" && question.alternatives.length !== 2) issue(dict.trueFalseSize);
            else if (correct === 0 || correct === question.alternatives.length) issue(dict.needsCorrect);
            else if (question.type !== "MULTIPLE_CHOICE" && correct !== 1) issue(dict.singleAnswer);
          }),
      )
      .min(1)
      .max(MAX_QUESTIONS_PER_BATCH),
  });

export type QuestionsFormData = z.infer<ReturnType<typeof createQuestionsSchema>>;

export type QuestionFormValues = QuestionsFormData["questions"][number];

export const blankAlternative = () => ({ content: "", isCorrect: false });

export const emptyQuestion = (domainId = ""): QuestionFormValues => ({
  type: "OBJECTIVE",
  domainId,
  content: "",
  explanation: "",
  alternatives: [blankAlternative(), blankAlternative(), blankAlternative(), blankAlternative()],
});
