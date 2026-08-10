"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UpgradeButton from "@/components/uyelik/UpgradeButton";
import { useLanguage } from "@/i18n/LanguageContext";
import { useMember } from "@/i18n/MemberContext";

interface Plan {
  id: number | string;
  name: string;
  tier: "free" | "premium" | "vip";
  price?: string;
  interval?: string;
  features?: { item?: string }[];
  highlighted?: boolean;
  order?: number;
}

const RANK: Record<string, number> = { free: 0, premium: 1, vip: 2 };

const COPY = {
  tr: {
    badge: "Üyelik",
    title: "Dönüşüm Yolculuğuna Katıl",
    subtitle:
      "Tek bir Premium üyelikle tüm ilerlemeli programlara, meditasyonlara ve canlı yayınlara sınırsız erişim. Her şey aynı fiyat — gizli ücret yok.",
    current: "Mevcut planın",
    choose: "Planı Seç",
    join: "Üye Ol",
    free: "Ücretsiz Başla",
    upgrade: "Yükselt",
    loginToUpgrade: "Yükseltmek için giriş yap",
    perksNote: "İstediğin zaman iptal edebilirsin. Taahhüt yok.",
    flatTitle: "Neden tek fiyat?",
    flatDesc:
      "Programları tek tek satın almak zorunda değilsin. Premium üyelikle bugün ve gelecekte eklenen tüm içerikler sana açık. Yeni program çıktığında ekstra ödeme yapmazsın.",
    whatsappMsg: "Merhaba, Premium üyelik hakkında bilgi almak istiyorum.",
  },
  en: {
    badge: "Membership",
    title: "Join the Transformation Journey",
    subtitle:
      "One Premium membership, unlimited access to all progressive programs, meditations and live streams. Everything one price — no hidden fees.",
    current: "Your current plan",
    choose: "Choose Plan",
    join: "Sign Up",
    free: "Start Free",
    upgrade: "Upgrade",
    loginToUpgrade: "Log in to upgrade",
    perksNote: "Cancel anytime. No commitment.",
    flatTitle: "Why one price?",
    flatDesc:
      "You don't have to buy programs one by one. With Premium, all content added today and in the future is open to you. No extra payment when a new program launches.",
    whatsappMsg: "Hello, I would like information about Premium membership.",
  },
};

const TIER_ICON = { free: Star, premium: Sparkles, vip: Crown };

export default function MembershipPage() {
  const { language } = useLanguage();
  const { member } = useMember();
  const c = COPY[language === "en" ? "en" : "tr"];
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/membership-plans?locale=${language}&sort=order&limit=20`)
      .then((r) => (r.ok ? r.json() : { docs: [] }))
      .then((data) => setPlans(data?.docs || []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, [language]);

  const memberTier = member?.membershipTier || null;

  return (
    <>
      <Header />
      <main className="pt-28 lg:pt-36 pb-24 bg-gradient-to-b from-[var(--soft)]/40 to-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--soft)] text-[var(--indigo)] text-sm font-semibold mb-4">
              {c.badge}
            </span>
            <h1 className="text-3xl lg:text-5xl font-bold text-[var(--dark)] mb-5 leading-tight">
              {c.title}
            </h1>
            <p className="text-[var(--text-body)] text-lg leading-relaxed">{c.subtitle}</p>
          </motion.div>

          {/* Plans */}
          {loading ? (
            <div className="text-center text-[var(--text-body)] py-20">…</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {plans.map((plan, i) => {
                const Icon = TIER_ICON[plan.tier] || Star;
                const isCurrent = memberTier === plan.tier;
                const isFree = plan.tier === "free";
                const canUpgrade = member && memberTier && RANK[plan.tier] > RANK[memberTier];
                const highlighted = plan.highlighted;

                let cta: React.ReactNode;
                if (isCurrent) {
                  cta = (
                    <span className="block text-center py-3 rounded-xl font-semibold bg-[var(--soft)] text-[var(--indigo)]">
                      ✓ {c.current}
                    </span>
                  );
                } else if (!member) {
                  cta = (
                    <Link
                      href={`/giris?next=${isFree ? "/programlarim" : "/uyelik"}`}
                      className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                        highlighted
                          ? "bg-[var(--indigo)] text-white hover:bg-[var(--purple)]"
                          : "bg-[var(--dark)] text-white hover:bg-[var(--dark-secondary)]"
                      }`}
                    >
                      {isFree ? c.free : c.join}
                    </Link>
                  );
                } else if (canUpgrade) {
                  cta = (
                    <UpgradeButton
                      tier={plan.tier}
                      label={c.upgrade}
                      className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                        highlighted
                          ? "bg-[var(--indigo)] text-white hover:bg-[var(--purple)]"
                          : "bg-[var(--dark)] text-white hover:bg-[var(--dark-secondary)]"
                      }`}
                    />
                  );
                } else {
                  cta = (
                    <span className="block text-center py-3 rounded-xl font-semibold bg-gray-100 text-gray-400">
                      —
                    </span>
                  );
                }

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative flex flex-col rounded-2xl p-7 lg:p-8 bg-white border ${
                      highlighted
                        ? "border-[var(--indigo)] shadow-xl shadow-[var(--indigo)]/10 md:-translate-y-3"
                        : "border-[var(--lavender)]/40 shadow-sm"
                    }`}
                  >
                    {highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--indigo)] text-white text-xs font-bold tracking-wide">
                        {language === "en" ? "MOST POPULAR" : "EN POPÜLER"}
                      </span>
                    )}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                        highlighted ? "bg-[var(--indigo)] text-white" : "bg-[var(--soft)] text-[var(--indigo)]"
                      }`}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--dark)] mb-1">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-3xl font-extrabold text-[var(--dark)]">{plan.price}</span>
                    </div>
                    <ul className="flex flex-col gap-3 mb-8 flex-1">
                      {(plan.features || []).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-[var(--text-body)] text-sm leading-relaxed">
                          <Check size={18} className="text-[var(--indigo)] flex-shrink-0 mt-0.5" />
                          <span>{f.item}</span>
                        </li>
                      ))}
                    </ul>
                    {cta}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Flat pricing explainer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mt-16 text-center bg-white rounded-2xl border border-[var(--lavender)]/40 p-8"
          >
            <h2 className="text-xl font-bold text-[var(--dark)] mb-3">{c.flatTitle}</h2>
            <p className="text-[var(--text-body)] leading-relaxed">{c.flatDesc}</p>
            <p className="text-sm text-[var(--text-body)]/70 mt-4">{c.perksNote}</p>
            {member && (
              <Link
                href="/programlarim"
                className="inline-flex items-center gap-2 mt-6 text-[var(--indigo)] font-semibold hover:gap-3 transition-all"
              >
                {language === "en" ? "Go to my programs" : "Programlarıma git"} <ArrowRight size={18} />
              </Link>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
