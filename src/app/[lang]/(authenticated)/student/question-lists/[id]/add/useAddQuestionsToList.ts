"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { toastClientError } from "@/components/question-bank/question-bank-context";
import { useAddQuestionListQuestions, useMyQuestionLists } from "@/hooks/useQuestionLists";
import { useQuestionPicker } from "@/hooks/useQuestionPicker";
import { useLocale } from "@/providers/locale-provider";
import { Routes } from "@/routes/routes";
import type { AddQuestionListQuestionsRequest } from "@/services/question-lists/add-questions";

export function useAddQuestionsToList(listId: number) {
  const { lang, dict } = useLocale();
  const pickerDict = dict.questionBank.picker;
  const router = useRouter();
  const picker = useQuestionPicker();
  const lists = useMyQuestionLists();
  const addQuestions = useAddQuestionListQuestions();
  const list = lists.data?.find((candidate) => candidate.id === listId);

  const add = () => {
    const { selection, filter, hasSelection } = picker;
    if (!hasSelection) {
      toast.error(pickerDict.selectFirst);
      return;
    }

    const request: AddQuestionListQuestionsRequest =
      selection.kind === "matching" ? { listId, filter } : { listId, questionIds: [...selection.ids] };

    addQuestions.mutate(request, {
      onSuccess: ({ limitReached }) => {
        if (limitReached) toast(pickerDict.limitReached);
        router.push(`/${lang}${Routes.QuestionLists}/${listId}`);
      },
      onError: toastClientError,
    });
  };

  return {
    picker,
    list,
    isListLoading: lists.isLoading,
    isListPaywalled: lists.isPaywalled,
    add,
    isAdding: addQuestions.isPending || addQuestions.isSuccess,
  };
}
