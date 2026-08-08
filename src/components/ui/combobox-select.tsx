"use client";

import * as React from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "./combobox";

export interface ComboboxSelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  onSearchChange?: (search: string) => void;
  disabled?: boolean;
}

export function ComboboxSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  emptyText = "No results found",
  searchPlaceholder = "Search...",
  onSearchChange,
  disabled,
}: ComboboxSelectProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onSearchChange?.(newValue);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const filteredOptions = searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : options;

  return (
    <Combobox
      value={value ?? ""}
      onValueChange={(val) => {
        const safeValue = val ?? "";
        onValueChange?.(safeValue);
        setSearchQuery("");
        setOpen(false);
      }}
      open={open ?? false}
      onOpenChange={(event) => {
        setOpen(event.open ?? false);
      }}
      disabled={disabled}
      modal={false}
    >
      <ComboboxInput
        placeholder={selectedLabel || placeholder}
        value={value ? selectedLabel || "" : searchQuery}
        onChange={handleSearchChange}
        onFocus={() => !value && setOpen(true)}
        readOnly={!!value}
        showTrigger
        showClear={!!value}
        onClear={() => {
          onValueChange?.("");
          setSearchQuery("");
          setOpen(false);
        }}
      />
      <ComboboxContent>
        <ComboboxList className="min-h-[100px]">
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              {emptyText}
            </div>
          ) : (
            filteredOptions.map((option) => (
              <ComboboxItem key={option.value} value={option.value}>
                {option.label}
              </ComboboxItem>
            ))
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
