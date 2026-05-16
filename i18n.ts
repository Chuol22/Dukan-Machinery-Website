import { getRequestConfig } from 'next-intl/server';
import { locales } from './i18n/config';

export default getRequestConfig(async ({ locale }) => {
  // Validate locale
  if (!locales.includes(locale as any)) {
    return {
      messages: (await import(`./i18n/messages/en/common.json`)).default,
    };
  }

  // Load all translation files for the locale
  const [common, home, machines, contact, order, process, testimonials, insights, blog, ui, chatbot] = await Promise.all([
    import(`./i18n/messages/${locale}/common.json`),
    import(`./i18n/messages/${locale}/home.json`),
    import(`./i18n/messages/${locale}/machines.json`),
    import(`./i18n/messages/${locale}/contact.json`),
    import(`./i18n/messages/${locale}/order.json`),
    import(`./i18n/messages/${locale}/process.json`),
    import(`./i18n/messages/${locale}/testimonials.json`),
    import(`./i18n/messages/${locale}/insights.json`),
    import(`./i18n/messages/${locale}/blog.json`),
    import(`./i18n/messages/${locale}/ui.json`),
    import(`./i18n/messages/${locale}/chatbot.json`),
  ]);

  return {
    messages: {
      ...common.default,
      ...home.default,
      ...machines.default,
      ...contact.default,
      ...order.default,
      ...process.default,
      ...testimonials.default,
      ...insights.default,
      ...blog.default,
      ...ui.default,
      ...chatbot.default,
    },
  };
});