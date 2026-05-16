import { locales, defaultLocale } from './i18n/config';

export default {
  locales,
  defaultLocale,
  loadLocaleFrom: (locale: string, namespace: string) =>
    import(`./i18n/messages/${locale}/${namespace}.json`).then((module) => module.default),
};
