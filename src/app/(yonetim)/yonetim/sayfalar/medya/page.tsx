import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { MediaContent, Media } from "@/payload-types";
import {
  Newspaper,
  Save,
  Star,
  Quote as QuoteIcon,
  Award,
  Instagram,
  Megaphone,
  Info,
} from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const textareaClass =
  "min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";
const jsonClass =
  "min-h-40 w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

// ── Media alan yardımcıları ────────────────────────────────────────────────
function mediaId(v: (number | null) | Media | undefined): number | null {
  if (v == null) return null;
  return typeof v === "object" ? (v.id ?? null) : v;
}
function mediaUrl(v: (number | null) | Media | undefined): string | null {
  return v != null && typeof v === "object" ? (v.url ?? null) : null;
}

// ── Kaydet (server action) ─────────────────────────────────────────────────
async function saveMedia(formData: FormData) {
  "use server";

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }

  // JSON alanları hatalıysa mevcut değerlerle koru
  const current = (await payload.findGlobal({
    slug: "media-content",
    locale: "tr",
    overrideAccess: true,
  })) as MediaContent;

  const str = (key: string) => String(formData.get(key) ?? "").trim();
  const num = (key: string) => {
    const v = String(formData.get(key) ?? "").trim();
    if (v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const json = <T,>(key: string, fallback: T): T => {
    const raw = String(formData.get(key) ?? "").trim();
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback; // hatalı JSON → yoksay
    }
  };

  await payload.updateGlobal({
    slug: "media-content",
    locale: "tr",
    overrideAccess: true,
    data: {
      subtitle: str("subtitle"),
      title: str("title"),
      titleHighlight: str("titleHighlight"),
      description: str("description"),
      featuredTitle: str("featuredTitle"),
      mediaItems: {
        magazine: {
          image: num("magImage"),
          title: str("magTitle"),
          subtitle: str("magSubtitle"),
          date: str("magDate"),
          description: str("magDescription"),
        },
        award: {
          image: num("awImage"),
          title: str("awTitle"),
          subtitle: str("awSubtitle"),
          date: str("awDate"),
          description: str("awDescription"),
        },
      },
      quotesTitle: str("quotesTitle"),
      quotes: json("quotesJson", current.quotes ?? []),
      awardsTitle: str("awardsTitle"),
      awards: json("awardsJson", current.awards ?? []),
      instagramTitle: str("instagramTitle"),
      instagramDescription: str("instagramDescription"),
      followInstagram: str("followInstagram"),
      instagramPosts: json("instagramPostsJson", current.instagramPosts ?? []),
      ctaTitle: str("ctaTitle"),
      ctaDescription: str("ctaDescription"),
      ctaButton: str("ctaButton"),
    },
  });

  revalidatePath("/yonetim/sayfalar/medya");
}

// ── Küçük yardımcı bileşenler ──────────────────────────────────────────────
function Field({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}

function TextareaField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:col-span-2">
      <Label htmlFor={name}>{label}</Label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className={textareaClass}
      />
    </div>
  );
}

function ImageField({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: (number | null) | Media | undefined;
}) {
  const url = mediaUrl(value);
  const id = mediaId(value);
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label} (Media ID)</Label>
      <div className="flex items-center gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="size-14 shrink-0 rounded-lg border border-border object-cover"
          />
        ) : (
          <span className="grid size-14 shrink-0 place-items-center rounded-lg border border-dashed border-border text-muted-foreground">
            <Newspaper className="size-5" />
          </span>
        )}
        <Input
          id={name}
          name={name}
          type="number"
          defaultValue={id ?? ""}
          placeholder="Media ID"
          className="tabular-nums"
          autoComplete="off"
        />
      </div>
    </div>
  );
}

function JsonField({
  name,
  label,
  value,
  hint,
}: {
  name: string;
  label: string;
  value: unknown;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <textarea
        id={name}
        name={name}
        defaultValue={JSON.stringify(value ?? [], null, 2)}
        spellCheck={false}
        className={jsonClass}
      />
      <span className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
        <Info className="mt-0.5 size-3 shrink-0" />
        {hint}
      </span>
    </div>
  );
}

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

const cardClass =
  "rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6";

// ── Sayfa ──────────────────────────────────────────────────────────────────
export const dynamic = "force-dynamic";

export default async function MedyaPage() {
  const payload = await getPayload({ config });
  const data = (await payload.findGlobal({
    slug: "media-content",
    locale: "tr",
    overrideAccess: true,
  })) as MediaContent;

  // instagramPosts JSON'unu sade göster (görsel = Media ID)
  const instagramPostsValue = (data.instagramPosts ?? []).map((p) => ({
    image: mediaId(p.image),
    link: p.link ?? "",
  }));

  return (
    <>
      <PageHeader
        title="Medya Sayfası"
        subtitle="Medya sayfasının tüm metin, görsel ve liste içeriklerini düzenleyin."
      />

      <form action={saveMedia} className="mt-6 flex flex-col gap-6">
        <Tabs defaultValue="genel">
          <TabsList className="flex h-auto flex-wrap justify-start gap-1">
            <TabsTrigger value="genel">
              <Newspaper className="size-4" /> Genel
            </TabsTrigger>
            <TabsTrigger value="oneCikan">
              <Star className="size-4" /> Öne Çıkan Medya
            </TabsTrigger>
            <TabsTrigger value="alintilar">
              <QuoteIcon className="size-4" /> Alıntılar & Ödüller
            </TabsTrigger>
            <TabsTrigger value="instagram">
              <Instagram className="size-4" /> Instagram
            </TabsTrigger>
            <TabsTrigger value="cta">
              <Megaphone className="size-4" /> CTA
            </TabsTrigger>
          </TabsList>

          {/* ── Genel ── */}
          <TabsContent value="genel" forceMount className="data-[state=inactive]:hidden">
            <section className={cardClass}>
              <SectionHeading
                icon={Newspaper}
                title="Başlık Alanı"
                description="Medya sayfasının üst bölümünün metinleri."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field name="subtitle" label="Üst Başlık" defaultValue={data.subtitle} />
                <Field name="title" label="Başlık" defaultValue={data.title} />
                <Field
                  name="titleHighlight"
                  label="Başlık Vurgu"
                  defaultValue={data.titleHighlight}
                />
                <Field
                  name="featuredTitle"
                  label="Öne Çıkan Başlık"
                  defaultValue={data.featuredTitle}
                />
                <TextareaField
                  name="description"
                  label="Açıklama"
                  defaultValue={data.description}
                />
              </div>
            </section>
          </TabsContent>

          {/* ── Öne Çıkan Medya ── */}
          <TabsContent
            value="oneCikan"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <div className="flex flex-col gap-6">
              <section className={cardClass}>
                <SectionHeading
                  icon={Newspaper}
                  title="Dergi"
                  description="Öne çıkan dergi kartı."
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ImageField
                    name="magImage"
                    label="Görsel"
                    value={data.mediaItems?.magazine?.image}
                  />
                  <Field
                    name="magTitle"
                    label="Başlık"
                    defaultValue={data.mediaItems?.magazine?.title}
                  />
                  <Field
                    name="magSubtitle"
                    label="Alt Başlık"
                    defaultValue={data.mediaItems?.magazine?.subtitle}
                  />
                  <Field
                    name="magDate"
                    label="Tarih"
                    defaultValue={data.mediaItems?.magazine?.date}
                  />
                  <TextareaField
                    name="magDescription"
                    label="Açıklama"
                    defaultValue={data.mediaItems?.magazine?.description}
                  />
                </div>
              </section>

              <section className={cardClass}>
                <SectionHeading
                  icon={Award}
                  title="Ödül"
                  description="Öne çıkan ödül kartı."
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ImageField
                    name="awImage"
                    label="Görsel"
                    value={data.mediaItems?.award?.image}
                  />
                  <Field
                    name="awTitle"
                    label="Başlık"
                    defaultValue={data.mediaItems?.award?.title}
                  />
                  <Field
                    name="awSubtitle"
                    label="Alt Başlık"
                    defaultValue={data.mediaItems?.award?.subtitle}
                  />
                  <Field
                    name="awDate"
                    label="Tarih"
                    defaultValue={data.mediaItems?.award?.date}
                  />
                  <TextareaField
                    name="awDescription"
                    label="Açıklama"
                    defaultValue={data.mediaItems?.award?.description}
                  />
                </div>
              </section>
            </div>
          </TabsContent>

          {/* ── Alıntılar & Ödüller ── */}
          <TabsContent
            value="alintilar"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <div className="flex flex-col gap-6">
              <section className={cardClass}>
                <SectionHeading
                  icon={QuoteIcon}
                  title="Basından Alıntılar"
                  description="Alıntı listesini JSON olarak düzenleyin."
                />
                <div className="grid grid-cols-1 gap-4">
                  <Field
                    name="quotesTitle"
                    label="Alıntılar Başlığı"
                    defaultValue={data.quotesTitle}
                  />
                  <JsonField
                    name="quotesJson"
                    label="Alıntılar"
                    value={data.quotes}
                    hint={`Dizi biçimi: [{ "quote": "...", "source": "..." }]`}
                  />
                </div>
              </section>

              <section className={cardClass}>
                <SectionHeading
                  icon={Award}
                  title="Ödüller & Başarılar"
                  description="Ödül listesini JSON olarak düzenleyin."
                />
                <div className="grid grid-cols-1 gap-4">
                  <Field
                    name="awardsTitle"
                    label="Ödüller Başlığı"
                    defaultValue={data.awardsTitle}
                  />
                  <JsonField
                    name="awardsJson"
                    label="Ödüller"
                    value={data.awards}
                    hint={`Dizi biçimi: [{ "title": "...", "organization": "...", "year": "..." }]`}
                  />
                </div>
              </section>
            </div>
          </TabsContent>

          {/* ── Instagram ── */}
          <TabsContent
            value="instagram"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <section className={cardClass}>
              <SectionHeading
                icon={Instagram}
                title="Instagram"
                description="Instagram bölümü metinleri ve gönderi listesi."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  name="instagramTitle"
                  label="Instagram Başlığı"
                  defaultValue={data.instagramTitle}
                />
                <Field
                  name="followInstagram"
                  label="Instagram Takip Buton"
                  defaultValue={data.followInstagram}
                />
                <TextareaField
                  name="instagramDescription"
                  label="Instagram Açıklaması"
                  defaultValue={data.instagramDescription}
                />
                <div className="sm:col-span-2">
                  <JsonField
                    name="instagramPostsJson"
                    label="Instagram Gönderileri"
                    value={instagramPostsValue}
                    hint={`Dizi biçimi: [{ "image": <Media ID>, "link": "https://..." }]`}
                  />
                </div>
              </div>
            </section>
          </TabsContent>

          {/* ── CTA ── */}
          <TabsContent value="cta" forceMount className="data-[state=inactive]:hidden">
            <section className={cardClass}>
              <SectionHeading
                icon={Megaphone}
                title="Çağrı (CTA)"
                description="Sayfa altındaki çağrı bölümü."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field name="ctaTitle" label="CTA Başlık" defaultValue={data.ctaTitle} />
                <Field
                  name="ctaButton"
                  label="CTA Buton"
                  defaultValue={data.ctaButton}
                />
                <TextareaField
                  name="ctaDescription"
                  label="CTA Açıklama"
                  defaultValue={data.ctaDescription}
                />
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Kaydet çubuğu */}
        <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/95 p-4 shadow-sm backdrop-blur">
          <p className="text-xs text-muted-foreground">
            Değişiklikler tüm sekmelerde birlikte kaydedilir.
          </p>
          <Button type="submit">
            <Save className="size-4" /> Kaydet
          </Button>
        </div>
      </form>
    </>
  );
}
