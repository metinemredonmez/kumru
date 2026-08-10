import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import { Images, ImageOff, ExternalLink, Save } from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

// ── page-images global alanları (src/payload.config.ts ile birebir) ──────
const FIELDS: { name: string; label: string }[] = [
  { name: "servicesBg", label: "Hizmetler Arka Plan" },
  { name: "mediaBg", label: "Medya Arka Plan" },
  { name: "programsBg", label: "Programlar Arka Plan" },
  { name: "resourcesBg", label: "Kaynaklar Arka Plan" },
  { name: "contactBg", label: "İletişim Arka Plan" },
  { name: "novaVeraBg", label: "Nova Vera Arka Plan" },
];

// ── Yetki doğrulama yardımcısı ───────────────────────────────────────────
async function assertAdmin() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }
  return payload;
}

// ── Sayfa görsellerini kaydet (server action) ────────────────────────────
async function savePageImages(formData: FormData) {
  "use server";

  const payload = await assertAdmin();

  const data: Record<string, number | null> = {};
  for (const f of FIELDS) {
    const raw = String(formData.get(f.name) ?? "").trim();
    if (raw === "") {
      data[f.name] = null;
    } else {
      const id = Number(raw);
      if (Number.isFinite(id) && id > 0) {
        data[f.name] = id;
      }
    }
  }

  await payload.updateGlobal({
    slug: "page-images",
    locale: "tr",
    overrideAccess: true,
    data,
  });

  revalidatePath("/yonetim/sayfalar/gorseller");
}

type MediaDoc = {
  id: number;
  url?: string | null;
  alt?: string | null;
  filename?: string | null;
  mimeType?: string | null;
};

export default async function GorsellerPage() {
  const payload = await getPayload({ config });

  // depth 0 → upload alanları medya ID (number) döner
  const images = (await payload.findGlobal({
    slug: "page-images",
    locale: "tr",
    depth: 0,
  })) as unknown as Record<string, number | null | undefined>;

  // Mevcut ID'leri topla, tek seferde medya kayıtlarını çek
  const idByField = new Map<string, number | null>();
  const ids = new Set<number>();
  for (const f of FIELDS) {
    const v = images[f.name];
    const id = typeof v === "number" ? v : null;
    idByField.set(f.name, id);
    if (id) ids.add(id);
  }

  const mediaById = new Map<number, MediaDoc>();
  await Promise.all(
    [...ids].map(async (id) => {
      const doc = (await payload
        .findByID({ collection: "media", id, depth: 0, locale: "tr" })
        .catch(() => null)) as MediaDoc | null;
      if (doc) mediaById.set(id, doc);
    }),
  );

  return (
    <div>
      <PageHeader
        title="Sayfa Görselleri"
        subtitle="Sayfaların üst bölümünde kullanılan arka plan görsellerini yönetin. Değiştirmek için Medya Kütüphanesi'ndeki görselin ID'sini girin."
      />

      <form
        action={savePageImages}
        className="rounded-2xl border bg-card p-6 shadow-sm"
      >
        <div className="mb-5 flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Images className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold">Arka Plan Görselleri</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Her alan için mevcut görsel aşağıda önizlenir. Değiştirmek için
              yeni Medya ID girin; boş bırakırsanız görsel kaldırılır.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {FIELDS.map((f) => {
            const id = idByField.get(f.name) ?? null;
            const media = id ? mediaById.get(id) : undefined;
            const url = media?.url ?? undefined;

            return (
              <div
                key={f.name}
                className="flex gap-4 rounded-xl border border-border bg-background/50 p-4"
              >
                {/* Önizleme */}
                <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border bg-muted">
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={media?.alt ?? media?.filename ?? f.label}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-muted-foreground">
                      <ImageOff className="size-6" />
                    </div>
                  )}
                </div>

                {/* Bilgi + ID input */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <Label
                    htmlFor={`img-${f.name}`}
                    className="text-sm font-semibold"
                  >
                    {f.label}
                  </Label>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {media
                      ? media.filename ?? `Medya #${id}`
                      : "Görsel atanmadı"}
                    {url && (
                      <>
                        {" · "}
                        <Link
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-primary hover:underline"
                        >
                          Aç
                          <ExternalLink className="size-3" />
                        </Link>
                      </>
                    )}
                  </p>

                  <div className="mt-auto space-y-1 pt-3">
                    <Label
                      htmlFor={`img-${f.name}`}
                      className="text-xs text-muted-foreground"
                    >
                      Medya ID
                    </Label>
                    <Input
                      id={`img-${f.name}`}
                      name={f.name}
                      type="number"
                      min={1}
                      step={1}
                      defaultValue={id ?? ""}
                      placeholder="Örn. 12"
                      className="tabular-nums"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <Link
            href="/yonetim/icerik/medya"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Medya Kütüphanesi&apos;ni aç
          </Link>
          <Button type="submit">
            <Save className="size-4" />
            Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
