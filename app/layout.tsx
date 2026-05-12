// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { changaOne } from './fonts';
import './globals.css';

// Layout Components
import Navbar from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';

// ✅ Import the client wrapper instead of dynamic directly
import ChatbotClientWrapper from '@/components/chatbot/ChatbotClientWrapper';

// Context Providers
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: {
    default: 'Dukan Machinery - Premium Industrial Equipment Solutions',
    template: '%s | Dukan Machinery'
  },
  description: 'Leading manufacturer of premium feed processing machinery and industrial equipment. Custom solutions for agricultural and construction needs with 5+ years of engineering excellence.',
  keywords: ['heavy machinery', 'industrial equipment', 'feed processing', 'construction equipment', 'agricultural machinery', 'custom machinery', 'ethiopia machinery'],
  authors: [{ name: 'Dukan Machinery' }],
  creator: 'Dukan Machinery',
  publisher: 'Dukan Machinery',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dukanmachinery.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dukanmachinery.com',
    title: 'Dukan Machinery - Premium Industrial Equipment Solutions',
    description: 'Leading manufacturer of premium feed processing machinery and industrial equipment with 5+ years of engineering excellence.',
    siteName: 'Dukan Machinery',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dukan Machinery - Industrial Equipment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dukan Machinery - Premium Industrial Equipment Solutions',
    description: 'Leading manufacturer of premium feed processing machinery and industrial equipment.',
    images: ['/og-image.jpg'],
    creator: '@dukanmachinery',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
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
      suppressHydrationWarning={true}
    >
      <body 
        className="font-sans" 
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="pt-16 lg:pt-20 min-h-screen">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
            {/* ✅ Use the client wrapper */}
            <ChatbotClientWrapper />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}