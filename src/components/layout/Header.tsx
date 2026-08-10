"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage, languageLabels, Language } from "@/i18n/LanguageContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.about, href: "/hakkimda" },
    { name: t.nav.services, href: "/hizmetler" },
    { name: t.nav.programs, href: "/programlar" },
    { name: t.nav.novaVera, href: "/nova-vera" },
    { name: t.nav.media, href: "/medya" },
    { name: t.nav.events, href: "/etkinlikler" },
    { name: t.nav.resources, href: "/kaynaklar" },
    { name: t.nav.contact, href: "/iletisim" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[var(--lavender)]/30">
      {/* Top bar with language switcher */}
      <div className="bg-[var(--dark)] text-white py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center">
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-1 text-sm hover:text-[var(--amber)] transition-colors"
            >
              <Globe size={14} />
              <span>{languageLabels[language].flag} {languageLabels[language].name}</span>
            </button>

            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-[var(--lavender)]/30 overflow-hidden z-50"
              >
                {(Object.keys(languageLabels) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setLangOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-2 hover:bg-[var(--soft)] transition-colors ${
                      language === lang ? "bg-[var(--soft)]" : ""
                    }`}
                  >
                    <span>{languageLabels[lang].flag}</span>
                    <span className="text-sm text-[var(--dark)]">{languageLabels[lang].name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src={t?.siteSettings?.logo || "/logo.png"}
              alt="Kumru Köseler"
              className="h-16 lg:h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-7">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[var(--text-body)] hover:text-[var(--indigo)] transition-colors font-medium text-sm whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden xl:block flex-shrink-0">
            <Link
              href="/iletisim"
              className="px-5 py-2.5 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-colors text-sm whitespace-nowrap"
            >
              {t.nav.cta}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 text-[var(--dark)]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="xl:hidden py-4 border-t border-[var(--lavender)]/30"
          >
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-[var(--text-body)] hover:text-[var(--indigo)] transition-colors font-medium py-2 px-2"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href="/iletisim"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-colors text-center mt-4"
              >
                {t.nav.cta}
              </Link>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}
