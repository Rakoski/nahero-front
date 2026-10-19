"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InlineError } from "@/components/shared";
import { useLocale } from "@/providers/locale-provider";
import { useCreatePracticeExam } from "@/hooks/useInstructor";
import type { Dictionary } from "@/dictionaries";
import { usePracticeExamWizard } from "./practice-exam-wizard-provider";

type PracticeExamDict = Dictionary["instructor"]["wizard"]["practiceExam"];

const wholeNumber = (min: number, max: number, message: string) =>
  z
    .string()
    .trim()
    .refine((value) => /^\d+$/.test(value) && Number(value) >= min && Number(value) <= max, message);

const createSchema = (dict: PracticeExamDict) =>
  z.object({
    title: z.string().trim().min(1, dict.titleRequired).max(200, dict.tooLong),
    description: z.string().trim().min(1, dict.descriptionRequired).max(2000, dict.tooLong),
    passingScore: wholeNumber(1, 100, dict.passingScoreInvalid),
    timeLimit: wholeNumber(1, 600, dict.timeLimitInvalid),
    numberOfQuestions: wholeNumber(1, 500, dict.numberOfQuestionsInvalid),
  });

type PracticeExamFormData = z.infer<ReturnType<typeof createSchema>>;

const NUMBER_FIELDS = ["passingScore", "timeLimit", "numberOfQuestions"] as const;

export function PracticeExamStep() {
  const { dict: dictionary } = useLocale();
  const dict = dictionary.instructor.wizard.practiceExam;
  const { examId, practiceExam, practiceExamCreated, goTo } = usePracticeExamWizard();
  const { mutate, isPending, error } = useCreatePracticeExam();
  const form = useForm<PracticeExamFormData>({
    resolver: zodResolver(createSchema(dict)),
    defaultValues: { title: "", description: "", passingScore: "70", timeLimit: "90", numberOfQuestions: "65" },
  });

  if (practiceExam) {
    const summary = [
      { label: dict.passingScore, value: practiceExam.passingScore },
      { label: dict.timeLimit, value: practiceExam.timeLimit ?? "—" },
      { label: dict.numberOfQuestions, value: practiceExam.numberOfQuestions ?? "—" },
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle>{dict.title}</CardTitle>
          <CardDescription>{dict.locked}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 rounded-lg border p-4">
            <p className="font-medium break-words">{practiceExam.title}</p>
            <p className="text-sm whitespace-pre-line text-muted-foreground">{practiceExam.description}</p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-3">
            {summary.map((item) => (
              <div key={item.label} className="rounded-lg border p-3">
                <dt className="text-xs text-muted-foreground">{item.label}</dt>
                <dd className="text-lg font-semibold">{item.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex justify-end">
            <Button onClick={() => goTo("domains")}>
              {dictionary.instructor.wizard.continue}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const submit = (values: PracticeExamFormData) => {
    if (!examId) return;

    mutate(
      {
        examId,
        title: values.title,
        description: values.description,
        passingScore: Number(values.passingScore),
        timeLimit: Number(values.timeLimit),
        numberOfQuestions: Number(values.numberOfQuestions),
      },
      {
        onSuccess: (created) => {
          toast.success(dict.created);
          practiceExamCreated(created.id);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.name}</FormLabel>
                  <FormControl>
                    <Input placeholder={dict.namePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.descriptionLabel}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder={dict.descriptionPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {NUMBER_FIELDS.map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dict[name]}</FormLabel>
                      <FormControl>
                        <Input inputMode="numeric" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{dict.numberOfQuestionsHint}</p>

            <InlineError error={error} />

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending || !examId}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {dict.submit}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
