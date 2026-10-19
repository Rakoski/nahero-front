"use client";

import { Suspense, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumBanner } from "@/components/shared";
import { QuestionPicker } from "@/components/question-bank/question-picker";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import { useAddQuestionsToList } from "./useAddQuestionsToList";

const FORM_ID = "add-questions-form";

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function AddToQuestionListPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AddToQuestionList />
    </Suspense>
  );
}

function AddToQuestionList() {
  const { id } = useParams<{ id: string }>();
  const listId = Number(id);
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.questionBank;
  const listsHref = `/${lang}${Routes.QuestionLists}`;
  const { picker, list, isListLoading, isListPaywalled, add, isAdding } = useAddQuestionsToList(listId);

  if (isListPaywalled) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PremiumBanner dict={dictionary.shared.premiumBanner.questionBank} from="question-lists" />
      </div>
    );
  }

  if (isListLoading) return <Spinner />;

  if (!list) {
    return (
      <div className="container mx-auto space-y-4 px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href={listsHref}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {dict.list.back}
          </Link>
        </Button>
        <p className="rounded-lg border p-6 text-center text-muted-foreground">{dict.list.notFound}</p>
      </div>
    );
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    add();
  };

  const header = (
    <form id={FORM_ID} onSubmit={submit} className="space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href={`${listsHref}/${list.id}`}>
          <ArrowLeft />
          {list.name}
        </Link>
      </Button>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-bold break-words sm:text-3xl">
            {dict.picker.addTitle.replace("{{name}}", list.name)}
          </h1>
          <p className="text-muted-foreground">{dict.picker.addSubtitle}</p>
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full shrink-0 px-8 text-base font-semibold sm:w-auto"
          disabled={isAdding}
        >
          {isAdding ? <Loader2 className="animate-spin" /> : <Plus />}
          {dict.picker.add}
        </Button>
      </div>
    </form>
  );

  return (
    <QuestionPicker
      picker={picker}
      header={header}
      formId={FORM_ID}
      submitLabel={dict.picker.add}
      isSubmitting={isAdding}
    />
  );
}
