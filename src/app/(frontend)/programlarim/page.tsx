"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, LogOut, CheckCircle2, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { useMember } from "@/i18n/MemberContext";

interface CourseCard {
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  requiredTier: string;
  tierOk: boolean;
  totalStages: number;
  completedCount: number;
  started: boolean;
}

const TIER_LABEL: Record<string, { tr: string; en: string }> = {
  free: { tr: "Ücretsiz", en: "Free" },
  premium: { tr: "Premium", en: "Premium" },
  vip: { tr: "VIP", en: "VIP" },
};

const COPY = {
  tr: {
    greeting: "Merhaba",
    sub: "Dönüşüm yolculuğun burada. Her programı sırayla, kendi hızında ilerle.",
    tier: "Üyelik",
    logout: "Çıkış",
    continue: "Devam Et",
    start: "Başla",
    locked: "Kilitli",
    upgrade: "Premium'a Geç",
    completed: "Tamamlandı",
    stages: "aşama",
    upgradeNote: "Bu programa erişmek için üyeliğini yükseltmen gerekiyor.",
    empty: "Henüz yayında program yok. Çok yakında!",
  },
  en: {
    greeting: "Hello",
    sub: "Your transformation journey lives here. Move through each program in order, at your own pace.",
    tier: "Membership",
    logout: "Log out",
    continue: "Continue",
    start: "Start",
    locked: "Locked",
    upgrade: "Upgrade to Premium",
    completed: "Completed",
    stages: "stages",
    upgradeNote: "You need to upgrade your membership to access this program.",
    empty: "No published programs yet. Coming soon!",
  },
};

export default function MyProgramsPage() {
  const { language } = useLanguage();
  const { member, loading: memberLoading, logout } = useMember();
  const router = useRouter();
  const lang = language === "en" ? "en" : "tr";
  const c = COPY[lang];

  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (memberLoading) return;
    if (!member) {
      router.replace("/giris?next=/programlarim");
      return;
    }
    fetch(`/api/my/courses?lang=${lang}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { courses: [] }))
      .then((data) => setCourses(data?.courses || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [member, memberLoading, lang, router]);

  if (memberLoading || !member) {
    return (
      <>
        <Header />
        <main className="pt-36 pb-24 min-h-screen text-center text-[var(--text-body)]">…</main>
        <Footer />
      </>
    );
  }

  const tier = member.membershipTier || "free";

  return (
    <>
      <Header />
      <main className="pt-28 lg:pt-36 pb-24 bg-gradient-to-b from-[var(--soft)]/40 to-white min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-start justify-between gap-4 mb-10"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[var(--dark)] mb-2">
                {c.greeting}, {member.name?.split(" ")[0] || ""} 👋
              </h1>
              <p className="text-[var(--text-body)] max-w-xl">{c.sub}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--soft)] text-[var(--indigo)] text-sm font-semibold">
                <Sparkles size={14} /> {c.tier}: {TIER_LABEL[tier]?.[lang] || tier}
              </span>
              <button
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--lavender)]/50 text-[var(--text-body)] text-sm hover:bg-gray-50 transition-colors"
              >
                <LogOut size={14} /> {c.logout}
              </button>
            </div>
          </motion.div>

          {/* Courses */}
          {loading ? (
            <div className="text-center text-[var(--text-body)] py-20">…</div>
          ) : courses.length === 0 ? (
            <div className="text-center text-[var(--text-body)] py-20">{c.empty}</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {courses.map((course, i) => {
                const pct = course.totalStages > 0 ? Math.round((course.completedCount / course.totalStages) * 100) : 0;
                const isDone = course.totalStages > 0 && course.completedCount >= course.totalStages;
                return (
                  <motion.div
                    key={course.slug}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex flex-col rounded-2xl bg-white border border-[var(--lavender)]/40 shadow-sm overflow-hidden"
                  >
                    <div
                      className="h-32 bg-gradient-to-br from-[var(--indigo)] to-[var(--purple)] relative"
                      style={
                        course.coverImage
                          ? { backgroundImage: `url(${course.coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
                          : undefined
                      }
                    >
                      {!course.tierOk && (
                        <div className="absolute inset-0 bg-[var(--dark)]/60 flex items-center justify-center">
                          <Lock size={28} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--soft)] text-[var(--indigo)]">
                          {TIER_LABEL[course.requiredTier]?.[lang] || course.requiredTier}
                        </span>
                        {isDone && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                            <CheckCircle2 size={14} /> {c.completed}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[var(--dark)] mb-1.5">{course.title}</h3>
                      {course.description && (
                        <p className="text-sm text-[var(--text-body)] leading-relaxed mb-4 line-clamp-3 flex-1">
                          {course.description}
                        </p>
                      )}

                      {/* Progress */}
                      {course.tierOk && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-[var(--text-body)] mb-1">
                            <span>
                              {course.completedCount}/{course.totalStages} {c.stages}
                            </span>
                            <span>{pct}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-[var(--soft)] overflow-hidden">
                            <div className="h-full bg-[var(--indigo)] rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )}

                      {course.tierOk ? (
                        <Link
                          href={`/programlarim/${course.slug}`}
                          className="inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--indigo)] text-white font-semibold hover:bg-[var(--purple)] transition-colors mt-auto"
                        >
                          {course.started ? c.continue : c.start} <ArrowRight size={16} />
                        </Link>
                      ) : (
                        <div className="mt-auto">
                          <p className="text-xs text-[var(--text-body)] mb-2">{c.upgradeNote}</p>
                          <Link
                            href="/uyelik"
                            className="inline-flex items-center justify-center gap-2 py-2.5 w-full rounded-xl bg-[var(--dark)] text-white font-semibold hover:bg-[var(--dark-secondary)] transition-colors"
                          >
                            <Lock size={16} /> {c.upgrade}
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
