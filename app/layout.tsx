// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { changaOne } from './fonts';
import './globals.css';

// Layout Components
import Navbar from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget'

// Context Providers
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dukan Machinery - Quality Heavy Equipment',
  description: 'Your trusted partner for heavy machinery and equipment',
  keywords: 'heavy machinery, industrial equipment, construction equipment, agricultural machinery',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={changaOne.variable} 
      suppressHydrationWarning={true}  // ✅ CRITICAL: Prevents hydration mismatch
    >
      <body 
        className="font-sans" 
        suppressHydrationWarning={true}  // ✅ Also add to body for safety
      >
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="pt-16 lg:pt-20 min-h-screen">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
            <ChatbotWidget />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}