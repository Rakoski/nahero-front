"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "@/storages/cookies";
import { Routes } from "@/routes/routes";
import { handleError } from "../../../../utils/error-utils";

type LoginCredentials = {
  identifier: string;
  password: string;
};

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();

  const callbackUrl = searchParams.get("callbackUrl");

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
    onSuccess: (session) => {
      if (session?.user?.accessToken) {
        setCookie("@nahero:accessToken", session.user.accessToken, 90);
      }
      if (session?.user?.refreshToken) {
        setCookie("@nahero:refreshToken", session.user.refreshToken, 90);
      }

      const destination = callbackUrl || Routes.Home;
      router.push(destination);
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });
}
