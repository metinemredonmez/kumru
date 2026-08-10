import Link from "next/link";
import {
  LayoutTemplate,
  UserRound,
  Flower2,
  Newspaper,
  Images,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";

export const dynamic = "force-dynamic";

type PageCard = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const CARDS: PageCard[] = [
  {
    title: "Hero",
    description: "Ana sayfa üst bölüm başlık ve görselleri",
    href: "/yonetim/sayfalar/hero",
    icon: LayoutTemplate,
  },
  {
    title: "Hakkımda",
    description: "Hakkımda sayfası metinleri",
    href: "/yonetim/sayfalar/hakkimda",
    icon: UserRound,
  },
  {
    title: "Nova Vera",
    description: "Nova Vera tanıtım içeriği",
    href: "/yonetim/sayfalar/nova-vera",
    icon: Flower2,
  },
  {
    title: "Medya Sayfası",
    description: "Medya sayfası metin ve düzeni",
    href: "/yonetim/sayfalar/medya",
    icon: Newspaper,
  },
  {
    title: "Sayfa Görselleri",
    description: "Sayfalarda kullanılan görseller",
    href: "/yonetim/sayfalar/gorseller",
    icon: Images,
  },
];

export default function SayfalarHubPage() {
  return (
    <div>
      <PageHeader
        title="Sayfa İçerikleri"
        subtitle="Sabit sayfaların metin ve görsellerini buradan düzenleyin."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col rounded-2xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/40"
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

              <div className="mt-4 flex items-center justify-end border-t pt-3">
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
