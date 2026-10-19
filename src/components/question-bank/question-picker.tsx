"use client";

import { useState, type ReactNode } from "react";
import { Layers, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineError, PageError, PremiumBanner } from "@/components/shared";
import { FilterBar } from "@/components/question-bank/filter-bar";
import { QuestionTable } from "@/components/question-bank/question-table";
import { QuestionDrawer } from "@/components/question-bank/question-drawer";
import { QuestionBankProvider } from "@/components/question-bank/question-bank-context";
import { useLocale } from "@/providers/locale-provider";
import {
  NO_PICKER_SELECTION,
  type QuestionPickerState,
} from "@/hooks/useQuestionPicker";
import { cn } from "@/lib/utils";

const NO_OP = () => {};
const NO_IDS = new Set<number>();

interface QuestionPickerProps {
  picker: QuestionPickerState;
  header: ReactNode;
  formId: string;
  submitLabel: string;
  isSubmitting: boolean;
  matchingExtra?: ReactNode;
}

export function QuestionPicker({
  picker,
  header,
  formId,
  submitLabel,
  isSubmitting,
  matchingExtra,
}: QuestionPickerProps) {
  const { dict: dictionary } = useLocale();
  const dict = dictionary.questionBank;
  const {
    filter,
    setFilter,
    clearFilters,
    filters,
    bank,
    items,
    selection,
    setSelection,
    selectedCount,
    hasSelection,
  } = picker;
  const [drawerId, setDrawerId] = useState<number | null>(null);
  const isMatching = selection.kind === "matching";
  const isUpdating = bank.isPlaceholderData;
  const canUseAllMatching =
    !isMatching &&
    items.length > 0 &&
    (selectedCount === 0 ||
      (selection.kind === "ids" &&
        selectedCount === items.length &&
        items.every((item) => selection.ids.has(item.id)) &&
        bank.hasNextPage));

  if (picker.isPaywalled) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PremiumBanner
          dict={dictionary.shared.premiumBanner.questionBank}
          from="question-lists"
        />
      </div>
    );
  }

  if (filters.isError && !filters.data) {
    return (
      <PageError
        title={dictionary.error.title}
        description={dict.loadError}
        retryLabel={dictionary.error.btn_retry}
        onRetry={() => filters.refetch()}
      />
    );
  }

  const toolbar = isUpdating ? (
    <span className="inline-flex items-center gap-2 text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {dict.picker.updating}
    </span>
  ) : isMatching ? (
    <span className="inline-flex items-center gap-2 font-medium">
      <Layers className="size-4 shrink-0" />
      {dict.table.allMatchingSelected}
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 text-muted-foreground">
      {dict.picker.hint}
    </span>
  );

  const renderQuestions = () => {
    if (bank.isLoading) {
      return (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (bank.isError && !bank.data) {
      return (
        <div className="space-y-3 rounded-lg border p-6 text-center">
          <InlineError error={bank.error} />
          <p className="text-sm text-muted-foreground">{dict.loadError}</p>
          <Button variant="outline" onClick={() => bank.refetch()}>
            {dictionary.error.btn_retry}
          </Button>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="space-y-4 rounded-lg border border-dashed p-10 text-center">
          <p className="text-muted-foreground">{dict.empty.bank}</p>
          <Button
            variant="outline"
            className="h-11 px-5"
            onClick={clearFilters}
          >
            {dict.empty.clearFilters}
          </Button>
        </div>
      );
    }

    return (
      <QuestionTable
        variant="picker"
        items={items}
        selectedIds={selection.kind === "ids" ? selection.ids : NO_IDS}
        allMatching={isMatching}
        hasNextPage={bank.hasNextPage}
        isFetchingNextPage={bank.isFetchingNextPage}
        isLoadMoreError={bank.isFetchNextPageError}
        headerAction={toolbar}
        dict={dict}
        onFetchNextPage={() => bank.fetchNextPage()}
        onSelectionChange={(ids) => setSelection({ kind: "ids", ids })}
      />
    );
  };

  const summary = isMatching ? (
    <span className="inline-flex items-center gap-2 text-sm font-medium">
      <Layers className="size-5 shrink-0" />
      {dict.picker.matchingSelected}
    </span>
  ) : selectedCount > 0 ? (
    <span className="inline-flex items-center gap-3 text-sm font-medium">
      <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-primary px-2.5 text-base font-bold text-primary-foreground tabular-nums">
        {selectedCount}
      </span>
      {selectedCount === 1 ? dict.picker.selectedOne : dict.picker.selectedMany}
    </span>
  ) : (
    <span className="text-sm text-muted-foreground">
      {dict.picker.barEmpty}
    </span>
  );

  return (
    <QuestionBankProvider
      currentListId={null}
      requestCreate={NO_OP}
      openQuestion={setDrawerId}
    >
      <div className="container mx-auto space-y-6 px-4 pt-6 pb-52 sm:pb-36">
        {header}

        <FilterBar
          filter={filter}
          exams={filters.data ?? []}
          dict={dict.filters}
          onChange={setFilter}
          onClear={clearFilters}
        />

        <div
          aria-busy={isUpdating}
          className={cn(
            "transition-opacity",
            isUpdating && "pointer-events-none opacity-60",
          )}
        >
          {renderQuestions()}
        </div>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center sm:bottom-4 sm:px-4">
          <div
            key={hasSelection ? "active" : "idle"}
            className={cn(
              "pointer-events-auto flex w-full flex-col gap-3 border-t bg-popover p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl transition-[translate,opacity] duration-300 starting:translate-y-4 starting:opacity-0 sm:w-auto sm:max-w-4xl sm:flex-row sm:items-center sm:gap-4 sm:rounded-2xl sm:border sm:p-2 sm:pl-4",
              hasSelection && "border-primary/60 sm:ring-1 sm:ring-primary/40",
            )}
          >
            <div
              aria-live="polite"
              className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2"
            >
              {summary}
              {isMatching && matchingExtra}
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              {canUseAllMatching && (
                <Button
                  variant="outline"
                  className="h-10 flex-1 sm:flex-none"
                  onClick={() => setSelection({ kind: "matching" })}
                >
                  <Layers />
                  {dict.picker.useAllMatching}
                </Button>
              )}
              {hasSelection && (
                <>
                  <Button
                    variant="ghost"
                    className="h-10"
                    onClick={() => setSelection(NO_PICKER_SELECTION)}
                  >
                    <X />
                    {dict.selection.clear}
                  </Button>
                  <Button
                    type="submit"
                    form={formId}
                    className="h-10 flex-1 px-6 font-semibold sm:flex-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="animate-spin" />}
                    {submitLabel}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <QuestionDrawer
          questionId={drawerId}
          listId={null}
          dict={dict}
          onClose={() => setDrawerId(null)}
        />
      </div>
    </QuestionBankProvider>
  );
}
