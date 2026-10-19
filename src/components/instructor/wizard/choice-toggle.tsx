"use client";

import { cn } from "@/lib/utils";

interface ChoiceToggleProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function ChoiceToggle<T extends string>({ value, options, onChange }: ChoiceToggleProps<T>) {
  return (
    <div role="radiogroup" className="inline-flex flex-wrap gap-1 rounded-lg border bg-muted/40 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            option.value === value ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
