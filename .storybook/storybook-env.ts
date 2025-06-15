import {
  fallbackLanguage,
  i18nextResources,
} from "../app/infra/i18n/i18n-config";

export default {
  locale:
    (import.meta.env.STORYBOOK_LOCALE as keyof typeof i18nextResources) ||
    fallbackLanguage,
};
