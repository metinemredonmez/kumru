import Link from "next/link";
import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Testimonial, Video } from "@/payload-types";
import {
  MessageSquareQuote,
  Video as VideoIcon,
  Star,
  Youtube,
  FileVideo,
  Eye,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import StatCard from "@/components/yonetim/StatCard";
import EmptyState from "@/components/yonetim/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const BASE = "/yonetim/icerik/yorumlar";

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";
const areaClass =
  "min-h-[96px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

// ── Yetki kontrolü ──────────────────────────────────────────────────────────
async function requireAdmin() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }
  return payload;
}

function num(v: FormDataEntryValue | null, fallback = 0): number {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

function mediaId(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

// ── Danışan Yorumu: oluştur / güncelle / sil ────────────────────────────────
async function createTestimonial(formData: FormData) {
  "use server";
  const payload = await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const text = String(formData.get("text") || "").trim();
  if (!name || !text) return;

  await payload.create({
    collection: "testimonials",
    locale: "tr",
    data: {
      name,
      text,
      rating: num(formData.get("rating"), 5),
      order: num(formData.get("order"), 0),
    },
    overrideAccess: true,
  });

  revalidatePath(BASE);
}

async function updateTestimonial(formData: FormData) {
  "use server";
  const payload = await requireAdmin();

  const id = num(formData.get("id"), 0);
  const name = String(formData.get("name") || "").trim();
  const text = String(formData.get("text") || "").trim();
  if (!id || !name || !text) return;

  await payload.update({
    collection: "testimonials",
    id,
    locale: "tr",
    data: {
      name,
      text,
      rating: num(formData.get("rating"), 5),
      order: num(formData.get("order"), 0),
    },
    overrideAccess: true,
  });

  revalidatePath(BASE);
}

async function deleteTestimonial(formData: FormData) {
  "use server";
  const payload = await requireAdmin();
  const id = num(formData.get("id"), 0);
  if (!id) return;
  await payload.delete({ collection: "testimonials", id, overrideAccess: true });
  revalidatePath(BASE);
}

// ── Video: oluştur / güncelle / sil ─────────────────────────────────────────
async function createVideo(formData: FormData) {
  "use server";
  const payload = await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const source =
    String(formData.get("source") || "youtube") === "upload"
      ? "upload"
      : "youtube";

  await payload.create({
    collection: "videos",
    locale: "tr",
    data: {
      title,
      description: String(formData.get("description") || "").trim() || null,
      source,
      youtubeUrl: String(formData.get("youtubeUrl") || "").trim() || null,
      videoFile: mediaId(formData.get("videoFile")),
      thumbnail: mediaId(formData.get("thumbnail")),
      published: formData.get("published") === "on",
      order: num(formData.get("order"), 0),
    },
    overrideAccess: true,
  });

  revalidatePath(BASE);
}

async function updateVideo(formData: FormData) {
  "use server";
  const payload = await requireAdmin();

  const id = num(formData.get("id"), 0);
  const title = String(formData.get("title") || "").trim();
  if (!id || !title) return;

  const source =
    String(formData.get("source") || "youtube") === "upload"
      ? "upload"
      : "youtube";

  await payload.update({
    collection: "videos",
    id,
    locale: "tr",
    data: {
      title,
      description: String(formData.get("description") || "").trim() || null,
      source,
      youtubeUrl: String(formData.get("youtubeUrl") || "").trim() || null,
      videoFile: mediaId(formData.get("videoFile")),
      thumbnail: mediaId(formData.get("thumbnail")),
      published: formData.get("published") === "on",
      order: num(formData.get("order"), 0),
    },
    overrideAccess: true,
  });

  revalidatePath(BASE);
}

async function deleteVideo(formData: FormData) {
  "use server";
  const payload = await requireAdmin();
  const id = num(formData.get("id"), 0);
  if (!id) return;
  await payload.delete({ collection: "videos", id, overrideAccess: true });
  revalidatePath(BASE);
}

// ── Yardımcı: yıldız gösterimi ──────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, rating));
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < r
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </span>
  );
}

// ── Sayfa ──────────────────────────────────────────────────────────────────
type SearchParams = { tab?: string; edit?: string };

export default async function YorumlarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const tab = params.tab === "videolar" ? "videolar" : "yorumlar";
  const editId = params.edit ? Number.parseInt(params.edit, 10) : null;

  const payload = await getPayload({ config });

  const [testimonialList, videoList, testimonialCount, videoCount, videoPublished] =
    await Promise.all([
      payload.find({
        collection: "testimonials",
        depth: 0,
        limit: 200,
        sort: "order",
        locale: "tr",
      }),
      payload.find({
        collection: "videos",
        depth: 0,
        limit: 200,
        sort: "order",
        locale: "tr",
      }),
      payload.count({ collection: "testimonials" }),
      payload.count({ collection: "videos" }),
      payload.count({
        collection: "videos",
        where: { published: { equals: true } },
      }),
    ]);

  const testimonials = testimonialList.docs as Testimonial[];
  const videos = videoList.docs as Video[];

  // Düzenlenecek kayıtları çöz (yalnızca aktif sekmede)
  const editingTestimonial =
    tab === "yorumlar" && editId
      ? testimonials.find((t) => t.id === editId) ?? null
      : null;
  const editingVideo =
    tab === "videolar" && editId
      ? videos.find((v) => v.id === editId) ?? null
      : null;

  return (
    <>
      <PageHeader
        title="Yorumlar & Videolar"
        subtitle="Danışan yorumlarını ve video içeriklerini yönet."
      />

      {/* KPI'lar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Danışan Yorumu"
          value={testimonialCount.totalDocs}
          icon={MessageSquareQuote}
        />
        <StatCard label="Video" value={videoCount.totalDocs} icon={VideoIcon} />
        <StatCard
          label="Yayındaki Video"
          value={videoPublished.totalDocs}
          icon={Eye}
          tone="good"
        />
      </div>

      {/* Sekmeler */}
      <div className="mt-6 inline-flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1">
        <Link
          href={`${BASE}?tab=yorumlar`}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            tab === "yorumlar"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Danışan Yorumları
        </Link>
        <Link
          href={`${BASE}?tab=videolar`}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            tab === "videolar"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Videolar
        </Link>
      </div>

      {/* ── Danışan Yorumları ── */}
      {tab === "yorumlar" && (
        <>
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  {editingTestimonial ? (
                    <Pencil className="size-4" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                </span>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {editingTestimonial ? "Yorumu Düzenle" : "Yeni Yorum"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {editingTestimonial
                      ? `#${editingTestimonial.id} numaralı kayıt düzenleniyor.`
                      : "Danışanlarınızın deneyimlerini ekleyin."}
                  </p>
                </div>
              </div>
              {editingTestimonial && (
                <Button asChild variant="ghost" size="sm">
                  <Link href={`${BASE}?tab=yorumlar`}>
                    <X className="size-4" /> İptal
                  </Link>
                </Button>
              )}
            </div>

            <form
              action={
                editingTestimonial ? updateTestimonial : createTestimonial
              }
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6"
            >
              {editingTestimonial && (
                <input type="hidden" name="id" value={editingTestimonial.id} />
              )}

              <div className="flex flex-col gap-1.5 sm:col-span-2 xl:col-span-2">
                <Label htmlFor="t-name">Ad Soyad</Label>
                <Input
                  id="t-name"
                  name="name"
                  type="text"
                  placeholder="Ayşe K."
                  required
                  autoComplete="off"
                  defaultValue={editingTestimonial?.name ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5 xl:col-span-1">
                <Label htmlFor="t-rating">Puan (1-5)</Label>
                <Input
                  id="t-rating"
                  name="rating"
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={editingTestimonial?.rating ?? 5}
                />
              </div>

              <div className="flex flex-col gap-1.5 xl:col-span-1">
                <Label htmlFor="t-order">Sıra</Label>
                <Input
                  id="t-order"
                  name="order"
                  type="number"
                  defaultValue={editingTestimonial?.order ?? 0}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2 xl:col-span-6">
                <Label htmlFor="t-text">Yorum</Label>
                <textarea
                  id="t-text"
                  name="text"
                  className={areaClass}
                  placeholder="Kumru ile çalışmak hayatımı değiştirdi..."
                  required
                  defaultValue={editingTestimonial?.text ?? ""}
                />
              </div>

              <div className="flex items-center gap-2 sm:col-span-2 xl:col-span-6">
                <Button type="submit">
                  {editingTestimonial ? (
                    <>
                      <Pencil className="size-4" /> Değişiklikleri Kaydet
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" /> Yorum Ekle
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {testimonials.length === 0 ? (
              <EmptyState
                icon={MessageSquareQuote}
                title="Yorum yok"
                description="Henüz danışan yorumu eklenmemiş. Yukarıdaki formdan ilk yorumu ekleyebilirsiniz."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>Yorum</TableHead>
                    <TableHead>Puan</TableHead>
                    <TableHead className="text-right">Sıra</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {t.name}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md text-muted-foreground">
                        <span className="line-clamp-2">{t.text}</span>
                      </TableCell>
                      <TableCell>
                        <Stars rating={t.rating ?? 0} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {t.order ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link
                              href={`${BASE}?tab=yorumlar&edit=${t.id}`}
                            >
                              <Pencil className="size-3.5" /> Düzenle
                            </Link>
                          </Button>
                          <form action={deleteTestimonial}>
                            <input type="hidden" name="id" value={t.id} />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-3.5" /> Sil
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}

      {/* ── Videolar ── */}
      {tab === "videolar" && (
        <>
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  {editingVideo ? (
                    <Pencil className="size-4" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                </span>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {editingVideo ? "Videoyu Düzenle" : "Yeni Video"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {editingVideo
                      ? `#${editingVideo.id} numaralı kayıt düzenleniyor.`
                      : "YouTube linki veya yüklü dosya ile video ekleyin."}
                  </p>
                </div>
              </div>
              {editingVideo && (
                <Button asChild variant="ghost" size="sm">
                  <Link href={`${BASE}?tab=videolar`}>
                    <X className="size-4" /> İptal
                  </Link>
                </Button>
              )}
            </div>

            <form
              action={editingVideo ? updateVideo : createVideo}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6"
            >
              {editingVideo && (
                <input type="hidden" name="id" value={editingVideo.id} />
              )}

              <div className="flex flex-col gap-1.5 sm:col-span-2 xl:col-span-4">
                <Label htmlFor="v-title">Başlık</Label>
                <Input
                  id="v-title"
                  name="title"
                  type="text"
                  placeholder="Meditasyon Rehberi"
                  required
                  autoComplete="off"
                  defaultValue={editingVideo?.title ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5 xl:col-span-2">
                <Label htmlFor="v-source">Kaynak</Label>
                <select
                  id="v-source"
                  name="source"
                  className={fieldClass}
                  defaultValue={editingVideo?.source ?? "youtube"}
                >
                  <option value="youtube">YouTube</option>
                  <option value="upload">Dosya (mp4)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2 xl:col-span-6">
                <Label htmlFor="v-description">Açıklama</Label>
                <textarea
                  id="v-description"
                  name="description"
                  className={areaClass}
                  placeholder="Kısa açıklama..."
                  defaultValue={editingVideo?.description ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2 xl:col-span-4">
                <Label htmlFor="v-youtubeUrl">YouTube Linki</Label>
                <Input
                  id="v-youtubeUrl"
                  name="youtubeUrl"
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  autoComplete="off"
                  defaultValue={editingVideo?.youtubeUrl ?? ""}
                />
                <span className="text-xs text-muted-foreground">
                  Kaynak &quot;YouTube&quot; ise doldurun.
                </span>
              </div>

              <div className="flex flex-col gap-1.5 xl:col-span-1">
                <Label htmlFor="v-order">Sıra</Label>
                <Input
                  id="v-order"
                  name="order"
                  type="number"
                  defaultValue={editingVideo?.order ?? 0}
                />
              </div>

              <label className="flex items-end gap-2 pb-2 xl:col-span-1">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={editingVideo ? !!editingVideo.published : true}
                  className="size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span className="text-sm text-foreground">Yayında</span>
              </label>

              <div className="flex flex-col gap-1.5 xl:col-span-3">
                <Label htmlFor="v-videoFile">Video Dosyası (Medya ID)</Label>
                <Input
                  id="v-videoFile"
                  name="videoFile"
                  type="number"
                  placeholder="örn. 12"
                  defaultValue={
                    typeof editingVideo?.videoFile === "number"
                      ? editingVideo.videoFile
                      : editingVideo?.videoFile?.id ?? ""
                  }
                />
                <span className="text-xs text-muted-foreground">
                  Kaynak &quot;Dosya&quot; ise medya kütüphanesindeki ID.
                </span>
              </div>

              <div className="flex flex-col gap-1.5 xl:col-span-3">
                <Label htmlFor="v-thumbnail">Kapak Görseli (Medya ID)</Label>
                <Input
                  id="v-thumbnail"
                  name="thumbnail"
                  type="number"
                  placeholder="örn. 8"
                  defaultValue={
                    typeof editingVideo?.thumbnail === "number"
                      ? editingVideo.thumbnail
                      : editingVideo?.thumbnail?.id ?? ""
                  }
                />
              </div>

              <div className="flex items-center gap-2 sm:col-span-2 xl:col-span-6">
                <Button type="submit">
                  {editingVideo ? (
                    <>
                      <Pencil className="size-4" /> Değişiklikleri Kaydet
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" /> Video Ekle
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {videos.length === 0 ? (
              <EmptyState
                icon={VideoIcon}
                title="Video yok"
                description="Henüz video eklenmemiş. Yukarıdaki formdan ilk videoyu ekleyebilirsiniz."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Kaynak</TableHead>
                    <TableHead>Yayında</TableHead>
                    <TableHead className="text-right">Sıra</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {v.title}
                        </div>
                        {v.youtubeUrl && (
                          <div className="text-xs text-muted-foreground truncate max-w-xs">
                            {v.youtubeUrl}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
                          {v.source === "upload" ? (
                            <>
                              <FileVideo className="size-3.5" /> Dosya
                            </>
                          ) : (
                            <>
                              <Youtube className="size-3.5" /> YouTube
                            </>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            v.published
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {v.published ? "Evet" : "Hayır"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {v.order ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`${BASE}?tab=videolar&edit=${v.id}`}>
                              <Pencil className="size-3.5" /> Düzenle
                            </Link>
                          </Button>
                          <form action={deleteVideo}>
                            <input type="hidden" name="id" value={v.id} />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-3.5" /> Sil
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}
    </>
  );
}
