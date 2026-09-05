"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";
import { AuthProvider } from "@/providers/auth-provider";
import { ActiveAttemptProvider } from "@/providers/active-attempt-provider";
import { queryClient } from "@/lib/query-client";

export function Providers({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ActiveAttemptProvider>{children}</ActiveAttemptProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  );
}
