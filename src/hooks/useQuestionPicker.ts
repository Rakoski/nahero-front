"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuestionBank, useQuestionBankFilters } from "@/hooks/useQuestionBank";
import { useQuestionBankUrlState } from "@/hooks/useQuestionBankUrlState";

export type PickerSelection = { kind: "ids"; ids: Set<number> } | { kind: "matching" };

export const NO_PICKER_SELECTION: PickerSelection = { kind: "ids", ids: new Set() };

export function useQuestionPicker() {
  const { filter, setFilter, clearFilters } = useQuestionBankUrlState();
  const filters = useQuestionBankFilters();
  const bank = useQuestionBank(filter);

  const filterKey = JSON.stringify(filter);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [matchingKey, setMatchingKey] = useState<string | null>(null);
  const selection = useMemo<PickerSelection>(
    () => (matchingKey === filterKey ? { kind: "matching" } : { kind: "ids", ids: selectedIds }),
    [matchingKey, filterKey, selectedIds],
  );
  const setSelection = useCallback(
    (next: PickerSelection) => {
      if (next.kind === "matching") {
        setMatchingKey(filterKey);
        return;
      }
      setMatchingKey(null);
      setSelectedIds(next.ids);
    },
    [filterKey],
  );

  const items = useMemo(() => bank.data?.pages.flatMap((page) => page.items) ?? [], [bank.data]);
  const selectedCount = selection.kind === "ids" ? selection.ids.size : 0;
  const hasSelection = selection.kind === "matching" || selectedCount > 0;

  return {
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
    isPaywalled: filters.isPaywalled || bank.isPaywalled,
  };
}

export type QuestionPickerState = ReturnType<typeof useQuestionPicker>;
