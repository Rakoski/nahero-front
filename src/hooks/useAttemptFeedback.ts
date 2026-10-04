"use client";

import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { getStudentPracticeAttemptFeedback } from "@/services/student-practice-attempts/get-feedback";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 10;

export function useAttemptFeedback(attemptId: number, enabled = true) {
  const queryClient = useQueryClient();
  const queryKey = [QUERIES.STUDENT_PRACTICE_ATTEMPTS.GET_FEEDBACK, attemptId];
  const [pollBase, setPollBase] = useState(0);
  const retryOnNextFetch = useRef(true);

  const query = useQuery({
    queryKey,
    queryFn: () => {
      const retry = retryOnNextFetch.current;
      retryOnNextFetch.current = false;
      return getStudentPracticeAttemptFeedback(attemptId, retry);
    },
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: (current) =>
      current.state.data?.status === "pending" &&
      current.state.dataUpdateCount - pollBase < MAX_POLLS
        ? POLL_INTERVAL_MS
        : false,
  });

  const updates = queryClient.getQueryState(queryKey)?.dataUpdateCount ?? 0;
  const isPending = query.data?.status === "pending";
  const isGenerating = isPending && updates - pollBase < MAX_POLLS;
  const hasGivenUp = query.isError || (isPending && !isGenerating);

  const retry = () => {
    retryOnNextFetch.current = true;
    setPollBase(updates);
    query.refetch();
  };

  return { ...query, isGenerating, hasGivenUp, retry };
}
