import ja from "./locales/ja";
import en from "./locales/en";
import ko from "./locales/ko";

export const supportedLanguagesLabelAndValue = [
  { label: "日本語", value: "ja" },
  { label: "English", value: "en" },
  { label: "한국어", value: "ko" },
] as const;

export const supportedLanguages: string[] = supportedLanguagesLabelAndValue.map(
  (lang) => lang.value
);

export const fallbackLanguage = "ja";

export const i18nextResources = {
  ja: { translation: ja },
  en: { translation: en },
  ko: { translation: ko },
};

export type i18nextResourceType = typeof ja;
