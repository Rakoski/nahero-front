"use client";

import { Search, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";

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
  onSearch: () => void;
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
    search: string;
    search_exam_placeholder: string;
    loading_exams: string;
    no_exam_found: string;
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
  onSearch,
  practiceExams,
  isLoadingExams,
  onExamSearchChange,
  dict,
}: HistoryFiltersProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      className="border rounded-lg p-4 shadow-sm mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col gap-2 cursor-pointer">
          <label className="text-sm font-medium text-muted-foreground">
            {dict.filter_exam}
          </label>
          <SearchableSelect
            options={practiceExams}
            value={practiceExamId?.toString() || ""}
            onValueChange={onPracticeExamIdChange}
            placeholder={dict.all_exams}
            emptyText={isLoadingExams ? dict.loading_exams : dict.no_exam_found}
            searchPlaceholder={dict.search_exam_placeholder}
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

        <div className="flex items-end gap-2">
          <Button type="submit" variant="default" className="flex-1 h-10">
            <Search className="w-5 h-5" />
            {dict.search}
          </Button>
          {hasActiveFilters && (
            <Button
              type="button"
              onClick={onClearFilters}
              variant="outline"
              className="h-10"
              aria-label={dict.clear_filters}
            >
              <XIcon className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
