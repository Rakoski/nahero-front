"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
    onSuccess: (session) => {
      // The access-token cookie is only a fast cache for the axios interceptor;
      // the refresh token now lives solely in the encrypted NextAuth JWT.
      if (session?.user?.accessToken) {
        setCookie("@nahero:accessToken", session.user.accessToken, 90);
      }

      const destination = callbackUrl || `/${lang}${Routes.Home}`;
      router.push(destination);
    },
    onError: (error: Error) => {
      handleError(error);
    },
  });
}
