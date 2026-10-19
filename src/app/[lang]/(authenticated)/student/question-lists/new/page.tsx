"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { QuestionPicker } from "@/components/question-bank/question-picker";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import { useNewQuestionList } from "./useNewQuestionLists";
import type { Dictionary } from "@/dictionaries";

const MAX_LIST_SIZE = 200;
const FORM_ID = "new-question-list-form";

type PickerDict = Dictionary["questionBank"]["picker"];

const MAX_NAME_LENGTH = 120;

const isValidCount = (value: string) =>
  value === "" ||
  (/^\d+$/.test(value) &&
    Number(value) >= 1 &&
    Number(value) <= MAX_LIST_SIZE);

const createSchema = (dict: PickerDict) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, dict.nameRequired)
        .max(MAX_NAME_LENGTH, dict.nameTooLong),
      count: z.string().trim(),
    })
    .superRefine(({ name, count }, ctx) => {
      const nameIsValid = name.length >= 1 && name.length <= MAX_NAME_LENGTH;
      if (nameIsValid && !isValidCount(count)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["count"], message: dict.countInvalid });
      }
    });

type NewListFormData = z.infer<ReturnType<typeof createSchema>>;

export default function NewQuestionListPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <NewQuestionList />
    </Suspense>
  );
}

function NewQuestionList() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.questionBank.picker;
  const { picker, create, isCreating } = useNewQuestionList();

  const form = useForm<NewListFormData>({
    resolver: zodResolver(createSchema(dict)),
    defaultValues: { name: "", count: "" },
  });

  const header = (
    <div className="space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href={`/${lang}${Routes.QuestionLists}`}>
          <ArrowLeft />
          {dict.back}
        </Link>
      </Button>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">{dict.createTitle}</h1>
        <p className="text-muted-foreground">{dict.createSubtitle}</p>
      </div>
      <Form {...form}>
        <form
          id={FORM_ID}
          onSubmit={form.handleSubmit(create)}
          className="max-w-3xl"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.name}</FormLabel>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <FormControl>
                    <Input
                      placeholder={dict.namePlaceholder}
                      autoFocus
                      className="h-12 text-base md:text-base"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 w-full px-8 text-base font-semibold sm:w-auto"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Plus />
                    )}
                    {dict.create}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );

  const countField = (
    <Form {...form}>
      <FormField
        control={form.control}
        name="count"
        render={({ field }) => (
          <FormItem className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <FormLabel className="text-sm font-normal text-muted-foreground">
              {dict.howMany}
            </FormLabel>
            <FormControl>
              <Input
                form={FORM_ID}
                inputMode="numeric"
                placeholder={String(MAX_LIST_SIZE)}
                title={dict.howManyHint}
                className="h-10 w-20"
                {...field}
              />
            </FormControl>
            <span className="text-xs text-muted-foreground">
              {dict.howManyHint}
            </span>
            <FormMessage className="basis-full text-xs" />
          </FormItem>
        )}
      />
    </Form>
  );

  return (
    <QuestionPicker
      picker={picker}
      header={header}
      formId={FORM_ID}
      submitLabel={dict.create}
      isSubmitting={isCreating}
      matchingExtra={countField}
    />
  );
}
