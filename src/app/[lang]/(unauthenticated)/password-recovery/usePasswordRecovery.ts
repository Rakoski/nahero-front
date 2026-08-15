"use client";

import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  ForgotPasswordRequest,
} from "@/services/auth/forgot-password";
import { handleError } from "@/utils/error-utils";

type Options = {
  onSent: (email: string) => void;
};

export function usePasswordRecovery({ onSent }: Options) {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
    onSuccess: (_data, variables) => {
      onSent(variables.email);
    },
    onError: (error) => {
      handleError(error);
    },
  });
}
