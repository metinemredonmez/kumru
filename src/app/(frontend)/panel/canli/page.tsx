"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, Radio, CalendarClock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageContext";

interface StreamCard {
  id: number;
  title: string;
  description?: string | null;
  scheduledAt?: string | null;
  status: "upcoming" | "live" | "ended";
  requiredTier: string;
  tierOk: boolean;
  youtubeId?: string;
}

const TIER_LABEL: Record<string, { tr: string; en: string }> = {
  free: { tr: "Ücretsiz", en: "Free" },
  premium: { tr: "Premium", en: "Premium" },
  vip: { tr: "VIP", en: "VIP" },
};

function formatDateTime(iso: string | null | undefined, lang: "tr" | "en") {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ aspectRatio: "16 / 9" }}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

function LockedBox({ label }: { label: string }) {
  const { language } = useLanguage();
  const lang = language === "en" ? "en" : "tr";
  return (
    <div
      className="relative flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center"
      style={{ aspectRatio: "16 / 9" }}
    >
      <div className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
        <Lock className="size-6" />
      </div>
      <p className="text-sm text-muted-foreground">
        {lang === "en"
          ? `This stream is available for ${label} members.`
          : `Bu yayın ${label} üyeler içindir.`}
      </p>
      <Button asChild size="sm">
        <Link href="/panel/uyelik">
          {lang === "en" ? "Go Premium" : "Premium'a Geç"}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}

export default function PanelLivePage() {
  const { language } = useLanguage();
  const lang = language === "en" ? "en" : "tr";
  const [streams, setStreams] = useState<StreamCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/my/live?lang=${lang}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { streams: [] }))
      .then((d) => setStreams(d?.streams || []))
      .catch(() => setStreams([]))
      .finally(() => setLoading(false));
  }, [lang]);

  const t = {
    title: lang === "en" ? "Live Streams" : "Canlı Yayınlar",
    sub: lang === "en" ? "Watch live sessions and past broadcasts." : "Canlı yayınları ve geçmiş kayıtları izle.",
    liveNow: lang === "en" ? "Live Now" : "Şimdi Canlı",
    upcoming: lang === "en" ? "Upcoming" : "Yaklaşan Yayınlar",
    past: lang === "en" ? "Past Streams" : "Geçmiş Yayınlar",
    live: lang === "en" ? "Live" : "Canlı",
    empty: lang === "en" ? "No live streams published yet." : "Henüz yayında canlı yayın yok.",
    locked: lang === "en" ? "Locked" : "Kilitli",
  };

  const liveStreams = streams.filter((s) => s.status === "live");
  const upcoming = streams.filter((s) => s.status === "upcoming");
  const past = streams.filter((s) => s.status === "ended");

  const tierLabel = (tier: string) => TIER_LABEL[tier]?.[lang] || tier;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground mt-1">{t.sub}</p>
      </div>

      {loading ? (
        <div className="text-muted-foreground py-16 text-center animate-pulse">…</div>
      ) : streams.length === 0 ? (
        <div className="text-muted-foreground py-16 text-center">{t.empty}</div>
      ) : (
        <>
          {/* Canlı yayınlar — vurgulu */}
          {liveStreams.length > 0 && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
                </span>
                <h2 className="text-lg font-semibold text-foreground">{t.liveNow}</h2>
              </div>
              <div className="grid gap-5 lg:grid-cols-2">
                {liveStreams.map((s) => (
                  <Card key={s.id} className="flex flex-col ring-2 ring-primary/40">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Badge className="border-transparent bg-red-500 text-white"><Radio className="size-3" /> {t.live}</Badge>
                        <Badge variant="soft">{tierLabel(s.requiredTier)}</Badge>
                        {!s.tierOk && (
                          <Badge variant="outline"><Lock className="size-3" /> {t.locked}</Badge>
                        )}
                      </div>
                      <CardTitle className="mt-2 text-lg">{s.title}</CardTitle>
                      {s.description && (
                        <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                      )}
                    </CardHeader>
                    <CardContent className="mt-auto">
                      {s.tierOk && s.youtubeId ? (
                        <YouTubeEmbed id={s.youtubeId} title={s.title} />
                      ) : (
                        <LockedBox label={tierLabel(s.requiredTier)} />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Yaklaşan yayınlar */}
          {upcoming.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-foreground">{t.upcoming}</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {upcoming.map((s) => (
                  <Card key={s.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Badge variant="soft">{tierLabel(s.requiredTier)}</Badge>
                        {!s.tierOk && (
                          <Badge variant="outline"><Lock className="size-3" /> {t.locked}</Badge>
                        )}
                      </div>
                      <CardTitle className="mt-2 text-lg">{s.title}</CardTitle>
                      {s.scheduledAt && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                          <CalendarClock className="size-4" />
                          {formatDateTime(s.scheduledAt, lang)}
                        </div>
                      )}
                      {s.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{s.description}</p>
                      )}
                    </CardHeader>
                    {!s.tierOk && (
                      <CardContent className="mt-auto">
                        <Button asChild variant="secondary" className="w-full">
                          <Link href="/panel/uyelik">
                            {lang === "en" ? "Go Premium" : "Premium'a Geç"}
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Geçmiş yayınlar */}
          {past.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-foreground">{t.past}</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {past.map((s) => (
                  <Card key={s.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Badge variant="soft">{tierLabel(s.requiredTier)}</Badge>
                        {!s.tierOk && (
                          <Badge variant="outline"><Lock className="size-3" /> {t.locked}</Badge>
                        )}
                      </div>
                      <CardTitle className="mt-2 text-lg">{s.title}</CardTitle>
                      {s.scheduledAt && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                          <CalendarClock className="size-4" />
                          {formatDateTime(s.scheduledAt, lang)}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="mt-auto">
                      {s.tierOk && s.youtubeId ? (
                        <YouTubeEmbed id={s.youtubeId} title={s.title} />
                      ) : (
                        <LockedBox label={tierLabel(s.requiredTier)} />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
