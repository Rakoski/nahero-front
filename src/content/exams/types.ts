import type { Locale } from "@/lib/locale";

export type LocalizedText = Record<Locale, string>;

export type ExamDomain = {
  name: LocalizedText;
  /** Share of the official exam, in percent. */
  weight?: number;
};

export type ExamCost = {
  currency: "USD";
  amount: number;
};

export type ExamContent = {
  /** Official certification code, e.g. "CLF-C02". */
  code?: string;
  cost?: ExamCost;
  /** Years the certification stays valid; null when it does not expire. */
  validityYears?: number | null;
  /** Official exam guide, rendered as the source for everything above. */
  officialUrl?: string;
  domains?: ExamDomain[];
};
