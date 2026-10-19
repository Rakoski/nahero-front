"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Bookmark, BookmarkCheck, Check, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ListPicker } from "@/components/question-bank/list-picker";
import { useQuestionBankActions } from "@/components/question-bank/question-bank-context";
import { cn } from "@/lib/utils";
import type { QuestionBankDomain, QuestionBankPracticeExam } from "@/services/question-bank/list";
import type { Dictionary } from "@/dictionaries";

export interface QuestionRowItem {
  id: number;
  preview: string;
  answered: boolean;
  practiceExam: QuestionBankPracticeExam;
  domain: QuestionBankDomain | null;
}

type QuestionBankDict = Dictionary["questionBank"];

interface QuestionColumnsOptions {
  dict: QuestionBankDict;
  showListPicker: boolean;
  popoverRowId: number | null;
  onPopoverOpenChange: (questionId: number, open: boolean) => void;
}

function StatusBadge({ answered, dict }: { answered: boolean; dict: QuestionBankDict }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        answered
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "text-muted-foreground",
      )}
    >
      {answered ? dict.row.answered : dict.row.notAnswered}
    </span>
  );
}

function QuestionCell({ item, dict }: { item: QuestionRowItem; dict: QuestionBankDict }) {
  const { openQuestion } = useQuestionBankActions();
  const domainName = item.domain?.name ?? dict.row.noDomain;

  return (
    <button type="button" onClick={() => openQuestion(item.id)} className="w-full cursor-pointer text-left">
      <span className="line-clamp-2 leading-5 whitespace-normal">{item.preview}</span>
      <span className="block truncate text-xs leading-4 text-muted-foreground md:hidden">
        {domainName} · {item.practiceExam.title}
      </span>
    </button>
  );
}

function ActionsCell({
  item,
  options: { dict, showListPicker, popoverRowId, onPopoverOpenChange },
}: {
  item: QuestionRowItem;
  options: QuestionColumnsOptions;
}) {
  const { lists, isInList, toggleMembership, pending, requestCreate, openQuestion } = useQuestionBankActions();
  const inSomeList = lists?.some((list) => isInList(list.id, item.id)) ?? false;

  return (
    <div className="flex items-center justify-end gap-1">
      {showListPicker && (
        <Popover open={popoverRowId === item.id} onOpenChange={(open) => onPopoverOpenChange(item.id, open)}>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer" aria-label={dict.row.addToList}>
              {inSomeList ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-2">
            <ListPicker
              lists={lists}
              dict={dict.listPicker}
              isChecked={(listId) => isInList(listId, item.id)}
              pendingListId={pending?.questionId === item.id ? pending.listId : null}
              onPick={(list, checked) => toggleMembership(list, item.id, checked)}
              onCreate={() => {
                onPopoverOpenChange(item.id, false);
                requestCreate([item.id]);
              }}
            />
          </PopoverContent>
        </Popover>
      )}
      <Button
        size="sm"
        variant="outline"
        className="hidden cursor-pointer sm:inline-flex"
        onClick={() => openQuestion(item.id)}
      >
        {dict.row.study}
      </Button>
    </div>
  );
}

export function getQuestionColumns(options: QuestionColumnsOptions): ColumnDef<QuestionRowItem>[] {
  const { dict } = options;

  return [
    {
      id: "select",
      meta: { className: "w-11" },
      header: ({ table }) => (
        <Checkbox
          aria-label={dict.table.selectLoaded}
          checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllRowsSelected(value === true)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={dict.row.select}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(value === true)}
        />
      ),
    },
    {
      id: "question",
      header: dict.table.columns.question,
      cell: ({ row }) => <QuestionCell item={row.original} dict={dict} />,
    },
    {
      id: "domain",
      accessorFn: (item) => item.domain?.name ?? dict.row.noDomain,
      header: dict.table.columns.domain,
      meta: { className: "hidden w-56 md:table-cell" },
      cell: ({ getValue }) => (
        <span className="block truncate text-xs text-muted-foreground" title={getValue<string>()}>
          {getValue<string>()}
        </span>
      ),
    },
    {
      id: "exam",
      accessorFn: (item) => item.practiceExam.title,
      header: dict.table.columns.exam,
      meta: { className: "hidden w-56 lg:table-cell" },
      cell: ({ getValue }) => (
        <span className="block truncate text-xs text-muted-foreground" title={getValue<string>()}>
          {getValue<string>()}
        </span>
      ),
    },
    {
      id: "status",
      accessorKey: "answered",
      header: dict.table.columns.status,
      meta: { className: "hidden w-36 sm:table-cell" },
      cell: ({ row }) => <StatusBadge answered={row.original.answered} dict={dict} />,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{dict.table.columns.actions}</span>,
      meta: { className: options.showListPicker ? "w-12 sm:w-40" : "hidden w-32 sm:table-cell" },
      cell: ({ row }) => <ActionsCell item={row.original} options={options} />,
    },
  ];
}

function PickerQuestionCell({ item, dict }: { item: QuestionRowItem; dict: QuestionBankDict }) {
  return (
    <div className="min-w-0 space-y-2 py-1">
      <p className="line-clamp-3 leading-5 whitespace-normal sm:line-clamp-2">{item.preview}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground xl:hidden">
        <span className="lg:hidden">
          <StatusBadge answered={item.answered} dict={dict} />
        </span>
        <span className="max-w-full truncate md:hidden">{item.domain?.name ?? dict.row.noDomain}</span>
        <span className="max-w-full truncate">{item.practiceExam.title}</span>
      </div>
    </div>
  );
}

function PickerActionsCell({
  item,
  selected,
  onToggle,
  dict,
}: {
  item: QuestionRowItem;
  selected: boolean;
  onToggle: () => void;
  dict: QuestionBankDict;
}) {
  const { openQuestion } = useQuestionBankActions();

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="icon"
        variant="ghost"
        className="size-10 text-muted-foreground hover:text-foreground"
        aria-label={dict.picker.view}
        title={dict.picker.view}
        onClick={() => openQuestion(item.id)}
      >
        <Eye className="size-5" />
      </Button>
      <Button
        variant={selected ? "default" : "outline"}
        className="hidden h-10 w-36 sm:inline-flex"
        aria-pressed={selected}
        onClick={onToggle}
      >
        {selected ? <Check /> : <Plus />}
        {selected ? dict.picker.toggleAdded : dict.picker.toggleAdd}
      </Button>
    </div>
  );
}

const PICKER_CHECKBOX_CLASS = "size-5 rounded-md [&_svg]:size-4";

export function getPickerColumns(dict: QuestionBankDict): ColumnDef<QuestionRowItem>[] {
  return [
    {
      id: "select",
      meta: { className: "w-12 pl-4" },
      header: ({ table }) => (
        <Checkbox
          aria-label={dict.table.selectLoaded}
          className={PICKER_CHECKBOX_CLASS}
          checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllRowsSelected(value === true)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={dict.row.select}
          className={PICKER_CHECKBOX_CLASS}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(value === true)}
        />
      ),
    },
    {
      id: "question",
      header: dict.table.columns.question,
      cell: ({ row }) => <PickerQuestionCell item={row.original} dict={dict} />,
    },
    {
      id: "domain",
      accessorFn: (item) => item.domain?.name ?? dict.row.noDomain,
      header: dict.table.columns.domain,
      meta: { className: "hidden w-44 md:table-cell" },
      cell: ({ getValue }) => (
        <span className="line-clamp-2 text-xs whitespace-normal text-muted-foreground" title={getValue<string>()}>
          {getValue<string>()}
        </span>
      ),
    },
    {
      id: "exam",
      accessorFn: (item) => item.practiceExam.title,
      header: dict.table.columns.exam,
      meta: { className: "hidden w-48 xl:table-cell" },
      cell: ({ getValue }) => (
        <span className="line-clamp-2 text-xs whitespace-normal text-muted-foreground" title={getValue<string>()}>
          {getValue<string>()}
        </span>
      ),
    },
    {
      id: "status",
      accessorKey: "answered",
      header: dict.table.columns.status,
      meta: { className: "hidden w-36 lg:table-cell" },
      cell: ({ row }) => <StatusBadge answered={row.original.answered} dict={dict} />,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{dict.table.columns.actions}</span>,
      meta: { className: "w-14 pr-3 sm:w-52" },
      cell: ({ row }) => (
        <PickerActionsCell
          item={row.original}
          selected={row.getIsSelected()}
          onToggle={() => row.toggleSelected()}
          dict={dict}
        />
      ),
    },
  ];
}
