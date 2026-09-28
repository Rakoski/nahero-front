"use client";

import { AlertCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageErrorProps {
  title: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function PageError({
  title,
  description,
  retryLabel,
  onRetry,
}: PageErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div
        role="alert"
        className="flex max-w-md flex-col items-center space-y-4 text-center"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </span>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
        {onRetry && retryLabel && (
          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RotateCw className="h-4 w-4" />
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
