import type { Locale } from "@/lib/locale";
import { en } from "./en";
import { pt } from "./pt";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, pt };

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale];
