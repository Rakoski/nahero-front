"use client";

import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ArrowRight, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InlineError } from "@/components/shared";
import { useLocale } from "@/providers/locale-provider";
import { useCreateInstructorQuestions } from "@/hooks/useInstructor";
import { usePracticeExamWizard } from "./practice-exam-wizard-provider";
import { QuestionFields } from "./question-fields";
import { SavedQuestions } from "./saved-questions";
import {
  createQuestionsSchema,
  emptyQuestion,
  MAX_QUESTIONS_PER_BATCH,
  type QuestionsFormData,
} from "./question-schema";

const LANGUAGES = ["en", "pt"] as const;

export function QuestionsStep() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.instructor.wizard.questions;
  const { practiceExam, goTo } = usePracticeExamWizard();
  const { mutate, isPending, error } = useCreateInstructorQuestions();
  const form = useForm<QuestionsFormData>({
    resolver: zodResolver(createQuestionsSchema(dict)),
    defaultValues: { language: lang, questions: [emptyQuestion()] },
  });
  const questions = useFieldArray({ control: form.control, name: "questions" });
  const language = useWatch({ control: form.control, name: "language" });

  if (!practiceExam) return null;

  const addQuestion = () => {
    const last = form.getValues(`questions.${questions.fields.length - 1}`);
    questions.append(emptyQuestion(last?.domainId));
  };

  const submit = (values: QuestionsFormData) =>
    mutate(
      {
        practiceExamId: practiceExam.id,
        language: values.language,
        questions: values.questions.map((question) => ({
          type: question.type,
          domainId: Number(question.domainId),
          content: question.content,
          explanation: question.explanation || undefined,
          alternatives: question.alternatives,
        })),
      },
      {
        onSuccess: ({ created }) => {
          toast.success(dict.saved.replace("{{count}}", String(created)));
          form.reset({ language: values.language, questions: [emptyQuestion()] });
        },
      },
    );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dict.title}</CardTitle>
          <CardDescription>{dict.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
              <div className="max-w-xs space-y-2">
                <span className="text-sm font-medium">{dict.language}</span>
                <Select
                  value={language}
                  onValueChange={(value) => form.setValue("language", value as QuestionsFormData["language"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((language) => (
                      <SelectItem key={language} value={language}>
                        {dict.languages[language]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {questions.fields.map((question, index) => (
                <QuestionFields
                  key={question.id}
                  index={index}
                  domains={practiceExam.domains}
                  dict={dict}
                  canRemove={questions.fields.length > 1}
                  onRemove={() => questions.remove(index)}
                />
              ))}

              <InlineError error={error} />

              <div className="flex flex-wrap justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={questions.fields.length >= MAX_QUESTIONS_PER_BATCH}
                  onClick={addQuestion}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {dict.addQuestion}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {dict.submit.replace("{{count}}", String(questions.fields.length))}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <SavedQuestions practiceExamId={practiceExam.id} />
          <div className="flex justify-end border-t pt-4">
            <Button disabled={practiceExam.questionCount === 0} onClick={() => goTo("review")}>
              {dictionary.instructor.wizard.continue}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
