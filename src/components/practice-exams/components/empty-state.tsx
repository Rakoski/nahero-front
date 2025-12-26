import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  dict: {
    title: string;
    description_filtered: string;
    description_empty: string;
    clear_button: string;
  };
}

export function EmptyState({
  hasActiveFilters,
  onClearFilters,
  dict,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{dict.title}</h3>
      <p className="text-muted-foreground max-w-md mb-4">
        {hasActiveFilters ? dict.description_filtered : dict.description_empty}
      </p>
      {hasActiveFilters && (
        <Button onClick={onClearFilters} variant="outline">
          {dict.clear_button}
        </Button>
      )}
    </div>
  );
}
