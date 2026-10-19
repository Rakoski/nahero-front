"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { toastClientError } from "@/components/question-bank/question-bank-context";
import { useCreateQuestionList } from "@/hooks/useQuestionLists";
import { useQuestionPicker } from "@/hooks/useQuestionPicker";
import { useLocale } from "@/providers/locale-provider";
import { Routes } from "@/routes/routes";
import type { CreateQuestionListRequest } from "@/services/question-lists/create";

export interface NewQuestionListValues {
  name: string;
  count: string;
}

export function useNewQuestionList() {
  const { lang, dict } = useLocale();
  const pickerDict = dict.questionBank.picker;
  const router = useRouter();
  const picker = useQuestionPicker();
  const createList = useCreateQuestionList();

  const create = ({ name, count }: NewQuestionListValues) => {
    const { selection, filter, hasSelection } = picker;
    if (!hasSelection) {
      toast.error(pickerDict.selectFirst);
      return;
    }

    const request: CreateQuestionListRequest =
      selection.kind === "matching"
        ? { name, filter: { ...filter, limit: count ? Number(count) : undefined } }
        : { name, questionIds: [...selection.ids] };

    createList.mutate(request, {
      onSuccess: (created) => router.push(`/${lang}${Routes.QuestionLists}/${created.id}`),
      onError: toastClientError,
    });
  };

  return { picker, create, isCreating: createList.isPending || createList.isSuccess };
}
