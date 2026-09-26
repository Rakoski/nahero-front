import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import type { AttemptStateResponse } from "./get-state";

/**
 * Returns the attempt the student left running, or null when there is none.
 * Stays silent on failure: this only drives an optional "resume" affordance,
 * so a hiccup here must not raise a toast on the catalogue page.
 */
export async function getInProgressStudentPracticeAttempt(): Promise<AttemptStateResponse | null> {
  const response = await api.get<AttemptStateResponse | "">(
    NAHERO_API.STUDENT_PRACTICE_ATTEMPTS.GET_IN_PROGRESS,
    { validateStatus: (status) => status === 200 || status === 204 },
  );

  if (response.status === 204 || !response.data) return null;

  return response.data;
}
