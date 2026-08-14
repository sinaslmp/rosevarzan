import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fa", "en", "es", "zh", "de", "fr", "it", "ru", "ar", "tr"],
  defaultLocale: "fa",
  localePrefix: "always",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

export const localeDirections: Record<AppLocale, "rtl" | "ltr"> = {
  fa: "rtl",
  en: "ltr",
  es: "ltr",
  zh: "ltr",
  de: "ltr",
  fr: "ltr",
  it: "ltr",
  ru: "ltr",
  ar: "rtl",
  tr: "ltr",
};

export const localeLabels: Record<AppLocale, string> = {
  fa: "فارسی",
  en: "English",
  es: "Español",
  zh: "中文",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  ru: "Русский",
  ar: "العربية",
  tr: "Türkçe",
};

export const localeFlags: Record<AppLocale, string> = {
  fa: "🇮🇷",
  en: "🇬🇧",
  es: "🇪🇸",
  zh: "🇨🇳",
  de: "🇩🇪",
  fr: "🇫🇷",
  it: "🇮🇹",
  ru: "🇷🇺",
  ar: "🇸🇦",
  tr: "🇹🇷",
};

/**
 * Product/Category records are only authored in Persian and English
 * (`nameFa`/`nameEn`). Every other UI locale falls back to the English
 * content field, matching parsulfite's `contentLocale` pattern — full
 * per-locale catalog translation is a content-ops task, not a schema one.
 */
export function contentLocale(locale: AppLocale): "fa" | "en" {
  return locale === "fa" ? "fa" : "en";
}
