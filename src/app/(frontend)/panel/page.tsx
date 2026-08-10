"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, CheckCircle2, Sparkles, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/i18n/LanguageContext";
import { useMember } from "@/i18n/MemberContext";

interface CourseCard {
  title: string;
  slug: string;
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

export default function PanelHome() {
  const { language } = useLanguage();
  const { member } = useMember();
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

  const tier = member?.membershipTier || "free";
  const accessible = courses.filter((c) => c.tierOk);
  const totalStages = accessible.reduce((s, c) => s + c.totalStages, 0);
  const doneStages = accessible.reduce((s, c) => s + c.completedCount, 0);
  const overall = totalStages > 0 ? Math.round((doneStages / totalStages) * 100) : 0;
  const inProgress = accessible.find((c) => c.completedCount > 0 && c.completedCount < c.totalStages)
    || accessible.find((c) => c.completedCount === 0);

  const t = {
    hi: lang === "en" ? "Hello" : "Merhaba",
    sub: lang === "en" ? "Welcome to your transformation space." : "Dönüşüm alanına hoş geldin.",
    membership: lang === "en" ? "Membership" : "Üyelik",
    overallProgress: lang === "en" ? "Overall progress" : "Genel ilerleme",
    activePrograms: lang === "en" ? "Active programs" : "Aktif program",
    completedStages: lang === "en" ? "Completed stages" : "Tamamlanan aşama",
    continue: lang === "en" ? "Continue" : "Devam et",
    start: lang === "en" ? "Start" : "Başla",
    keepGoing: lang === "en" ? "Pick up where you left off" : "Kaldığın yerden devam et",
    myPrograms: lang === "en" ? "My programs" : "Programlarım",
    seeAll: lang === "en" ? "See all" : "Tümünü gör",
    upgrade: lang === "en" ? "Upgrade" : "Yükselt",
    upgradeDesc: lang === "en"
      ? "Unlock all progressive programs with Premium."
      : "Premium ile tüm ilerlemeli programların kilidini aç.",
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          {t.hi}, {member?.name?.split(" ")[0] || ""} 👋
        </h1>
        <p className="text-muted-foreground mt-1">{t.sub}</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Sparkles className="size-4" /> {t.membership}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{TIER_LABEL[tier]?.[lang] || tier}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <GraduationCap className="size-4" /> {t.activePrograms}
            </div>
            <div className="text-2xl font-bold text-foreground tabular-nums">{accessible.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <CheckCircle2 className="size-4" /> {t.completedStages}
            </div>
            <div className="text-2xl font-bold text-foreground tabular-nums">{doneStages}/{totalStages}</div>
            <Progress value={overall} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Upgrade banner (free members) */}
      {tier === "free" && (
        <Card className="border-primary/30 bg-accent/40">
          <CardContent className="p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center size-10 rounded-lg bg-primary/10 text-primary"><Lock className="size-5" /></span>
              <div>
                <div className="font-semibold text-foreground">{t.upgrade}</div>
                <div className="text-sm text-muted-foreground">{t.upgradeDesc}</div>
              </div>
            </div>
            <Button asChild><Link href="/panel/uyelik">{t.upgrade} <ArrowRight className="size-4" /></Link></Button>
          </CardContent>
        </Card>
      )}

      {/* Continue / in progress */}
      {!loading && inProgress && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t.keepGoing}</h2>
          <Card>
            <CardContent className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="font-semibold text-foreground text-lg">{inProgress.title}</div>
                <div className="flex items-center gap-3 mt-2">
                  <Progress
                    value={inProgress.totalStages ? Math.round((inProgress.completedCount / inProgress.totalStages) * 100) : 0}
                    className="max-w-xs"
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {inProgress.completedCount}/{inProgress.totalStages}
                  </span>
                </div>
              </div>
              <Button asChild>
                <Link href={`/panel/programlarim/${inProgress.slug}`}>
                  {inProgress.completedCount > 0 ? t.continue : t.start} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Programs quick list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t.myPrograms}</h2>
          <Link href="/panel/programlarim" className="text-sm font-medium text-primary hover:underline">{t.seeAll}</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((c) => {
            const pct = c.totalStages ? Math.round((c.completedCount / c.totalStages) * 100) : 0;
            return (
              <Card key={c.slug}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="soft">{TIER_LABEL[c.requiredTier]?.[lang] || c.requiredTier}</Badge>
                    {!c.tierOk && <Badge variant="outline"><Lock className="size-3" /> {lang === "en" ? "Locked" : "Kilitli"}</Badge>}
                  </div>
                  <CardTitle className="mt-2">{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {c.tierOk && <Progress value={pct} className="mb-3" />}
                  <Button asChild variant={c.tierOk ? "default" : "secondary"} size="sm" className="w-full">
                    <Link href={c.tierOk ? `/panel/programlarim/${c.slug}` : "/panel/uyelik"}>
                      {c.tierOk ? (c.started ? t.continue : t.start) : t.upgrade}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
