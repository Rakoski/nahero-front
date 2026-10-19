"use client";

import Link from "next/link";
import { ListChecks, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageError, PremiumBanner } from "@/components/shared";
import { ListCard } from "@/components/question-bank/list-card";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import { useMyQuestionLists } from "@/hooks/useQuestionLists";

export default function QuestionListsPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.questionBank.index;
  const { data: lists, isLoading, isError, isPaywalled, refetch } = useMyQuestionLists();
  const listsHref = `/${lang}${Routes.QuestionLists}`;
  const newListHref = `/${lang}${Routes.QuestionListsNew}`;

  if (isPaywalled) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PremiumBanner dict={dictionary.shared.premiumBanner.questionBank} from="question-lists" />
      </div>
    );
  }

  if (isError && !lists) {
    return (
      <PageError
        title={dictionary.error.title}
        description={dict.loadError}
        retryLabel={dictionary.error.btn_retry}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{dict.title}</h1>
          <p className="text-muted-foreground">{dict.subtitle}</p>
        </div>
        <Button asChild>
          <Link href={newListHref}>
            <Plus className="mr-2 h-4 w-4" />
            {dict.newList}
          </Link>
        </Button>
      </div>

      {isLoading || !lists ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : lists.length === 0 ? (
        <div className="space-y-3 rounded-lg border border-dashed p-10 text-center">
          <ListChecks className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="font-medium">{dict.empty}</p>
          <p className="text-sm text-muted-foreground">{dict.emptyHint}</p>
          <Button asChild>
            <Link href={newListHref}>
              <Plus className="mr-2 h-4 w-4" />
              {dict.emptyCta}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} href={`${listsHref}/${list.id}`} lang={lang} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}
