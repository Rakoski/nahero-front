"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ChevronDown, Copy, Loader2, MoreHorizontal, Play, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InlineError } from "@/components/shared";
import { cn } from "@/lib/utils";
import { PracticeSetupDialog, type PracticeOptions } from "@/components/question-bank/practice-setup-dialog";
import { toastClientError } from "@/components/question-bank/question-bank-context";
import { useCreateQuestionList, useDeleteQuestionList } from "@/hooks/useQuestionLists";
import { useLocale } from "@/providers/locale-provider";
import { Routes } from "@/routes/routes";
import type { QuestionListItem } from "@/services/question-lists/get";
import type { Dictionary } from "@/dictionaries";

const MAX_NAME_LENGTH = 120;

const shuffle = <T,>(values: T[]) => {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
};

interface ListHeaderProps {
  listId: number;
  name: string;
  questionCount: number;
  answeredCount: number;
  items: QuestionListItem[];
  hasMore: boolean;
  dict: Dictionary["questionBank"];
  loadAll: () => Promise<QuestionListItem[]>;
  practiceOnOpen?: boolean;
  onPractice: (questionIds: number[]) => void;
}

export function ListHeader({
  listId,
  name,
  questionCount,
  answeredCount,
  items,
  hasMore,
  dict,
  loadAll,
  practiceOnOpen = false,
  onPractice,
}: ListHeaderProps) {
  const { lang } = useLocale();
  const router = useRouter();
  const listsHref = `/${lang}${Routes.QuestionLists}`;
  const [practiceOpen, setPracticeOpen] = useState(practiceOnOpen && questionCount > 0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const createList = useCreateQuestionList();
  const deleteList = useDeleteQuestionList();

  const breakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      const domain = item.domain?.name ?? dict.row.noDomain;
      counts.set(domain, (counts.get(domain) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [items, dict.row.noDomain]);

  const startPractice = async ({ count, random, onlyUnanswered }: PracticeOptions) => {
    const all = await loadAll();
    const pool = onlyUnanswered ? all.filter((item) => !item.answered) : all;
    const ordered = random ? shuffle(pool) : pool;
    const questionIds = ordered.slice(0, count).map((item) => item.questionId);
    if (questionIds.length === 0) return false;
    onPractice(questionIds);
    return true;
  };

  const duplicate = async () => {
    setDuplicating(true);
    try {
      const all = await loadAll();
      const created = await createList.mutateAsync({
        name: dict.list.copyName.replace("{{name}}", name).slice(0, MAX_NAME_LENGTH),
        questionIds: all.map((item) => item.questionId),
      });
      toast.success(dict.list.duplicated);
      router.push(`${listsHref}/${created.id}`);
    } catch (error) {
      toastClientError(error);
    } finally {
      setDuplicating(false);
    }
  };

  const confirmDelete = () =>
    deleteList.mutate(listId, {
      onSuccess: () => {
        toast.success(dict.list.deleted);
        setDeleteOpen(false);
        router.push(listsHref);
      },
    });

  return (
    <section className="space-y-4 rounded-lg border p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="text-2xl font-bold break-words">{name}</h2>
          <div className="max-w-sm space-y-1.5">
            <Progress value={questionCount === 0 ? 0 : (answeredCount / questionCount) * 100} />
            <p className="text-sm text-muted-foreground">
              {dict.list.progress
                .replace("{{answered}}", String(answeredCount))
                .replace("{{total}}", String(questionCount))}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`${listsHref}/${listId}/add`}>
              <Plus className="mr-2 h-4 w-4" />
              {dict.list.addQuestions}
            </Link>
          </Button>
          <Button onClick={() => setPracticeOpen(true)} disabled={questionCount === 0}>
            <Play className="mr-2 h-4 w-4" />
            {dict.list.practice}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label={dict.list.actions} disabled={duplicating}>
                {duplicating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={duplicate} disabled={questionCount === 0}>
                <Copy className="mr-2 h-4 w-4" />
                {dict.list.duplicate}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {dict.list.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {questionCount > 0 && (
        <div className="space-y-3">
          <Button
            variant="link"
            size="sm"
            className="h-auto px-0"
            aria-expanded={breakdownOpen}
            onClick={() => {
              if (!breakdownOpen && hasMore) loadAll().catch(toastClientError);
              setBreakdownOpen(!breakdownOpen);
            }}
          >
            {breakdownOpen ? dict.list.hideBreakdown : dict.list.showBreakdown}
            <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", breakdownOpen && "rotate-180")} />
          </Button>
          {breakdownOpen &&
            (hasMore ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {breakdown.map(([domain, count]) => (
                  <li key={domain} className="space-y-1">
                    <div className="flex justify-between gap-2 text-sm">
                      <span className="truncate">{domain}</span>
                      <span className="shrink-0 tabular-nums text-muted-foreground">{count}</span>
                    </div>
                    <Progress value={(count / items.length) * 100} className="h-1.5" />
                  </li>
                ))}
              </ul>
            ))}
        </div>
      )}

      <PracticeSetupDialog
        open={practiceOpen}
        max={questionCount}
        dict={dict.practiceDialog}
        onStart={startPractice}
        onClose={() => setPracticeOpen(false)}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dict.list.deleteDialog.title}</DialogTitle>
            <DialogDescription>{dict.list.deleteDialog.description.replace("{{name}}", name)}</DialogDescription>
          </DialogHeader>
          <InlineError error={deleteList.error} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              {dict.list.deleteDialog.cancel}
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteList.isPending}>
              {deleteList.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dict.list.deleteDialog.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
