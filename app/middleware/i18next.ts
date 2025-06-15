import { redirect } from "react-router";
import { unstable_createI18nextMiddleware } from "remix-i18next/middleware";
import {
  supportedLanguages,
  fallbackLanguage,
  i18nextResources,
} from "~/infra/i18n/i18n-config";

export const [i18nextMiddleware, getLocale, getInstance] =
  unstable_createI18nextMiddleware({
    detection: {
      supportedLanguages,
      fallbackLanguage,
      findLocale: async (request) => {
        const url = new URL(request.url);
        const pathname = url.pathname;

        //find in path
        const localeOnPath = pathname.split("/").at(1);
        if (localeOnPath && supportedLanguages.includes(localeOnPath)) {
          return localeOnPath;
        }

        //detect locale to redirect
        let localeToRedirect = fallbackLanguage;
        const acceptLanguages =
          request.headers.get("accept-language")?.split(",") || [];
        for (const code of acceptLanguages) {
          const lang = code.split("-")[0];
          if (supportedLanguages.includes(lang)) {
            localeToRedirect = lang;
            break;
          }
        }

        //redirect with detected language
        const newPathname =
          pathname === "/"
            ? `/${localeToRedirect}/`
            : `/${localeToRedirect}${pathname}`;
        throw redirect(url.origin + newPathname + url.search);
      },
    },
    i18next: {
      resources: i18nextResources,
    },
  });
