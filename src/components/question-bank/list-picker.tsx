"use client";

import { Loader2, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { QuestionListSummary } from "@/services/question-lists/list-mine";
import type { Dictionary } from "@/dictionaries";

type ListPickerDict = Dictionary["questionBank"]["listPicker"];

interface ListPickerProps {
  lists: QuestionListSummary[] | undefined;
  dict: ListPickerDict;
  isChecked?: (listId: number) => boolean;
  pendingListId?: number | null;
  onPick: (list: QuestionListSummary, checked: boolean) => void;
  onCreate: () => void;
}

export function ListPicker({ lists, dict, isChecked, pendingListId, onPick, onCreate }: ListPickerProps) {
  return (
    <div className="space-y-2">
      <p className="px-1 text-sm font-medium">{dict.title}</p>
      {lists === undefined ? (
        <div className="flex justify-center py-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : lists.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">{dict.empty}</p>
      ) : (
        <ul className="max-h-60 space-y-0.5 overflow-y-auto">
          {lists.map((list) => {
            const checked = isChecked?.(list.id) ?? false;
            const pending = pendingListId === list.id;

            return (
              <li key={list.id}>
                <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm hover:bg-accent">
                  {pending ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                  ) : (
                    <Checkbox
                      checked={checked}
                      disabled={pendingListId !== undefined && pendingListId !== null}
                      onCheckedChange={(value) => onPick(list, value === true)}
                    />
                  )}
                  <span className="min-w-0 flex-1 truncate">{list.name}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{list.questionCount}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        {dict.createList}
      </Button>
    </div>
  );
}
