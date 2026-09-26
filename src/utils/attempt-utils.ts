import { AxiosError } from "axios";
import type { BackendErrorResponse } from "@/types/api-error";

export const ATTEMPT_IN_PROGRESS_ERROR_CODE = "ATTEMPT_IN_PROGRESS";
export const ATTEMPT_NOT_IN_PROGRESS_ERROR_CODE = "ATTEMPT_NOT_IN_PROGRESS";

function errorCodeOf(error: unknown): string | undefined {
  if (!(error instanceof AxiosError)) return undefined;
  return (error.response?.data as BackendErrorResponse | undefined)?.errorCode;
}

/**
 * The student already has an attempt running on another practice exam, so starting this
 * one would discard it. The API refuses until the caller confirms the switch.
 */
export function isAttemptInProgressConflict(error: unknown): boolean {
  return errorCodeOf(error) === ATTEMPT_IN_PROGRESS_ERROR_CODE;
}

export function isAttemptNotInProgress(error: unknown): boolean {
  return errorCodeOf(error) === ATTEMPT_NOT_IN_PROGRESS_ERROR_CODE;
}
