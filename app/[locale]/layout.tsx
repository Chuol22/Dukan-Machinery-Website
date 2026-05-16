import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from '@/i18n/config';
import '../globals.css';

// Layout Components
import Navbar from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import ChatbotClientWrapper from '@/components/chatbot/ChatbotClientWrapper';

// Context Providers
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get all messages for the locale (load all namespaces)
  let messages;
  try {
    // Load all translation modules
    const [common, home, contact, machines, order, process, testimonials, insights, blog, ui, chatbot] = await Promise.all([
      import(`@/i18n/messages/${locale}/common.json`),
      import(`@/i18n/messages/${locale}/home.json`),
      import(`@/i18n/messages/${locale}/contact.json`),
      import(`@/i18n/messages/${locale}/machines.json`),
      import(`@/i18n/messages/${locale}/order.json`),
      import(`@/i18n/messages/${locale}/process.json`),
      import(`@/i18n/messages/${locale}/testimonials.json`),
      import(`@/i18n/messages/${locale}/insights.json`),
      import(`@/i18n/messages/${locale}/blog.json`),
      import(`@/i18n/messages/${locale}/ui.json`),
      import(`@/i18n/messages/${locale}/chatbot.json`),
    ]);
    
    messages = {
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
    };
  } catch (error) {
    // Fallback to English if any translation file not found
    console.error('Error loading translations for locale:', locale, error);
    const [common, home, contact, machines, order, process, testimonials, insights, blog, ui, chatbot] = await Promise.all([
      import(`@/i18n/messages/en/common.json`),
      import(`@/i18n/messages/en/home.json`),
      import(`@/i18n/messages/en/contact.json`),
      import(`@/i18n/messages/en/machines.json`),
      import(`@/i18n/messages/en/order.json`),
      import(`@/i18n/messages/en/process.json`),
      import(`@/i18n/messages/en/testimonials.json`),
      import(`@/i18n/messages/en/insights.json`),
      import(`@/i18n/messages/en/blog.json`),
      import(`@/i18n/messages/en/ui.json`),
      import(`@/i18n/messages/en/chatbot.json`),
    ]);
    
    messages = {
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
    };
  }

  return (
    <html lang={locale}>
      <body className="font-sans min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages} locale={locale} timeZone="Africa/Addis_Ababa">
          <ThemeProvider>
            <LanguageProvider>
              <Navbar />
              <main className="flex-grow pt-16 lg:pt-20">
                {children}
              </main>
              <Footer />
              <ScrollToTop />
              <ChatbotClientWrapper />
            </LanguageProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}