"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Routes } from "@/routes/routes";
import { handleError } from "../../../../utils/error-utils";
import { EMAIL_NOT_VERIFIED } from "@/constants/auth-errors";

type LoginCredentials = {
  identifier: string;
  password: string;
};

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { update } = useSession();

  const callbackUrl = searchParams.get("callbackUrl");
  const lang = pathname.startsWith("/pt") ? "pt" : "en";

  return useMutation({
    mutationFn: async (data: LoginCredentials) => {
      const result = await signIn("credentials", {
        email: data.identifier,
        password: data.password,
        redirect: false,
      });

      if (result?.error) throw new Error(result.error);

      const newSession = await update();

      return newSession;
    },
    onSuccess: () => {
      const destination = callbackUrl || `/${lang}${Routes.Home}`;
      router.push(destination);
    },
    onError: (error: Error, variables) => {
      if (error.message === EMAIL_NOT_VERIFIED) {
        router.push(
          `/${lang}${Routes.VerifyEmail}?email=${encodeURIComponent(variables.identifier)}`,
        );
        return;
      }

      handleError(error);
    },
  });
}
