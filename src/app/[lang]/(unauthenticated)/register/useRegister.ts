"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth/register";
import { handleError } from "@/utils/error-utils";
import { Routes } from "@/routes/routes";

export function useRegister(lang: "en" | "pt" = "en") {
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (_, vars) =>
      router.push(
        `/${lang}${Routes.VerifyEmail}?email=${encodeURIComponent(vars.email)}&sent=1`,
      ),
    onError: (error) => {
      handleError(error);
    },
  });
}
