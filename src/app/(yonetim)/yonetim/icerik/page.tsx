import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  Sparkles,
  CalendarDays,
  BookOpen,
  MessageSquareQuote,
  ImageIcon,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import { formatNumber } from "@/lib/yonetim/format";

export const dynamic = "force-dynamic";

type HubCard = {
  title: string;
  description: string;
  href: string;
  collections: string[];
  icon: LucideIcon;
};

const CARDS: HubCard[] = [
  {
    title: "Hizmetler",
    description: "Koçluk hizmetleri, programlar ve spiritüel seanslar",
    href: "/yonetim/icerik/hizmetler",
    collections: ["coaching-services", "programs", "spiritual-sessions"],
    icon: Sparkles,
  },
  {
    title: "Etkinlikler & SSS",
    description: "Atölye ve buluşmalar ile sık sorulan sorular",
    href: "/yonetim/icerik/etkinlikler",
    collections: ["events", "faqs"],
    icon: CalendarDays,
  },
  {
    title: "Kaynaklar, Blog & İpuçları",
    description: "E-kitaplar, blog yazıları ve günlük ipuçları",
    href: "/yonetim/icerik/kaynaklar",
    collections: ["resource-items", "blog-posts", "tips"],
    icon: BookOpen,
  },
  {
    title: "Yorumlar & Videolar",
    description: "Danışan yorumları ve video içerikleri",
    href: "/yonetim/icerik/yorumlar",
    collections: ["testimonials", "videos"],
    icon: MessageSquareQuote,
  },
  {
    title: "Medya",
    description: "Görsel ve dosya kütüphanesi",
    href: "/yonetim/icerik/medya",
    collections: ["media"],
    icon: ImageIcon,
  },
];

async function safeCount(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string
) {
  try {
    const res = await payload.count({
      collection: slug as never,
      overrideAccess: true,
    });
    return res.totalDocs;
  } catch {
    return 0;
  }
}

async function totalCount(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slugs: string[]
) {
  const counts = await Promise.all(slugs.map((s) => safeCount(payload, s)));
  return counts.reduce((sum, n) => sum + n, 0);
}

export default async function IcerikHubPage() {
  const payload = await getPayload({ config });

  const counts = await Promise.all(
    CARDS.map((c) => totalCount(payload, c.collections))
  );

  return (
    <div>
      <PageHeader
        title="İçerik & Medya"
        subtitle="Site içeriklerini bu panelden düzenleyin."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          const count = counts[i];
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col rounded-2xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-[18px]" />
                </span>
                <span className="text-2xl font-bold tabular-nums text-foreground">
                  {formatNumber(count)}
                </span>
              </div>

              <h2 className="mt-4 text-base font-semibold text-foreground">
                {card.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {card.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {formatNumber(count)} kayıt
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Düzenle
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
