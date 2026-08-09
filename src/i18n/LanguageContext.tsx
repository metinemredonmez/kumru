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

// CMS içeriği için modül seviyesinde cache (dil başına tek fetch)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cmsCache: Partial<Record<Language, any>> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPlainObject = (value: any): value is Record<string, any> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * override'daki değerleri base üzerine yazar.
 * - İkisi de plain object ise recursive merge
 * - Array ve primitive'lerde override kazanır
 * - override undefined/null ise base kalır
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deepMerge = (base: any, override: any): any => {
  if (override === undefined || override === null) return base;
  if (isPlainObject(base) && isPlainObject(override)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: Record<string, any> = { ...base };
    for (const key of Object.keys(override)) {
      result[key] = deepMerge(base[key], override[key]);
    }
    return result;
  }
  return override;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cmsData, setCmsData] = useState<any>(null);
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

  // CMS içeriğini çek (sadece client — useEffect zaten client'ta çalışır).
  // Fetch başarısız olursa veya boş dönerse t bundle JSON olarak kalır.
  useEffect(() => {
    let cancelled = false;
    const targetLang = language;

    if (cmsCache[targetLang]) {
      setCmsData(cmsCache[targetLang]);
      return;
    }

    // Yeni dilin CMS verisi henüz yok; önceki dilin verisiyle yanlış merge olmasın
    setCmsData(null);

    fetch(`/api/content?lang=${targetLang}`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        cmsCache[targetLang] = data;
        // Stale guard: dil değiştiyse cleanup cancelled=true yapar, state'e yazma
        if (!cancelled) {
          setCmsData(data);
        }
      })
      .catch(() => {
        if (!cancelled) setCmsData({});
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    globalLanguage = lang;
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch {
      // localStorage yazma hatası
    }
  }, []);

  // İlk render'da t = bundle JSON (hydration mismatch olmaz);
  // CMS verisi gelince deep-merge ile zenginleşir.
  const t = useMemo(
    () =>
      cmsData && Object.keys(cmsData).length > 0
        ? deepMerge(translations[language], cmsData)
        : translations[language],
    [language, cmsData]
  );

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
