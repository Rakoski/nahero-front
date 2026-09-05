"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { handleError } from "@/utils/error-utils";
import { resendVerification } from "../../../../services/auth/resend-verification";

const COOLDOWN_SECONDS = 60;

export function useResendVerification(
  initialCooldown = 0,
  successMessage = "",
) {
  const [cooldown, setCooldown] = useState(initialCooldown);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const mutation = useMutation({
    mutationFn: (email: string) => resendVerification(email),
    onSuccess: () => {
      setCooldown(COOLDOWN_SECONDS);
      if (successMessage) toast.success(successMessage);
    },
    onError: handleError,
  });

  return {
    ...mutation,
    cooldown,
    canResend: cooldown === 0 && !mutation.isPending,
  };
}
