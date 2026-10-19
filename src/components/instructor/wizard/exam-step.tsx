"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InlineError } from "@/components/shared";
import { useLocale } from "@/providers/locale-provider";
import { useCreateExam, useInstructorExams } from "@/hooks/useInstructor";
import type { Dictionary } from "@/dictionaries";
import { usePracticeExamWizard } from "./practice-exam-wizard-provider";
import { ChoiceToggle } from "./choice-toggle";

type ExamDict = Dictionary["instructor"]["wizard"]["exam"];

const createSchema = (dict: ExamDict) =>
  z.object({
    title: z.string().trim().min(1, dict.titleRequired).max(200, dict.tooLong),
    description: z.string().trim().max(2000, dict.tooLong),
    category: z.string().trim().max(100, dict.tooLong),
    difficultyLevel: z.string(),
  });

type ExamFormData = z.infer<ReturnType<typeof createSchema>>;

function NewExamForm({ onCreated }: { onCreated: (examId: number) => void }) {
  const { dict: dictionary } = useLocale();
  const dict = dictionary.instructor.wizard.exam;
  const { mutate, isPending, error } = useCreateExam();
  const form = useForm<ExamFormData>({
    resolver: zodResolver(createSchema(dict)),
    defaultValues: { title: "", description: "", category: "", difficultyLevel: "3" },
  });

  const submit = (values: ExamFormData) =>
    mutate(
      {
        title: values.title,
        description: values.description || undefined,
        category: values.category || undefined,
        difficultyLevel: Number(values.difficultyLevel),
      },
      {
        onSuccess: (created) => {
          toast.success(dict.created);
          onCreated(created.id);
        },
      },
    );

  return (
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
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.category}</FormLabel>
                <FormControl>
                  <Input placeholder={dict.categoryPlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficultyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.difficulty}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dict.difficultyLevels.map((label, index) => (
                      <SelectItem key={label} value={String(index + 1)}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <InlineError error={error} />

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {dict.submit}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ExamStep() {
  const { dict: dictionary } = useLocale();
  const dict = dictionary.instructor.wizard.exam;
  const { examId, practiceExam, selectExam, goTo } = usePracticeExamWizard();
  const exams = useInstructorExams();
  const [choice, setChoice] = useState<"existing" | "new" | null>(null);
  const [pickedId, setPickedId] = useState<string>(examId ? String(examId) : "");

  if (practiceExam?.exam) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{dict.title}</CardTitle>
          <CardDescription>{dict.locked}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <p className="font-medium">{practiceExam.exam.title}</p>
            {practiceExam.exam.category && (
              <p className="text-sm text-muted-foreground">{practiceExam.exam.category}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => goTo("practiceExam")}>
              {dictionary.instructor.wizard.continue}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (exams.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const myExams = exams.data ?? [];
  const mode = choice ?? (myExams.length > 0 ? "existing" : "new");
  const selected = myExams.find((exam) => exam.id === examId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {selected && (
          <p className="rounded-lg border bg-muted/30 p-3 text-sm">
            {dict.selected.replace("{{title}}", selected.title)}
          </p>
        )}

        <InlineError error={exams.error} />

        {myExams.length > 0 && (
          <ChoiceToggle
            value={mode}
            onChange={setChoice}
            options={[
              { value: "existing", label: dict.useExisting },
              { value: "new", label: dict.createNew },
            ]}
          />
        )}

        {mode === "existing" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium">{dict.select}</span>
              <Select value={pickedId} onValueChange={setPickedId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={dict.selectPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {myExams.map((exam) => (
                    <SelectItem key={exam.id} value={String(exam.id)}>
                      {exam.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button disabled={!pickedId} onClick={() => selectExam(Number(pickedId))}>
                {dict.useSelected}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <NewExamForm onCreated={selectExam} />
        )}
      </CardContent>
    </Card>
  );
}
