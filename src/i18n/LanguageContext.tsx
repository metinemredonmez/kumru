'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useMemo, useRef } from 'react';

import tr from './locales/tr.json';
import en from './locales/en.json';

export type Language = 'tr' | 'en';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: Record<Language, any> = {
  tr,
  en,
};

export const languageLabels: Record<Language, { name: string; flag: string }> = {
  tr: { name: 'Türkçe', flag: '🇹🇷' },
  en: { name: 'English', flag: '🇬🇧' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'tr';
  try {
    const saved = localStorage.getItem('language') as Language;
    if (saved && translations[saved]) {
      return saved;
    }
  } catch {
    // localStorage erişim hatası
  }
  return 'tr';
};

let globalLanguage: Language | null = null;

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const getInitialLang = (): Language => {
    if (globalLanguage) return globalLanguage;
    if (typeof window !== 'undefined') {
      const stored = getStoredLanguage();
      globalLanguage = stored;
      return stored;
    }
    return 'tr';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLang);
  const [isReady, setIsReady] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const stored = getStoredLanguage();
      globalLanguage = stored;
      setLanguageState(stored);
    }
    requestAnimationFrame(() => {
      setIsReady(true);
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    globalLanguage = lang;
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch {
      // localStorage yazma hatası
    }
  }, []);

  const t = translations[language];

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      <div
        className={isReady ? 'lang-ready' : 'lang-loading'}
        style={{
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.05s ease-in',
        }}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
