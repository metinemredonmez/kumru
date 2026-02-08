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
    { name: t.nav.media, href: "/medya" },
    { name: t.nav.resources, href: "/kaynaklar" },
    { name: t.nav.contact, href: "/iletisim" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--lavender)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-28">
          {/* Logo - Sol */}
          <Link href="/" className="flex items-center mr-auto">
            <img
              src="/logo.png"
              alt="Kumru Köseler - Grow Bold, Every Day"
              className="h-24 w-auto"
            />
          </Link>

          {/* Desktop Navigation - Orta */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[var(--text-body)] hover:text-[var(--indigo)] transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button & Language Switcher - Sağ */}
          <div className="hidden md:flex items-center gap-4 ml-8">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-[var(--lavender)] hover:border-[var(--indigo)] transition-colors"
              >
                <Globe size={18} className="text-[var(--indigo)]" />
                <span className="text-sm font-medium">{languageLabels[language].flag}</span>
              </button>

              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-[var(--lavender)]/30 overflow-hidden"
                >
                  {(Object.keys(languageLabels) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setLangOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-[var(--soft)] transition-colors ${
                        language === lang ? "bg-[var(--soft)]" : ""
                      }`}
                    >
                      <span className="text-lg">{languageLabels[lang].flag}</span>
                      <span className="text-sm font-medium">{languageLabels[lang].name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <Link
              href="/iletisim"
              className="px-6 py-3 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-colors"
            >
              {t.nav.cta}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[var(--dark)]"
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
            className="md:hidden py-4 border-t border-[var(--lavender)]/30"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-[var(--text-body)] hover:text-[var(--indigo)] transition-colors font-medium py-2"
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Language Switcher */}
              <div className="flex gap-2 py-2">
                {(Object.keys(languageLabels) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                      language === lang
                        ? "border-[var(--indigo)] bg-[var(--soft)]"
                        : "border-[var(--lavender)]"
                    }`}
                  >
                    <span>{languageLabels[lang].flag}</span>
                    <span className="text-sm">{languageLabels[lang].name}</span>
                  </button>
                ))}
              </div>

              <Link
                href="/iletisim"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-colors text-center mt-2"
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
