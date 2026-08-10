import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Hero } from "@/payload-types";
import { LayoutTemplate, Type, MousePointerClick, BarChart3, Save } from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

const textareaClass =
  "min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

// ── Kaydet (server action) ─────────────────────────────────────────────────
async function saveHero(formData: FormData) {
  "use server";

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }

  const str = (key: string) => String(formData.get(key) ?? "").trim();

  await payload.updateGlobal({
    slug: "hero",
    locale: "tr",
    overrideAccess: true,
    data: {
      badge: str("badge"),
      title1: str("title1"),
      title2: str("title2"),
      title3: str("title3"),
      description: str("description"),
      cta1: str("cta1"),
      cta2: str("cta2"),
      googleReview: str("googleReview"),
      stats: {
        clients: str("stats.clients"),
        experience: str("stats.experience"),
        satisfaction: str("stats.satisfaction"),
      },
    },
  });

  revalidatePath("/yonetim/sayfalar/hero");
}

// ── Bölüm başlığı yardımcı bileşeni ────────────────────────────────────────
function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

// ── Sayfa ──────────────────────────────────────────────────────────────────
export default async function HeroEditorPage() {
  const payload = await getPayload({ config });
  const data = (await payload.findGlobal({
    slug: "hero",
    locale: "tr",
    overrideAccess: true,
  })) as Hero;

  return (
    <>
      <PageHeader
        title="Hero"
        subtitle="Ana sayfa üst bölümünün başlık, açıklama, butonlar ve istatistik metinlerini düzenleyin."
      />

      <form action={saveHero} className="mt-6 flex flex-col gap-6">
        {/* Başlık & Metinler */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <SectionHeading
            icon={Type}
            title="Başlık & Metinler"
            description="Rozet, üç satırlık başlık ve giriş açıklaması."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="badge">Üst Rozet</Label>
              <Input
                id="badge"
                name="badge"
                defaultValue={data.badge ?? ""}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title1">Başlık 1. Satır</Label>
              <Input
                id="title1"
                name="title1"
                defaultValue={data.title1 ?? ""}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title2">Başlık 2. Satır</Label>
              <Input
                id="title2"
                name="title2"
                defaultValue={data.title2 ?? ""}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="title3">Başlık 3. Satır</Label>
              <Input
                id="title3"
                name="title3"
                defaultValue={data.title3 ?? ""}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="description">Açıklama</Label>
              <textarea
                id="description"
                name="description"
                className={textareaClass}
                defaultValue={data.description ?? ""}
              />
            </div>
          </div>
        </section>

        {/* Butonlar & Sosyal Kanıt */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <SectionHeading
            icon={MousePointerClick}
            title="Butonlar & Sosyal Kanıt"
            description="Çağrı butonları ve Google yorum metni."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cta1">Birincil Buton</Label>
              <Input
                id="cta1"
                name="cta1"
                defaultValue={data.cta1 ?? ""}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cta2">İkincil Buton</Label>
              <Input
                id="cta2"
                name="cta2"
                defaultValue={data.cta2 ?? ""}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="googleReview">Google Yorum Metni</Label>
              <Input
                id="googleReview"
                name="googleReview"
                defaultValue={data.googleReview ?? ""}
                autoComplete="off"
              />
            </div>
          </div>
        </section>

        {/* İstatistikler */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <SectionHeading
            icon={BarChart3}
            title="İstatistikler"
            description="Hero altındaki üç istatistik etiketi."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stats.clients">Mutlu Danışan (etiket)</Label>
              <Input
                id="stats.clients"
                name="stats.clients"
                defaultValue={data.stats?.clients ?? ""}
                autoComplete="off"
                className="tabular-nums"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stats.experience">Yıl Deneyim (etiket)</Label>
              <Input
                id="stats.experience"
                name="stats.experience"
                defaultValue={data.stats?.experience ?? ""}
                autoComplete="off"
                className="tabular-nums"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stats.satisfaction">Memnuniyet (etiket)</Label>
              <Input
                id="stats.satisfaction"
                name="stats.satisfaction"
                defaultValue={data.stats?.satisfaction ?? ""}
                autoComplete="off"
                className="tabular-nums"
              />
            </div>
          </div>
        </section>

        {/* Kaydet çubuğu */}
        <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/95 p-4 shadow-sm backdrop-blur">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <LayoutTemplate className="size-4 text-primary" />
            Değişiklikler ana sayfa hero bölümüne yansır.
          </p>
          <Button type="submit">
            <Save className="size-4" /> Kaydet
          </Button>
        </div>
      </form>
    </>
  );
}
