'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const t = useTranslations('common');
  const locale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'home', href: `/${locale}` },
    { key: 'machines', href: `/${locale}/machines` },
    { key: 'contact', href: `/${locale}/contact` },
    { key: 'order', href: `/${locale}/order` },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href={`/${locale}`} className="text-2xl font-bold text-green-700 dark:text-white">
            Dukan Machinery
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors py-2"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}