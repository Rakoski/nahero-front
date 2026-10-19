"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SimplePaginationDict = {
  previous: string;
  next: string;
  page: string;
};

interface SimplePaginationProps {
  page: number;
  hasNext: boolean;
  disabled?: boolean;
  dict: SimplePaginationDict;
  onChange: (page: number) => void;
}

export function SimplePagination({ page, hasNext, disabled, dict, onChange }: SimplePaginationProps) {
  if (page === 0 && !hasNext) return null;

  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="outline" size="sm" disabled={disabled || page === 0} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="mr-1 h-4 w-4" />
        {dict.previous}
      </Button>
      <span className="text-sm text-muted-foreground">{dict.page.replace("{{page}}", String(page + 1))}</span>
      <Button variant="outline" size="sm" disabled={disabled || !hasNext} onClick={() => onChange(page + 1)}>
        {dict.next}
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}
