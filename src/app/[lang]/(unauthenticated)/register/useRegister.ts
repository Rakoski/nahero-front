"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser, RegisterUserRequest } from "@/services/auth/register";
import { handleError } from "@/utils/error-utils";
import { Routes } from "@/routes/routes";
import toast from "react-hot-toast";

export function useRegister(lang: "en" | "pt" = "en") {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterUserRequest) => {
      await registerUser(data);

      const loginResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (loginResult?.error) {
        throw new Error(loginResult.error);
      }

      return loginResult;
    },
    onSuccess: () => {
      router.push(`/${lang}${Routes.PracticeExams}`);
    },
    onError: (error) => {
      handleError(error);
    },
  });
}
