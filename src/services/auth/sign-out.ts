import { signOut } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Routes } from "../../routes/routes";

export const SignOut = (router?: AppRouterInstance) => {
  signOut();
  if (router) router.push(Routes.Home);
};
