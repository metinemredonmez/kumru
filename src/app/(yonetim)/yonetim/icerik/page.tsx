import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  Sparkles,
  CalendarDays,
  BookOpen,
  Newspaper,
  Lightbulb,
  Video,
  MessageSquareQuote,
  ImageIcon,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import { formatNumber } from "@/lib/yonetim/format";

export const dynamic = "force-dynamic";

type HubCard = {
  title: string;
  description: string;
  collection: string;
  icon: LucideIcon;
};

const CARDS: HubCard[] = [
  {
    title: "Hizmetler",
    description: "Koçluk ve danışmanlık hizmetleri",
    collection: "coaching-services",
    icon: Sparkles,
  },
  {
    title: "Etkinlikler",
    description: "Atölye, seans ve buluşmalar",
    collection: "events",
    icon: CalendarDays,
  },
  {
    title: "Kaynaklar",
    description: "E-kitaplar ve indirilebilir içerikler",
    collection: "resource-items",
    icon: BookOpen,
  },
  {
    title: "Blog",
    description: "Blog yazıları",
    collection: "blog-posts",
    icon: Newspaper,
  },
  {
    title: "İpuçları",
    description: "Kısa öneriler ve ipuçları",
    collection: "tips",
    icon: Lightbulb,
  },
  {
    title: "Videolar",
    description: "Video içerikleri",
    collection: "videos",
    icon: Video,
  },
  {
    title: "Danışan Yorumları",
    description: "Referanslar ve geri bildirimler",
    collection: "testimonials",
    icon: MessageSquareQuote,
  },
  {
    title: "Medya",
    description: "Görsel ve dosya kütüphanesi",
    collection: "media",
    icon: ImageIcon,
  },
];

async function safeCount(payload: Awaited<ReturnType<typeof getPayload>>, slug: string) {
  try {
    const res = await payload.count({
      collection: slug as never,
      overrideAccess: true,
    });
    return res.totalDocs;
  } catch {
    return null;
  }
}

export default async function IcerikHubPage() {
  const payload = await getPayload({ config });

  const counts = await Promise.all(
    CARDS.map((c) => safeCount(payload, c.collection))
  );

  return (
    <div>
      <PageHeader
        title="İçerik & Medya"
        subtitle="Site içeriklerini buradan yönetin. Tam düzenleme yakında bu panele taşınacak."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          const count = counts[i];
          return (
            <div
              key={card.collection}
              className="flex flex-col rounded-2xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-[18px]" />
                </span>
                <span className="text-2xl font-bold tabular-nums text-foreground">
                  {count === null ? "—" : formatNumber(count)}
                </span>
              </div>

              <h2 className="mt-4 text-base font-semibold text-foreground">
                {card.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {card.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="rounded-full bg-amber/15 px-2.5 py-0.5 text-xs font-semibold text-amber">
                  Çok yakında tam düzenleme
                </span>
                <Link
                  href={`/admin/collections/${card.collection}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Payload
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
