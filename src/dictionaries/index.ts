import { en } from "./en";
import { pt } from "./pt";

const dictionaries = { en, pt };

export const getDictionary = async (locale: "en" | "pt") =>
  dictionaries[locale];
