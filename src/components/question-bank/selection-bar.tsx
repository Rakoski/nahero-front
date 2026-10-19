"use client";

import { useState } from "react";
import { ListMinus, ListPlus, Loader2, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ListPicker } from "@/components/question-bank/list-picker";
import type { QuestionListSummary } from "@/services/question-lists/list-mine";
import type { Dictionary } from "@/dictionaries";

interface SelectionBarProps {
  label: string;
  lists: QuestionListSummary[] | undefined;
  currentListId: number | null;
  busy: boolean;
  dict: Dictionary["questionBank"];
  onAdd: (list: QuestionListSummary) => void;
  onCreate: () => void;
  onRemove?: () => void;
  onPractice?: () => void;
  onClear: () => void;
}

export function SelectionBar({
  label,
  lists,
  currentListId,
  busy,
  dict,
  onAdd,
  onCreate,
  onRemove,
  onPractice,
  onClear,
}: SelectionBarProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const targets = lists?.filter((list) => list.id !== currentListId);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div
        role="region"
        aria-label={label}
        className="pointer-events-auto flex max-w-full flex-wrap items-center gap-1 rounded-xl border bg-popover p-2 shadow-lg"
      >
        <span className="px-2 text-sm font-medium" aria-live="polite">
          {label}
        </span>
        {busy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}

        <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="ghost" disabled={busy}>
              <ListPlus className="mr-2 h-4 w-4" />
              {dict.selection.addToList}
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-64 p-2">
            <ListPicker
              lists={targets}
              dict={dict.listPicker}
              onPick={(list) => {
                setPickerOpen(false);
                onAdd(list);
              }}
              onCreate={() => {
                setPickerOpen(false);
                onCreate();
              }}
            />
          </PopoverContent>
        </Popover>

        {onRemove && (
          <Button size="sm" variant="ghost" disabled={busy} onClick={onRemove}>
            <ListMinus className="mr-2 h-4 w-4" />
            {dict.selection.removeFromList}
          </Button>
        )}
        {onPractice && (
          <Button size="sm" variant="ghost" disabled={busy} onClick={onPractice}>
            <Play className="mr-2 h-4 w-4" />
            {dict.selection.practice}
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={onClear}>
          <X className="mr-2 h-4 w-4" />
          {dict.selection.clear}
        </Button>
      </div>
    </div>
  );
}
