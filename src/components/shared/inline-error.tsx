"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getErrorMessage, isServerError } from "@/utils/error-utils";

interface InlineErrorProps {
  error: unknown;
  className?: string;
}

export function InlineError({ error, className }: InlineErrorProps) {
  if (!error || isServerError(error)) return null;

  return (
    <p
      role="alert"
      className={cn(
        "flex items-center justify-center gap-1.5 text-sm font-medium text-destructive",
        className,
      )}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      {getErrorMessage(error)}
    </p>
  );
}
