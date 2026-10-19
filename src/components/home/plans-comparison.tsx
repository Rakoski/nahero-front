import Link from "next/link";
import { ArrowRight, Check, Minus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Routes } from "@/routes/routes";

export interface PlansComparisonDict {
  title: string;
  description: string;
  feature_label: string;
  free_label: string;
  premium_label: string;
  rows: readonly { label: string; free: boolean }[];
  included: string;
  not_included: string;
  price_note: string;
  cta: string;
}

interface PlansComparisonProps {
  dict: PlansComparisonDict;
  priceNote: string;
  lang: "en" | "pt";
}

function Mark({ included, dict }: { included: boolean; dict: PlansComparisonDict }) {
  return included ? (
    <span className="flex justify-center text-emerald-400">
      <Check className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{dict.included}</span>
    </span>
  ) : (
    <span className="flex justify-center text-muted-foreground/60">
      <Minus className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{dict.not_included}</span>
    </span>
  );
}

export function PlansComparison({ dict, priceNote, lang }: PlansComparisonProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-medium">
            <th scope="col" className="px-5 py-3 text-left text-muted-foreground">
              {dict.feature_label}
            </th>
            <th scope="col" className="w-20 px-2 py-3 text-center sm:w-24">
              {dict.free_label}
            </th>
            <th scope="col" className="w-20 px-2 py-3 text-center text-yellow-400 sm:w-24">
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                {dict.premium_label}
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {dict.rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="px-5 py-3 text-left font-normal">
                {row.label}
              </th>
              <td className="px-2 py-3">
                <Mark included={row.free} dict={dict} />
              </td>
              <td className="bg-yellow-500/[0.04] px-2 py-3">
                <Mark included dict={dict} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-auto flex flex-col items-start gap-3 border-t border-border bg-background/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium">{priceNote}</p>
        <Button
          asChild
          size="sm"
          className="w-full bg-yellow-600 text-white hover:bg-yellow-700 sm:w-auto"
        >
          <Link href={`/${lang}${Routes.Premium}`}>
            {dict.cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
