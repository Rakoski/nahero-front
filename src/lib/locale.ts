export type Locale = "en" | "pt";

export const resolveLocale = (lang: string): Locale =>
  lang === "pt" ? "pt" : "en";
