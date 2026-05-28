// app/hooks/useGoogleTranslate.ts
"use client";

import { useEffect, useState, useCallback, useRef } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  // Use emoji to guarantee the "flag" always appears.
  // Language recognition is done via `code` (Google Translate cookies).
  flag: string;
  dir?: 'ltr' | 'rtl';  
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '/flags/gb.png' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '/flags/et.png' },
  { code: 'om', name: 'Oromiffa', nativeName: 'Afaan Oromo', flag: '/flags/et.png' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '/flags/fr.png' },
];

const setCookie = (name: string, value: string, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; domain=${hostname}; SameSite=Lax`;
    }
  }
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

export function useGoogleTranslate() {
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const savedLang = getCookie('GOOGLE_TRANSLATE_LANG');
    if (savedLang) {
      const lang = languages.find((l) => l.code === savedLang);
      if (lang) {
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

        if (lang.code !== 'en') {
          document.cookie = `googtrans=/en/${lang.code}; path=/; SameSite=Lax`;
          if (!isLocalhost) {
            document.cookie = `googtrans=/en/${lang.code}; path=/; domain=${hostname}; SameSite=Lax`;
          }
        } else {
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          if (!isLocalhost) {
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
          }
        }

        window.setTimeout(() => setCurrentLang(lang), 0);
      }
    }

    const checkGoogleTranslate = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).google?.translate?.TranslateElement) {
        setIsLoaded(true);
        clearInterval(checkGoogleTranslate);
      }
    }, 50);

    const timeout = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).google?.translate) {
        setIsLoaded(true);
      }
    }, 2000);

    return () => {
      clearInterval(checkGoogleTranslate);
      clearTimeout(timeout);
    };
  }, []);

  const changeLanguage = useCallback(
    (lang: Language) => {
      if (lang.code === currentLang.code) return;

      setIsTranslating(true);
      setCurrentLang(lang);

      setCookie('GOOGLE_TRANSLATE_LANG', lang.code);

      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

      if (lang.code === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        if (!isLocalhost) {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
        }
      } else {
        document.cookie = `googtrans=/en/${lang.code}; path=/; SameSite=Lax`;
        if (!isLocalhost) {
          document.cookie = `googtrans=/en/${lang.code}; path=/; domain=${hostname}; SameSite=Lax`;
        }
      }

      window.location.reload();
    },
    [currentLang.code],
  );

  return {
    currentLang,
    isLoaded,
    isTranslating,
    changeLanguage,
    languages,
  };
}

