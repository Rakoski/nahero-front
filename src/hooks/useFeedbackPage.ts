"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { getFeedbackPage } from "@/services/feedback/get-page";
import { isPaymentRequiredError } from "@/utils/paywall-utils";

export function useFeedbackPage(practiceExamSlug: string | null) {
  const query = useQuery({
    queryKey: [QUERIES.FEEDBACK.GET_PAGE, practiceExamSlug],
    queryFn: () => getFeedbackPage(practiceExamSlug),
    retry: (failureCount, error) => !isPaymentRequiredError(error) && failureCount < 2,
    refetchOnWindowFocus: false,
  });

  return { ...query, isPaywalled: isPaymentRequiredError(query.error) };
}
