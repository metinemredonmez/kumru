import Link from "next/link";
import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  ImageIcon,
  UploadCloud,
  Trash2,
  FileText,
  Video as VideoIcon,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import EmptyState from "@/components/yonetim/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/yonetim/format";

export const dynamic = "force-dynamic";

// ── Yetki doğrulama yardımcısı ───────────────────────────────────────────
async function assertAdmin() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }
  return payload;
}

// ── Dosya boyutu biçimlendirme ───────────────────────────────────────────
function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, i);
  return `${new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: i === 0 ? 0 : 1,
  }).format(value)} ${units[i]}`;
}

function isImage(mime: string | null | undefined): boolean {
  return typeof mime === "string" && mime.startsWith("image/");
}
function isVideo(mime: string | null | undefined): boolean {
  return typeof mime === "string" && mime.startsWith("video/");
}

// ── Görsel yükle (server action) ─────────────────────────────────────────
async function uploadMedia(formData: FormData) {
  "use server";

  const payload = await assertAdmin();

  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Dosya seçilmedi.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  await payload.create({
    collection: "media",
    locale: "tr",
    overrideAccess: true,
    file: {
      data: buffer,
      name: file.name,
      mimetype: file.type || "application/octet-stream",
      size: file.size,
    },
    data: { alt: alt || file.name },
  });

  revalidatePath("/yonetim/icerik/medya");
}

// ── Görsel sil (server action) ───────────────────────────────────────────
async function deleteMedia(formData: FormData) {
  "use server";

  const payload = await assertAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  await payload.delete({
    collection: "media",
    id,
    overrideAccess: true,
  });

  revalidatePath("/yonetim/icerik/medya");
}

export default async function MedyaPage() {
  const payload = await getPayload({ config });

  const { docs: items } = await payload.find({
    collection: "media",
    locale: "tr",
    limit: 200,
    sort: "-createdAt",
    depth: 0,
    overrideAccess: true,
  });

  return (
    <div>
      <PageHeader
        title="Medya Kütüphanesi"
        subtitle="Görselleri ve dosyaları yükleyin, yönetin. Tüm sayfa görselleri buradan seçilir."
        actions={
          <Link
            href="/yonetim/icerik"
            className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent"
          >
            <ArrowLeft className="size-4" />
            İçerik
          </Link>
        }
      />

      {/* ── Yükleme formu ─────────────────────────────────────────────── */}
      <form
        action={uploadMedia}
        className="mb-6 rounded-2xl border bg-card p-6 shadow-sm"
      >
        <div className="mb-5 flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <UploadCloud className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold">Yeni Görsel / Dosya Yükle</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Görsel (JPG, PNG, WebP), MP4/WebM video veya PDF yükleyebilirsiniz.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="media-file" className="text-sm">
              Dosya
            </Label>
            <Input
              id="media-file"
              name="file"
              type="file"
              required
              accept="image/*,video/mp4,video/webm,application/pdf"
              className="cursor-pointer file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="media-alt" className="text-sm">
              Açıklama (alt metin)
            </Label>
            <Input
              id="media-alt"
              name="alt"
              type="text"
              placeholder="Görselin kısa açıklaması"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit">
            <UploadCloud className="size-4" />
            Yükle
          </Button>
        </div>
      </form>

      {/* ── Medya ızgarası ────────────────────────────────────────────── */}
      {items.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Henüz medya yok"
          description="Yukarıdaki formdan ilk görselinizi veya dosyanızı yükleyin."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => {
            const url = m.url ?? undefined;
            const img = isImage(m.mimeType);
            const vid = isVideo(m.mimeType);
            return (
              <div
                key={m.id}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Önizleme */}
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  {img && url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={m.alt ?? m.filename ?? ""}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-muted-foreground">
                      {vid ? (
                        <VideoIcon className="size-8" />
                      ) : (
                        <FileText className="size-8" />
                      )}
                    </div>
                  )}

                  {url && (
                    <Link
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2 top-2 grid size-7 place-items-center rounded-lg bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity hover:bg-background group-hover:opacity-100"
                      title="Yeni sekmede aç"
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                  )}
                </div>

                {/* Bilgi */}
                <div className="flex flex-1 flex-col p-3">
                  <p
                    className="truncate text-xs font-medium text-foreground"
                    title={m.filename ?? ""}
                  >
                    {m.filename ?? "—"}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground tabular-nums">
                    <span>{formatBytes(m.filesize)}</span>
                    {m.width && m.height ? (
                      <>
                        <span className="text-border">•</span>
                        <span>
                          {m.width}×{m.height}
                        </span>
                      </>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {formatDate(m.createdAt)}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t pt-2">
                    <span className="truncate rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {m.mimeType ?? "dosya"}
                    </span>
                    <form action={deleteMedia}>
                      <input type="hidden" name="id" value={String(m.id)} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-rose transition-colors hover:bg-rose/10"
                        title="Sil"
                      >
                        <Trash2 className="size-3.5" />
                        Sil
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
