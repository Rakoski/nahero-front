"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  resetPassword,
  ResetPasswordRequest,
} from "@/services/auth/reset-password";
import { handleError } from "@/utils/error-utils";

type Options = {
  onDone: () => void;
  onTokenRejected: () => void;
};

export function useResetPassword({ onDone, onTokenRejected }: Options) {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onSuccess: () => {
      onDone();
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        onTokenRejected();
        return;
      }

      handleError(error);
    },
  });
}
