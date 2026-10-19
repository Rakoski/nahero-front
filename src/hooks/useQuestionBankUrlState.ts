"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { QuestionBankFilter, QuestionBankStatus } from "@/services/question-bank/list";

const STATUSES: QuestionBankStatus[] = ["RESOLVED", "UNRESOLVED"];

const positiveInt = (value: string | null) => {
  const parsed = Number(value);
  return value && Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

export function useQuestionBankUrlState() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const practiceExamId = positiveInt(searchParams.get("exam"));
  const domainId = positiveInt(searchParams.get("domain"));
  const statusParam = searchParams.get("status")?.toUpperCase() as QuestionBankStatus | undefined;
  const status = statusParam && STATUSES.includes(statusParam) ? statusParam : undefined;

  const filter = useMemo<QuestionBankFilter>(
    () => ({ practiceExamId, domainId, status }),
    [practiceExamId, domainId, status],
  );

  const write = useCallback(
    (next: QuestionBankFilter) => {
      const params = new URLSearchParams();
      if (next.practiceExamId) params.set("exam", String(next.practiceExamId));
      if (next.domainId) params.set("domain", String(next.domainId));
      if (next.status) params.set("status", next.status.toLowerCase());
      const query = params.toString();
      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
    },
    [pathname],
  );

  const setFilter = useCallback(
    (patch: Partial<QuestionBankFilter>) => write({ ...filter, ...patch }),
    [write, filter],
  );

  const clearFilters = useCallback(() => write({}), [write]);

  return { filter, setFilter, clearFilters };
}
