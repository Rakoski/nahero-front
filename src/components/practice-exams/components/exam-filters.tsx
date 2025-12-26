"use client";

import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ExamFiltersProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  difficulty?: string;
  onDifficultyChange: (value: string) => void;
  platform?: string;
  onPlatformChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  dict: {
    search_placeholder: string;
    search_button: string;
    clear_filters: string;
    filter_difficulty: string;
    filter_platform: string;
    all_levels: string;
    all_platforms: string;
    difficulty_levels: {
      beginner: string;
      intermediate: string;
      advanced: string;
    };
    platforms: {
      aws: string;
      azure: string;
      google: string;
    };
  };
}

export function ExamFilters({
  searchInput,
  onSearchInputChange,
  onSearch,
  onKeyPress,
  difficulty,
  onDifficultyChange,
  platform,
  onPlatformChange,
  hasActiveFilters,
  onClearFilters,
  dict,
}: ExamFiltersProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border rounded-lg p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={dict.search_placeholder}
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            className="pl-9"
          />
        </div>

        <Select value={difficulty || "all"} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-full md:w-45">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={dict.filter_difficulty} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{dict.all_levels}</SelectItem>
            <SelectItem value="Beginner">
              {dict.difficulty_levels.beginner}
            </SelectItem>
            <SelectItem value="Intermediate">
              {dict.difficulty_levels.intermediate}
            </SelectItem>
            <SelectItem value="Advanced">
              {dict.difficulty_levels.advanced}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={platform || "all"} onValueChange={onPlatformChange}>
          <SelectTrigger className="w-full md:w-45 flex justify-center">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={dict.filter_platform} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{dict.all_platforms}</SelectItem>
            <SelectItem value="AWS">{dict.platforms.aws}</SelectItem>
            <SelectItem value="Azure">{dict.platforms.azure}</SelectItem>
            <SelectItem value="Google">{dict.platforms.google}</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onSearch} className="w-full md:w-auto">
          <Search className="mr-2 h-4 w-4" />
          {dict.search_button}
        </Button>

        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="w-full md:w-auto"
          >
            {dict.clear_filters}
          </Button>
        )}
      </div>
    </div>
  );
}
