"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { useLocale } from "@/providers/locale-provider";
import {
  useAddQuestionListQuestions,
  useMyQuestionLists,
  useRemoveQuestionListQuestions,
} from "@/hooks/useQuestionLists";
import type { QuestionListSummary } from "@/services/question-lists/list-mine";
import { getErrorMessage, isServerError } from "@/utils/error-utils";

export const toastClientError = (error: unknown) => {
  if (!isServerError(error)) toast.error(getErrorMessage(error));
};

type Pending = { listId: number; questionId: number } | null;

interface QuestionBankActions {
  lists: QuestionListSummary[] | undefined;
  isInList: (listId: number, questionId: number) => boolean;
  toggleMembership: (list: QuestionListSummary, questionId: number, checked: boolean) => void;
  pending: Pending;
  requestCreate: (questionIds: number[]) => void;
  openQuestion: (questionId: number) => void;
}

const QuestionBankContext = createContext<QuestionBankActions | null>(null);

const key = (listId: number, questionId: number) => `${listId}:${questionId}`;

interface QuestionBankProviderProps {
  currentListId: number | null;
  requestCreate: (questionIds: number[]) => void;
  openQuestion: (questionId: number) => void;
  children: ReactNode;
}

export function QuestionBankProvider({ currentListId, requestCreate, openQuestion, children }: QuestionBankProviderProps) {
  const { dict } = useLocale();
  const pickerDict = dict.questionBank.listPicker;
  const { data: lists } = useMyQuestionLists();
  const { mutate: addQuestions } = useAddQuestionListQuestions();
  const { mutate: removeQuestions } = useRemoveQuestionListQuestions();
  const [known, setKnown] = useState<Map<string, boolean>>(() => new Map());
  const [pending, setPending] = useState<Pending>(null);

  const isInList = useCallback(
    (listId: number, questionId: number) => known.get(key(listId, questionId)) ?? listId === currentListId,
    [known, currentListId],
  );

  const toggleMembership = useCallback(
    (list: QuestionListSummary, questionId: number, checked: boolean) => {
      const remember = () =>
        setKnown((current) => new Map(current).set(key(list.id, questionId), checked));
      const settle = { onSettled: () => setPending(null), onError: toastClientError };
      setPending({ listId: list.id, questionId });

      if (checked) {
        addQuestions(
          { listId: list.id, questionIds: [questionId] },
          {
            ...settle,
            onSuccess: () => {
              remember();
              toast.success(pickerDict.added.replace("{{name}}", list.name));
            },
          },
        );
      } else {
        removeQuestions(
          { listId: list.id, questionIds: [questionId] },
          {
            ...settle,
            onSuccess: () => {
              remember();
              toast.success(pickerDict.removed.replace("{{name}}", list.name));
            },
          },
        );
      }
    },
    [addQuestions, removeQuestions, pickerDict],
  );

  const value = useMemo(
    () => ({ lists, isInList, toggleMembership, pending, requestCreate, openQuestion }),
    [lists, isInList, toggleMembership, pending, requestCreate, openQuestion],
  );

  return <QuestionBankContext.Provider value={value}>{children}</QuestionBankContext.Provider>;
}

export function useQuestionBankActions() {
  const context = useContext(QuestionBankContext);
  if (!context) throw new Error("useQuestionBankActions must be used inside QuestionBankProvider");
  return context;
}
