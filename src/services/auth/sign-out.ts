import { signOut } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { removeCookie } from "../../storages/cookies";
import { Routes } from "../../routes/routes";

export const SignOut = (router?: AppRouterInstance) => {
  localStorage.removeItem("environment");
  removeCookie("@nahero:accessToken");
  removeCookie("@nahero:refreshToken");
  signOut();
  if (router) router.push(Routes.Home);
};
