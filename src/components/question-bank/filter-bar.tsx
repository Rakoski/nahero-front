"use client";

import { useMemo } from "react";
import { FilterX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { cn } from "@/lib/utils";
import type { QuestionBankExamFilter } from "@/services/question-bank/get-filters";
import type { QuestionBankFilter, QuestionBankStatus } from "@/services/question-bank/list";
import type { Dictionary } from "@/dictionaries";

const ALL = "all";
const MAX_OPTIONS = 20;
const TRIGGER_CLASS = "data-[size=default]:h-11 px-4 text-base";

interface FilterBarProps {
  filter: QuestionBankFilter;
  exams: QuestionBankExamFilter[];
  dict: Dictionary["questionBank"]["filters"];
  onChange: (patch: Partial<QuestionBankFilter>) => void;
  onClear: () => void;
}

export function FilterBar({ filter, exams, dict, onChange, onClear }: FilterBarProps) {
  const { practiceExamId, domainId, status } = filter;

  const domainOptions = useMemo(() => {
    const scoped = practiceExamId ? exams.filter((exam) => exam.practiceExamId === practiceExamId) : exams;
    const byId = new Map(scoped.flatMap((exam) => exam.domains).map((domain) => [domain.id, domain]));
    return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [exams, practiceExamId]);

  const statusLabels: Record<QuestionBankStatus, string> = {
    RESOLVED: dict.resolved,
    UNRESOLVED: dict.unresolved,
  };

  const changeExam = (value: string) => {
    const nextExamId = value && value !== ALL ? Number(value) : undefined;
    const examDomains = exams.find((exam) => exam.practiceExamId === nextExamId)?.domains;
    const keepDomain = !nextExamId || !examDomains || examDomains.some((domain) => domain.id === domainId);
    onChange({ practiceExamId: nextExamId, domainId: keepDomain ? domainId : undefined });
  };

  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (practiceExamId) {
    chips.push({
      key: "exam",
      label: exams.find((exam) => exam.practiceExamId === practiceExamId)?.title ?? dict.exam,
      clear: () => onChange({ practiceExamId: undefined }),
    });
  }
  if (domainId) {
    chips.push({
      key: "domain",
      label: domainOptions.find((domain) => domain.id === domainId)?.name ?? dict.domain,
      clear: () => onChange({ domainId: undefined }),
    });
  }
  if (status) {
    chips.push({ key: "status", label: statusLabels[status], clear: () => onChange({ status: undefined }) });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(0,1fr)_auto]">
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">{dict.exam}</span>
          <SearchableSelect
            options={[
              { value: ALL, label: dict.allExams },
              ...exams.map((exam) => ({ value: String(exam.practiceExamId), label: exam.title })),
            ]}
            value={practiceExamId ? String(practiceExamId) : ALL}
            onValueChange={changeExam}
            placeholder={dict.allExams}
            searchPlaceholder={dict.searchExam}
            emptyText={dict.noMatches}
            triggerClassName={TRIGGER_CLASS}
            maxOptions={MAX_OPTIONS}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">{dict.domain}</span>
          <SearchableSelect
            options={[
              { value: ALL, label: dict.allDomains },
              ...domainOptions.map((domain) => ({ value: String(domain.id), label: domain.name })),
            ]}
            value={domainId ? String(domainId) : ALL}
            onValueChange={(value) => onChange({ domainId: value && value !== ALL ? Number(value) : undefined })}
            placeholder={dict.allDomains}
            searchPlaceholder={dict.searchDomain}
            emptyText={dict.noMatches}
            triggerClassName={TRIGGER_CLASS}
            maxOptions={MAX_OPTIONS}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">{dict.status}</span>
          <Select
            value={status ?? ALL}
            onValueChange={(value) => onChange({ status: value === ALL ? undefined : (value as QuestionBankStatus) })}
          >
            <SelectTrigger className={cn("w-full cursor-pointer", TRIGGER_CLASS)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL} className="cursor-pointer">
                {dict.allStatuses}
              </SelectItem>
              <SelectItem value="UNRESOLVED" className="cursor-pointer">
                {dict.unresolved}
              </SelectItem>
              <SelectItem value="RESOLVED" className="cursor-pointer">
                {dict.resolved}
              </SelectItem>
            </SelectContent>
          </Select>
        </label>
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full px-5 text-base xl:w-auto"
            disabled={chips.length === 0}
            onClick={onClear}
          >
            <FilterX className="size-5" />
            {dict.clearAll}
          </Button>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex max-w-full items-center gap-1 rounded-full border bg-muted/50 py-1 pr-1 pl-3 text-sm"
            >
              <span className="truncate">{chip.label}</span>
              <button
                type="button"
                onClick={chip.clear}
                aria-label={dict.removeFilter.replace("{{label}}", chip.label)}
                className="cursor-pointer rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
