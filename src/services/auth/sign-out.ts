import { signOut } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Routes } from "../../routes/routes";

const currentLang = () => {
  if (typeof window === "undefined") return "en";
  const pathLang = window.location.pathname.split("/")[1];
  return pathLang === "pt" ? "pt" : "en";
};

export const SignOut = (router?: AppRouterInstance) => {
  const lang = currentLang();
  signOut({ callbackUrl: `/${lang}${Routes.Home}` });
  if (router) router.push(`/${lang}${Routes.Home}`);
};
