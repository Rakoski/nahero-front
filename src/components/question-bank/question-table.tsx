"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react";
import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableHandle } from "@/components/shared";
import {
  getPickerColumns,
  getQuestionColumns,
  type QuestionRowItem,
} from "@/components/question-bank/question-columns";
import { useQuestionBankActions } from "@/components/question-bank/question-bank-context";
import type { Dictionary } from "@/dictionaries";

const VIRTUAL_OPTIONS = { estimateRowHeight: 61, scrollPaddingStart: 72, scrollPaddingEnd: 96 };
const PICKER_VIRTUAL_OPTIONS = { estimateRowHeight: 76, scrollPaddingStart: 72, scrollPaddingEnd: 160 };

const PICKER_ROW_CLASS =
  "cursor-pointer data-[active=true]:bg-muted/40 data-[active=true]:shadow-none [&[data-state=selected]>td]:bg-primary/10 [&[data-state=selected]>td:first-child]:shadow-[inset_4px_0_0_0_var(--primary)]";

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element && target.closest("button,a,input,label,[role=checkbox]") !== null;

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
    target.closest("[role=dialog],[role=listbox],[role=menu]") !== null);

interface QuestionTableProps {
  items: QuestionRowItem[];
  selectedIds: Set<number>;
  allMatching: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoadMoreError: boolean;
  headerAction?: ReactNode;
  showListPicker?: boolean;
  variant?: "default" | "picker";
  dict: Dictionary["questionBank"];
  onFetchNextPage: () => void;
  onSelectionChange: (ids: Set<number>) => void;
}

export function QuestionTable({
  items,
  selectedIds,
  allMatching,
  hasNextPage,
  isFetchingNextPage,
  isLoadMoreError,
  headerAction,
  showListPicker = false,
  variant = "default",
  dict,
  onFetchNextPage,
  onSelectionChange,
}: QuestionTableProps) {
  const { openQuestion } = useQuestionBankActions();
  const tableRef = useRef<DataTableHandle>(null);
  const [requestedIndex, setActiveIndex] = useState(-1);
  const activeIndex = Math.min(requestedIndex, items.length - 1);
  const [popoverRowId, setPopoverRowId] = useState<number | null>(null);

  const onPopoverOpenChange = useCallback(
    (questionId: number, open: boolean) => setPopoverRowId(open ? questionId : null),
    [],
  );

  const isPicker = variant === "picker";
  const columns = useMemo(
    () =>
      isPicker ? getPickerColumns(dict) : getQuestionColumns({ dict, showListPicker, popoverRowId, onPopoverOpenChange }),
    [isPicker, dict, showListPicker, popoverRowId, onPopoverOpenChange],
  );

  const rowSelection = useMemo<RowSelectionState>(
    () =>
      Object.fromEntries(
        items.filter((item) => allMatching || selectedIds.has(item.id)).map((item) => [String(item.id), true]),
      ),
    [items, allMatching, selectedIds],
  );

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    const next = typeof updater === "function" ? updater(rowSelection) : updater;
    const ids = new Set(allMatching ? [] : selectedIds);
    for (const item of items) {
      if (next[String(item.id)]) ids.add(item.id);
      else ids.delete(item.id);
    }
    onSelectionChange(ids);
  };

  const toggleRow = (item: QuestionRowItem) =>
    onRowSelectionChange((current) => ({ ...current, [String(item.id)]: !current[String(item.id)] }));

  const onPickerRowClick = (item: QuestionRowItem, event: MouseEvent) => {
    if (!isInteractiveTarget(event.target)) toggleRow(item);
  };

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoadMoreError) onFetchNextPage();
  }, [hasNextPage, isFetchingNextPage, isLoadMoreError, onFetchNextPage]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented) return;
      if (isTypingTarget(event.target) || items.length === 0) return;

      const move = (next: number) => {
        event.preventDefault();
        setActiveIndex(next);
        tableRef.current?.scrollToIndex(next);
      };
      const active = items[activeIndex];

      switch (event.key) {
        case "j":
          move(Math.min(activeIndex + 1, items.length - 1));
          break;
        case "k":
          move(Math.max(activeIndex - 1, 0));
          break;
        case "x":
          if (active) {
            event.preventDefault();
            toggleRow(active);
          }
          break;
        case "l":
          if (active && showListPicker) {
            event.preventDefault();
            setPopoverRowId(active.id);
          }
          break;
        case "Enter":
          if (active && event.target === document.body) {
            event.preventDefault();
            openQuestion(active.id);
          }
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex min-h-10 flex-wrap items-center gap-x-3 gap-y-1 border-b bg-muted/30 px-3 py-2">
        <div className="min-w-0 flex-1 text-sm">{headerAction}</div>
        <span className="hidden text-xs text-muted-foreground lg:inline">
          {showListPicker ? dict.table.shortcutsWithLists : dict.table.shortcuts}
        </span>
      </div>

      <DataTable
        ref={tableRef}
        columns={columns}
        data={items}
        getRowId={(item) => String(item.id)}
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
        virtual={isPicker ? PICKER_VIRTUAL_OPTIONS : VIRTUAL_OPTIONS}
        onEndReached={onEndReached}
        activeRowIndex={activeIndex}
        onRowPointerDown={setActiveIndex}
        onRowClick={isPicker ? onPickerRowClick : undefined}
        rowClassName={isPicker ? PICKER_ROW_CLASS : undefined}
      />

      <div className="flex min-h-12 items-center justify-center gap-3 border-t px-3 py-3 text-sm text-muted-foreground">
        {isLoadMoreError ? (
          <>
            <span>{dict.table.loadMoreError}</span>
            <Button size="sm" variant="outline" className="cursor-pointer" onClick={onFetchNextPage}>
              {dict.table.retry}
            </Button>
          </>
        ) : isFetchingNextPage || hasNextPage ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{dict.table.loadingMore}</span>
          </>
        ) : (
          <span>{dict.table.end}</span>
        )}
      </div>
    </div>
  );
}
