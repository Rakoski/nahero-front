"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ArrowLeft, Bookmark, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineError, PremiumBanner } from "@/components/shared";
import { ListHeader } from "@/components/question-bank/list-header";
import { QuestionTable } from "@/components/question-bank/question-table";
import { QuestionDrawer } from "@/components/question-bank/question-drawer";
import { SelectionBar } from "@/components/question-bank/selection-bar";
import { CreateListDialog } from "@/components/question-bank/create-list-dialog";
import { QuestionBankProvider, toastClientError } from "@/components/question-bank/question-bank-context";
import type { QuestionRowItem } from "@/components/question-bank/question-columns";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import {
  useAddQuestionListQuestions,
  useMyQuestionLists,
  useQuestionList,
  useRemoveQuestionListQuestions,
} from "@/hooks/useQuestionLists";
import type { QuestionListSummary } from "@/services/question-lists/list-mine";

const NO_SELECTION = new Set<number>();

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function QuestionListPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <QuestionListDetail />
    </Suspense>
  );
}

function QuestionListDetail() {
  const { id } = useParams<{ id: string }>();
  const parsedId = Number(id);
  const listId = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.questionBank;
  const listsHref = `/${lang}${Routes.QuestionLists}`;

  const list = useQuestionList(listId);
  const lists = useMyQuestionLists();
  const addQuestions = useAddQuestionListQuestions();
  const removeQuestions = useRemoveQuestionListQuestions();

  const [selected, setSelected] = useState<Set<number>>(NO_SELECTION);
  const [drawerId, setDrawerId] = useState<number | null>(null);
  const [createIds, setCreateIds] = useState<number[] | null>(null);

  const listItems = useMemo(() => list.data?.pages.flatMap((page) => page.items) ?? [], [list.data]);
  const items = useMemo<QuestionRowItem[]>(
    () => listItems.map(({ questionId, ...rest }) => ({ id: questionId, ...rest })),
    [listItems],
  );
  const summary = list.data?.pages[0];

  const practiceUrl = (questionIds: number[]) => {
    const params = new URLSearchParams({ ids: questionIds.join(","), list: String(listId) });
    return `/${lang}${Routes.QuestionListsPractice}?${params}`;
  };

  const addSelectionTo = (target: QuestionListSummary) =>
    addQuestions.mutate(
      { listId: target.id, questionIds: [...selected] },
      {
        onSuccess: ({ added }) => {
          toast.success(dict.selection.added.replace("{{count}}", String(added)).replace("{{name}}", target.name));
          setSelected(NO_SELECTION);
        },
        onError: toastClientError,
      },
    );

  const removeSelection = () => {
    if (listId === null) return;
    const questionIds = [...selected];
    removeQuestions.mutate(
      { listId, questionIds },
      {
        onSuccess: () => {
          toast.success(dict.selection.removed.replace("{{count}}", String(questionIds.length)));
          setSelected(NO_SELECTION);
        },
        onError: toastClientError,
      },
    );
  };

  const selectWholeList = () =>
    list
      .loadAll()
      .then((all) => setSelected(new Set(all.map((item) => item.questionId))))
      .catch(toastClientError);

  const backLink = (
    <Button asChild variant="ghost" size="sm" className="-ml-2">
      <Link href={listsHref}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {dict.list.back}
      </Link>
    </Button>
  );

  if (list.isPaywalled || lists.isPaywalled) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PremiumBanner dict={dictionary.shared.premiumBanner.questionBank} from="question-lists" />
      </div>
    );
  }

  const notFound = listId === null || (list.error instanceof AxiosError && list.error.response?.status === 404);

  if (notFound) {
    return (
      <div className="container mx-auto space-y-4 px-4 py-8">
        {backLink}
        <p className="rounded-lg border p-6 text-center text-muted-foreground">{dict.list.notFound}</p>
      </div>
    );
  }

  if (list.isLoading) return <Spinner />;

  if (list.isError && !list.data) {
    return (
      <div className="container mx-auto space-y-4 px-4 py-8">
        {backLink}
        <div className="space-y-3 rounded-lg border p-6 text-center">
          <InlineError error={list.error} />
          <p className="text-sm text-muted-foreground">{dict.list.loadError}</p>
          <Button variant="outline" size="sm" onClick={() => list.refetch()}>
            {dictionary.error.btn_retry}
          </Button>
        </div>
      </div>
    );
  }

  const allLoadedSelected = items.length > 0 && items.every((item) => selected.has(item.id));
  const headerAction =
    allLoadedSelected && list.hasNextPage ? (
      <Button variant="link" size="sm" className="h-auto p-0" onClick={selectWholeList}>
        {dict.table.selectAllInList.replace("{{count}}", String(summary?.questionCount ?? items.length))}
      </Button>
    ) : null;

  return (
    <QuestionBankProvider currentListId={listId} requestCreate={setCreateIds} openQuestion={setDrawerId}>
      <div className="container mx-auto space-y-6 px-4 py-6 pb-28">
        {backLink}

        {summary && (
          <ListHeader
            listId={listId}
            name={summary.name}
            questionCount={summary.questionCount}
            answeredCount={summary.answeredCount}
            items={listItems}
            hasMore={list.hasNextPage}
            dict={dict}
            loadAll={list.loadAll}
            practiceOnOpen={searchParams.get("practice") === "1"}
            onPractice={(questionIds) => router.push(practiceUrl(questionIds))}
          />
        )}

        {items.length === 0 ? (
          <div className="space-y-3 rounded-lg border border-dashed p-10 text-center">
            <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="font-medium">{dict.empty.list}</p>
            <p className="text-sm text-muted-foreground">{dict.empty.listHint}</p>
            <Button asChild>
              <Link href={`${listsHref}/${listId}/add`}>
                <Plus className="mr-2 h-4 w-4" />
                {dict.list.addQuestions}
              </Link>
            </Button>
          </div>
        ) : (
          <QuestionTable
            items={items}
            selectedIds={selected}
            allMatching={false}
            hasNextPage={list.hasNextPage}
            isFetchingNextPage={list.isFetchingNextPage}
            isLoadMoreError={list.isFetchNextPageError}
            headerAction={headerAction}
            showListPicker
            dict={dict}
            onFetchNextPage={() => list.fetchNextPage()}
            onSelectionChange={setSelected}
          />
        )}

        {selected.size > 0 && (
          <SelectionBar
            label={dict.selection.count.replace("{{count}}", String(selected.size))}
            lists={lists.data}
            currentListId={listId}
            busy={addQuestions.isPending || removeQuestions.isPending}
            dict={dict}
            onAdd={addSelectionTo}
            onCreate={() => setCreateIds([...selected])}
            onRemove={removeSelection}
            onPractice={() => router.push(practiceUrl([...selected]))}
            onClear={() => setSelected(NO_SELECTION)}
          />
        )}

        <QuestionDrawer
          questionId={drawerId}
          listId={listId}
          showLists
          dict={dict}
          onClose={() => setDrawerId(null)}
        />
        <CreateListDialog
          source={createIds ? { kind: "selection", questionIds: createIds } : null}
          onClose={() => setCreateIds(null)}
          onCreated={() => setSelected(NO_SELECTION)}
        />
      </div>
    </QuestionBankProvider>
  );
}
