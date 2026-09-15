"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/locale";

type LocaleContextValue = {
  lang: Locale;
  dict: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = LocaleContextValue & {
  children: ReactNode;
};

export function LocaleProvider({ lang, dict, children }: LocaleProviderProps) {
  const value = useMemo(() => ({ lang, dict }), [lang, dict]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context)
    throw new Error("useLocale must be used within a LocaleProvider");
  return context;
}

export function useDictionary(): Dictionary {
  return useLocale().dict;
}
