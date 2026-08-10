import Link from "next/link";
import {
  LayoutTemplate,
  UserRound,
  Flower2,
  Newspaper,
  Images,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";

export const dynamic = "force-dynamic";

type PageCard = {
  title: string;
  description: string;
  global: string;
  icon: LucideIcon;
};

const CARDS: PageCard[] = [
  {
    title: "Hero",
    description: "Ana sayfa üst bölüm başlık ve görselleri",
    global: "hero",
    icon: LayoutTemplate,
  },
  {
    title: "Hakkımda",
    description: "Hakkımda sayfası metinleri",
    global: "about",
    icon: UserRound,
  },
  {
    title: "Nova Vera",
    description: "Nova Vera tanıtım içeriği",
    global: "nova-vera",
    icon: Flower2,
  },
  {
    title: "Medya Sayfası",
    description: "Medya sayfası metin ve düzeni",
    global: "media-content",
    icon: Newspaper,
  },
  {
    title: "Sayfa Görselleri",
    description: "Sayfalarda kullanılan görseller",
    global: "page-images",
    icon: Images,
  },
];

export default function SayfalarHubPage() {
  return (
    <div>
      <PageHeader
        title="Sayfa İçerikleri"
        subtitle="Sabit sayfaların metin ve görsellerini yönetin. Tam düzenleme yakında bu panele taşınacak."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.global}
              className="flex flex-col rounded-2xl border bg-card p-5 shadow-sm"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-[18px]" />
              </span>

              <h2 className="mt-4 text-base font-semibold text-foreground">
                {card.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {card.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="rounded-full bg-amber/15 px-2.5 py-0.5 text-xs font-semibold text-amber">
                  Çok yakında
                </span>
                <Link
                  href={`/admin/globals/${card.global}`}
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
