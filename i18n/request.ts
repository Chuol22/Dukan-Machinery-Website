import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  try {
    // Load all message namespaces
    const [common, home, contact, machines, order, process, testimonials, insights, blog, ui, chatbot] = await Promise.all([
      import(`./messages/${locale}/common.json`),
      import(`./messages/${locale}/home.json`),
      import(`./messages/${locale}/contact.json`),
      import(`./messages/${locale}/machines.json`),
      import(`./messages/${locale}/order.json`),
      import(`./messages/${locale}/process.json`),
      import(`./messages/${locale}/testimonials.json`),
      import(`./messages/${locale}/insights.json`),
      import(`./messages/${locale}/blog.json`),
      import(`./messages/${locale}/ui.json`),
      import(`./messages/${locale}/chatbot.json`),
    ]);
    
    return {
      messages: {
        common: common.default,
        home: home.default,
        contact: contact.default,
        machines: machines.default,
        order: order.default,
        process: process.default,
        testimonials: testimonials.default,
        insights: insights.default,
        blog: blog.default,
        ui: ui.default,
        chatbot: chatbot.default,
      },
      timeZone: 'Africa/Addis_Ababa',
      now: new Date(),
    };
  } catch (error) {
    // Fallback to default locale
    console.error('Error loading messages for locale:', locale, error);
    const [common, home, contact, machines, order, process, testimonials, insights, blog, ui, chatbot] = await Promise.all([
      import(`./messages/${defaultLocale}/common.json`),
      import(`./messages/${defaultLocale}/home.json`),
      import(`./messages/${defaultLocale}/contact.json`),
      import(`./messages/${defaultLocale}/machines.json`),
      import(`./messages/${defaultLocale}/order.json`),
      import(`./messages/${defaultLocale}/process.json`),
      import(`./messages/${defaultLocale}/testimonials.json`),
      import(`./messages/${defaultLocale}/insights.json`),
      import(`./messages/${defaultLocale}/blog.json`),
      import(`./messages/${defaultLocale}/ui.json`),
      import(`./messages/${defaultLocale}/chatbot.json`),
    ]);
    
    return {
      messages: {
        common: common.default,
        home: home.default,
        contact: contact.default,
        machines: machines.default,
        order: order.default,
        process: process.default,
        testimonials: testimonials.default,
        insights: insights.default,
        blog: blog.default,
        ui: ui.default,
        chatbot: chatbot.default,
      },
      timeZone: 'Africa/Addis_Ababa',
      now: new Date(),
    };
  }
});