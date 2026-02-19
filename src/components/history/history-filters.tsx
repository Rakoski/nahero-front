"use client";

import { Filter, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComboboxSelect } from "@/components/ui/combobox-select";

export interface HistoryFiltersProps {
  practiceExamId?: number;
  onPracticeExamIdChange: (value: string) => void;
  startDate?: string;
  onStartDateChange: (value: string) => void;
  endDate?: string;
  onEndDateChange: (value: string) => void;
  minScore?: number;
  onMinScoreChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  practiceExams: Array<{ value: string; label: string }>;
  isLoadingExams: boolean;
  onExamSearchChange?: (search: string) => void;
  dict: {
    filter_exam: string;
    filter_date_from: string;
    filter_date_to: string;
    filter_min_score: string;
    clear_filters: string;
    all_exams: string;
  };
}

export function HistoryFilters({
  practiceExamId,
  onPracticeExamIdChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  minScore,
  onMinScoreChange,
  hasActiveFilters,
  onClearFilters,
  practiceExams,
  isLoadingExams,
  onExamSearchChange,
  dict,
}: HistoryFiltersProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border rounded-lg p-4 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            {dict.filter_exam}
          </label>
          <ComboboxSelect
            options={practiceExams}
            value={practiceExamId?.toString() || ""}
            onValueChange={onPracticeExamIdChange}
            placeholder={dict.all_exams}
            emptyText={isLoadingExams ? "Loading..." : "No exam found"}
            searchPlaceholder="Search exam..."
            onSearchChange={onExamSearchChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            {dict.filter_date_from}
          </label>
          <Input
            type="date"
            value={startDate || ""}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            {dict.filter_date_to}
          </label>
          <Input
            type="date"
            value={endDate || ""}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-end">
          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
              variant="default"
              className="w-full h-10"
            >
              <XIcon className="w-5 h-5 text-black" />
              {dict.clear_filters}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
