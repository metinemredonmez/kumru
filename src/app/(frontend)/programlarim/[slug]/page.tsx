"use client";

import { useEffect, useState, useCallback, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, Circle, ChevronLeft, Clock, Loader2, PlayCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { useMember } from "@/i18n/MemberContext";

interface Stage {
  order: number;
  title: string;
  summary?: string;
  content?: string;
  video?: string;
  estimatedMinutes?: number;
  done: boolean;
  unlocked: boolean;
}

interface CourseData {
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  requiredTier: string;
  tierOk: boolean;
  totalStages: number;
  completedCount: number;
  stages: Stage[];
  error?: string;
}

const COPY = {
  tr: {
    back: "Programlarım",
    locked: "Kilitli",
    lockedHint: "Önceki aşamayı tamamladığında açılır.",
    complete: "Bu Aşamayı Tamamla",
    completed: "Tamamlandı",
    min: "dk",
    upgradeTitle: "Bu program için üyelik yükseltmen gerekiyor",
    upgradeBtn: "Üyeliği Yükselt",
    progress: "İlerleme",
    open: "Aç",
    close: "Kapat",
  },
  en: {
    back: "My Programs",
    locked: "Locked",
    lockedHint: "Unlocks when you complete the previous stage.",
    complete: "Complete This Stage",
    completed: "Completed",
    min: "min",
    upgradeTitle: "You need to upgrade your membership for this program",
    upgradeBtn: "Upgrade Membership",
    progress: "Progress",
    open: "Open",
    close: "Close",
  },
};

export default function ProgramViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { language } = useLanguage();
  const { member, loading: memberLoading } = useMember();
  const router = useRouter();
  const lang = language === "en" ? "en" : "tr";
  const c = COPY[lang];

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openStage, setOpenStage] = useState<number | null>(null);
  const [completing, setCompleting] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/my/course/${slug}?lang=${lang}`, { credentials: "include" });
    const data = await res.json();
    setCourse(data);
    setLoading(false);
    // İlk açık ve tamamlanmamış aşamayı otomatik aç
    if (data?.stages) {
      const nextOpen = data.stages.find((s: Stage) => s.unlocked && !s.done);
      setOpenStage(nextOpen ? nextOpen.order : null);
    }
  }, [slug, lang]);

  useEffect(() => {
    if (memberLoading) return;
    if (!member) {
      router.replace(`/giris?next=/programlarim/${slug}`);
      return;
    }
    load();
  }, [member, memberLoading, load, router, slug]);

  const complete = async (order: number) => {
    setCompleting(order);
    try {
      const res = await fetch("/api/my/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slug, order }),
      });
      if (res.ok) {
        await load();
        // sıradaki aşamayı aç
        setOpenStage(order + 1);
      }
    } finally {
      setCompleting(null);
    }
  };

  if (memberLoading || loading || !member) {
    return (
      <>
        <Header />
        <main className="pt-36 pb-24 min-h-screen text-center text-[var(--text-body)]">…</main>
        <Footer />
      </>
    );
  }

  if (!course || course.error) {
    return (
      <>
        <Header />
        <main className="pt-36 pb-24 min-h-screen text-center">
          <p className="text-[var(--text-body)]">{course?.error || "Program bulunamadı."}</p>
          <Link href="/programlarim" className="text-[var(--indigo)] font-semibold mt-4 inline-block">
            ← {c.back}
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const pct = course.totalStages > 0 ? Math.round((course.completedCount / course.totalStages) * 100) : 0;

  return (
    <>
      <Header />
      <main className="pt-28 lg:pt-36 pb-24 bg-gradient-to-b from-[var(--soft)]/40 to-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/programlarim"
            className="inline-flex items-center gap-1 text-sm text-[var(--text-body)] hover:text-[var(--indigo)] mb-6"
          >
            <ChevronLeft size={16} /> {c.back}
          </Link>

          {/* Course header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-[var(--dark)] mb-3">{course.title}</h1>
            {course.description && (
              <p className="text-[var(--text-body)] leading-relaxed">{course.description}</p>
            )}

            {course.tierOk && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-[var(--text-body)] mb-1.5">
                  <span>{c.progress}</span>
                  <span>
                    {course.completedCount}/{course.totalStages} · {pct}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-[var(--soft)] overflow-hidden">
                  <div className="h-full bg-[var(--indigo)] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}
          </motion.div>

          {/* Upgrade banner */}
          {!course.tierOk && (
            <div className="rounded-2xl bg-[var(--dark)] text-white p-8 text-center mb-8">
              <Lock size={32} className="mx-auto mb-4 opacity-80" />
              <h2 className="text-xl font-bold mb-4">{c.upgradeTitle}</h2>
              <Link
                href="/uyelik"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--indigo)] text-white font-semibold hover:bg-[var(--purple)] transition-colors"
              >
                {c.upgradeBtn}
              </Link>
            </div>
          )}

          {/* Stages */}
          <div className="flex flex-col gap-4">
            {course.stages.map((stage) => {
              const isOpen = openStage === stage.order;
              const locked = !stage.unlocked;
              return (
                <motion.div
                  key={stage.order}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl border overflow-hidden transition-colors ${
                    locked
                      ? "border-[var(--lavender)]/30 bg-gray-50/60"
                      : "border-[var(--lavender)]/50 bg-white shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => !locked && setOpenStage(isOpen ? null : stage.order)}
                    disabled={locked}
                    className={`w-full flex items-center gap-4 p-5 text-left ${locked ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {/* Status icon */}
                    <div className="flex-shrink-0">
                      {stage.done ? (
                        <CheckCircle2 size={28} className="text-green-500" />
                      ) : locked ? (
                        <Lock size={24} className="text-[var(--text-body)]/40" />
                      ) : (
                        <Circle size={26} className="text-[var(--indigo)]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--indigo)]/70">
                          {String(stage.order).padStart(2, "0")}
                        </span>
                        {stage.estimatedMinutes ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[var(--text-body)]/60">
                            <Clock size={12} /> {stage.estimatedMinutes} {c.min}
                          </span>
                        ) : null}
                      </div>
                      <h3 className={`font-bold ${locked ? "text-[var(--text-body)]/60" : "text-[var(--dark)]"}`}>
                        {stage.title}
                      </h3>
                      {stage.summary && (
                        <p className="text-sm text-[var(--text-body)]/80 mt-0.5 line-clamp-2">{stage.summary}</p>
                      )}
                    </div>

                    {locked && (
                      <span className="flex-shrink-0 text-xs font-medium text-[var(--text-body)]/50">{c.locked}</span>
                    )}
                  </button>

                  {/* Expanded content */}
                  {isOpen && !locked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-5 pb-6 border-t border-[var(--lavender)]/30"
                    >
                      {stage.video && (
                        <div className="mt-5 rounded-xl overflow-hidden bg-black">
                          <video src={stage.video} controls className="w-full">
                            <track kind="captions" />
                          </video>
                        </div>
                      )}
                      {stage.content && (
                        <div className="mt-5 text-[var(--text-body)] leading-relaxed whitespace-pre-line">
                          {stage.content}
                        </div>
                      )}

                      {stage.done ? (
                        <div className="mt-6 inline-flex items-center gap-2 text-green-600 font-semibold">
                          <CheckCircle2 size={18} /> {c.completed}
                        </div>
                      ) : (
                        <button
                          onClick={() => complete(stage.order)}
                          disabled={completing === stage.order}
                          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--indigo)] text-white font-semibold hover:bg-[var(--purple)] transition-colors disabled:opacity-60"
                        >
                          {completing === stage.order ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <PlayCircle size={18} />
                          )}
                          {c.complete}
                        </button>
                      )}
                    </motion.div>
                  )}

                  {/* Locked hint */}
                  {isOpen === false && locked && (
                    <div className="px-5 pb-4 -mt-2">
                      <p className="text-xs text-[var(--text-body)]/50 pl-12">{c.lockedHint}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
