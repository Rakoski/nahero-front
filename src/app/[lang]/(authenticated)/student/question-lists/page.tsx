"use client";

import Link from "next/link";
import { ListChecks, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageError, PremiumBanner } from "@/components/shared";
import { ListCard } from "@/components/question-bank/list-card";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import { useMyQuestionLists } from "@/hooks/useQuestionLists";
import type { QuestionListSummary } from "@/services/question-lists/list-mine";
import type { Dictionary } from "@/dictionaries";

type IndexDict = Dictionary["questionBank"]["index"];

const LOCKED_PREVIEW_COUNTS = [
  { questionCount: 40, answeredCount: 32, daysAgo: 2 },
  { questionCount: 25, answeredCount: 10, daysAgo: 5 },
  { questionCount: 18, answeredCount: 18, daysAgo: 9 },
  { questionCount: 60, answeredCount: 21, daysAgo: 14 },
  { questionCount: 12, answeredCount: 3, daysAgo: 20 },
  { questionCount: 50, answeredCount: 0, daysAgo: 27 },
];

function buildLockedPreviewLists(names: string[]): QuestionListSummary[] {
  const today = new Date();
  return LOCKED_PREVIEW_COUNTS.map(({ questionCount, answeredCount, daysAgo }, index) => {
    const createdAt = new Date(today);
    createdAt.setDate(today.getDate() - daysAgo);
    return { id: index + 1, name: names[index] ?? "", questionCount, answeredCount, createdAt: createdAt.toISOString() };
  });
}

function PageHeader({ dict, newListHref }: { dict: IndexDict; newListHref: string }) {
  return (
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
  );
}

function ListGrid({ lists, listsHref, lang, dict }: { lists: QuestionListSummary[]; listsHref: string; lang: string; dict: IndexDict }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lists.map((list) => (
        <ListCard key={list.id} list={list} href={`${listsHref}/${list.id}`} lang={lang} dict={dict} />
      ))}
    </div>
  );
}

export default function QuestionListsPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.questionBank.index;
  const { data: lists, isLoading, isError, isPaywalled, refetch } = useMyQuestionLists();
  const listsHref = `/${lang}${Routes.QuestionLists}`;
  const newListHref = `/${lang}${Routes.QuestionListsNew}`;

  if (isPaywalled) {
    return (
      <div className="container mx-auto space-y-6 px-4 py-8">
        <PremiumBanner dict={dictionary.shared.premiumBanner.questionBank} from="question-lists" />

        <div aria-hidden="true" inert className="pointer-events-none space-y-8 blur-sm select-none">
          <PageHeader dict={dict} newListHref={newListHref} />
          <ListGrid lists={buildLockedPreviewLists(dict.previewNames)} listsHref={listsHref} lang={lang} dict={dict} />
        </div>
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
      <PageHeader dict={dict} newListHref={newListHref} />

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
        <ListGrid lists={lists} listsHref={listsHref} lang={lang} dict={dict} />
      )}
    </div>
  );
}
