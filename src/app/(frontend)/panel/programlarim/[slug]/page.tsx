"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { Lock, CheckCircle2, Circle, ChevronLeft, Clock, Loader2, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/i18n/LanguageContext";

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
  title: string; slug: string; description?: string;
  requiredTier: string; tierOk: boolean;
  totalStages: number; completedCount: number; stages: Stage[]; error?: string;
}

export default function PanelProgramView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { language } = useLanguage();
  const lang = language === "en" ? "en" : "tr";

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openStage, setOpenStage] = useState<number | null>(null);
  const [completing, setCompleting] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/my/course/${slug}?lang=${lang}`, { credentials: "include" });
    const data = await res.json();
    setCourse(data);
    setLoading(false);
    if (data?.stages) {
      const next = data.stages.find((s: Stage) => s.unlocked && !s.done);
      setOpenStage(next ? next.order : null);
    }
  }, [slug, lang]);

  useEffect(() => { load(); }, [load]);

  const complete = async (order: number) => {
    setCompleting(order);
    try {
      const res = await fetch("/api/my/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slug, order }),
      });
      if (res.ok) { await load(); setOpenStage(order + 1); }
    } finally { setCompleting(null); }
  };

  const t = {
    back: lang === "en" ? "My Programs" : "Programlarım",
    locked: lang === "en" ? "Locked" : "Kilitli",
    lockedHint: lang === "en" ? "Unlocks when you complete the previous stage." : "Önceki aşamayı tamamladığında açılır.",
    complete: lang === "en" ? "Complete This Stage" : "Bu Aşamayı Tamamla",
    completed: lang === "en" ? "Completed" : "Tamamlandı",
    min: lang === "en" ? "min" : "dk",
    upgradeTitle: lang === "en" ? "Upgrade your membership for this program" : "Bu program için üyeliğini yükselt",
    upgradeBtn: lang === "en" ? "Upgrade" : "Üyeliği Yükselt",
    progress: lang === "en" ? "Progress" : "İlerleme",
  };

  if (loading) return <div className="text-muted-foreground py-16 text-center animate-pulse">…</div>;
  if (!course || course.error) return (
    <div className="py-16 text-center">
      <p className="text-muted-foreground">{course?.error || "Program bulunamadı."}</p>
      <Link href="/panel/programlarim" className="text-primary font-semibold mt-4 inline-block">← {t.back}</Link>
    </div>
  );

  const pct = course.totalStages ? Math.round((course.completedCount / course.totalStages) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link href="/panel/programlarim" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ChevronLeft className="size-4" /> {t.back}
      </Link>

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{course.title}</h1>
        {course.description && <p className="text-muted-foreground mt-2 leading-relaxed">{course.description}</p>}
        {course.tierOk && (
          <div className="mt-5">
            <div className="flex justify-between text-sm text-muted-foreground mb-1.5">
              <span>{t.progress}</span>
              <span>{course.completedCount}/{course.totalStages} · {pct}%</span>
            </div>
            <Progress value={pct} className="h-2.5" />
          </div>
        )}
      </div>

      {!course.tierOk && (
        <Card className="bg-foreground text-background p-8 text-center">
          <Lock className="size-8 mx-auto mb-4 opacity-80" />
          <h2 className="text-xl font-bold mb-4">{t.upgradeTitle}</h2>
          <Button asChild variant="secondary"><Link href="/panel/uyelik">{t.upgradeBtn}</Link></Button>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {course.stages.map((stage) => {
          const isOpen = openStage === stage.order;
          const locked = !stage.unlocked;
          return (
            <Card key={stage.order} className={cn("overflow-hidden", locked && "bg-secondary/40 shadow-none")}>
              <button
                onClick={() => !locked && setOpenStage(isOpen ? null : stage.order)}
                disabled={locked}
                className={cn("w-full flex items-center gap-4 p-5 text-left", locked ? "cursor-not-allowed" : "cursor-pointer")}
              >
                <div className="shrink-0">
                  {stage.done ? <CheckCircle2 className="size-7 text-emerald" />
                    : locked ? <Lock className="size-6 text-muted-foreground/50" />
                    : <Circle className="size-6 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary/70">{String(stage.order).padStart(2, "0")}</span>
                    {stage.estimatedMinutes ? (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" /> {stage.estimatedMinutes} {t.min}
                      </span>
                    ) : null}
                  </div>
                  <h3 className={cn("font-bold", locked ? "text-muted-foreground" : "text-foreground")}>{stage.title}</h3>
                  {stage.summary && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{stage.summary}</p>}
                </div>
                {locked && <span className="shrink-0 text-xs font-medium text-muted-foreground/60">{t.locked}</span>}
              </button>

              {isOpen && !locked && (
                <div className="px-5 pb-6 border-t border-border">
                  {stage.video && (
                    <div className="mt-5 rounded-xl overflow-hidden bg-black">
                      <video src={stage.video} controls className="w-full"><track kind="captions" /></video>
                    </div>
                  )}
                  {stage.content && (
                    <div className="mt-5 text-foreground/80 leading-relaxed whitespace-pre-line">{stage.content}</div>
                  )}
                  {stage.done ? (
                    <div className="mt-6 inline-flex items-center gap-2 text-emerald font-semibold">
                      <CheckCircle2 className="size-5" /> {t.completed}
                    </div>
                  ) : (
                    <Button onClick={() => complete(stage.order)} disabled={completing === stage.order} className="mt-6">
                      {completing === stage.order ? <Loader2 className="size-4 animate-spin" /> : <PlayCircle className="size-4" />}
                      {t.complete}
                    </Button>
                  )}
                </div>
              )}

              {!isOpen && locked && (
                <p className="px-5 pb-4 -mt-2 text-xs text-muted-foreground/60 pl-14">{t.lockedHint}</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
