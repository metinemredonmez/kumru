"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/i18n/LanguageContext";

interface CourseCard {
  title: string;
  slug: string;
  description?: string;
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

export default function PanelProgramsPage() {
  const { language } = useLanguage();
  const lang = language === "en" ? "en" : "tr";
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/my/courses?lang=${lang}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { courses: [] }))
      .then((d) => setCourses(d?.courses || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [lang]);

  const t = {
    title: lang === "en" ? "My Programs" : "Programlarım",
    sub: lang === "en" ? "Move through each program at your own pace." : "Her programı kendi hızında, sırayla ilerle.",
    continue: lang === "en" ? "Continue" : "Devam Et",
    start: lang === "en" ? "Start" : "Başla",
    upgrade: lang === "en" ? "Upgrade" : "Yükselt",
    completed: lang === "en" ? "Completed" : "Tamamlandı",
    stages: lang === "en" ? "stages" : "aşama",
    empty: lang === "en" ? "No programs published yet." : "Henüz yayında program yok.",
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground mt-1">{t.sub}</p>
      </div>

      {loading ? (
        <div className="text-muted-foreground py-16 text-center animate-pulse">…</div>
      ) : courses.length === 0 ? (
        <div className="text-muted-foreground py-16 text-center">{t.empty}</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {courses.map((c) => {
            const pct = c.totalStages ? Math.round((c.completedCount / c.totalStages) * 100) : 0;
            const done = c.totalStages > 0 && c.completedCount >= c.totalStages;
            return (
              <Card key={c.slug} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="soft">{TIER_LABEL[c.requiredTier]?.[lang] || c.requiredTier}</Badge>
                    {!c.tierOk && <Badge variant="outline"><Lock className="size-3" /> {lang === "en" ? "Locked" : "Kilitli"}</Badge>}
                    {done && <Badge variant="success"><CheckCircle2 className="size-3" /> {t.completed}</Badge>}
                  </div>
                  <CardTitle className="mt-2 text-lg">{c.title}</CardTitle>
                  {c.description && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{c.description}</p>}
                </CardHeader>
                <CardContent className="mt-auto">
                  {c.tierOk && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>{c.completedCount}/{c.totalStages} {t.stages}</span>
                        <span>{pct}%</span>
                      </div>
                      <Progress value={pct} />
                    </div>
                  )}
                  <Button asChild variant={c.tierOk ? "default" : "secondary"} className="w-full">
                    <Link href={c.tierOk ? `/panel/programlarim/${c.slug}` : "/panel/uyelik"}>
                      {c.tierOk ? (c.started ? t.continue : t.start) : t.upgrade}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
