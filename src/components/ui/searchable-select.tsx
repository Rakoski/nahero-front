"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface SearchableSelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  onSearchChange?: (search: string) => void;
  disabled?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  emptyText = "No results found",
  searchPlaceholder = "Search...",
  onSearchChange,
  disabled,
}: SearchableSelectProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange?.(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearchChange]);

  const handleClearValue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange?.("");
    setSearchQuery("");
    setIsOpen(false);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="relative w-full">
      <Select
        value={value}
        onValueChange={(val) => {
          onValueChange?.(val);
          setIsOpen(false);
          setSearchQuery("");
        }}
        disabled={disabled}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger className="w-full cursor-pointer">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          position="popper"
          className="w-[var(--radix-select-trigger-width)]"
          sideOffset={4}
          onPointerDownOutside={(e) => {
            if (e.target instanceof Element && e.target.closest("input")) {
              e.preventDefault();
            }
          }}
        >
          <div className="flex items-center gap-2 border-b px-3 pb-2 pt-2">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            <Input
              ref={inputRef}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Escape") setIsOpen(false);
              }}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
