"use client";

import { Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { InlineError } from "@/components/shared";
import { PracticeQuestionCard } from "@/components/feedback/practice-question-card";
import { ListPicker } from "@/components/question-bank/list-picker";
import { useQuestionBankActions } from "@/components/question-bank/question-bank-context";
import { useQuestionBankQuestion } from "@/hooks/useQuestionBank";
import { useAnswerStudyQuestion } from "@/hooks/useAnswerStudyQuestion";
import type { Dictionary } from "@/dictionaries";

type QuestionBankDict = Dictionary["questionBank"];

interface QuestionDrawerProps {
  questionId: number | null;
  listId: number | null;
  showLists?: boolean;
  dict: QuestionBankDict;
  onClose: () => void;
}

function QuestionDrawerBody({
  questionId,
  listId,
  showLists,
  dict,
}: {
  questionId: number;
  listId: number | null;
  showLists: boolean;
  dict: QuestionBankDict;
}) {
  const { data: question, isLoading, error } = useQuestionBankQuestion(questionId);
  const { mutation, error: answerError } = useAnswerStudyQuestion(listId);
  const { lists, isInList, toggleMembership, pending, requestCreate } = useQuestionBankActions();

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="space-y-2 px-4 py-6 text-center">
        <InlineError error={error} />
        {!error && <p className="text-sm text-muted-foreground">{dict.drawer.loadError}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 pb-6">
      <SheetDescription>
        {question.practiceExam.title}
        {question.domain && ` · ${question.domain.name}`}
      </SheetDescription>
      <PracticeQuestionCard question={question} dict={dict.drawer} mutation={mutation} />
      <InlineError error={answerError} />
      {showLists && (
        <section aria-label={dict.drawer.lists} className="rounded-lg border p-3">
          <ListPicker
            lists={lists}
            dict={dict.listPicker}
            isChecked={(id) => isInList(id, questionId)}
            pendingListId={pending?.questionId === questionId ? pending.listId : null}
            onPick={(list, checked) => toggleMembership(list, questionId, checked)}
            onCreate={() => requestCreate([questionId])}
          />
        </section>
      )}
    </div>
  );
}

export function QuestionDrawer({ questionId, listId, showLists = false, dict, onClose }: QuestionDrawerProps) {
  return (
    <Sheet open={questionId !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{dict.drawer.title}</SheetTitle>
        </SheetHeader>
        {questionId !== null && (
          <QuestionDrawerBody
            key={questionId}
            questionId={questionId}
            listId={listId}
            showLists={showLists}
            dict={dict}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
