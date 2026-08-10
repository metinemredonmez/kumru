import Link from "next/link";
import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Program } from "@/payload-types";
import { Package, Plus, Pencil, Trash2, X, Star } from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
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

const BASE = "/yonetim/paketler";

const fieldClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

// ── Yetki kontrolü ──────────────────────────────────────────────────────────
async function requireAdmin() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }
  return payload;
}

function linesToIncludes(raw: string) {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((item) => ({ item }));
}

// ── Kaydet (create / update) ─────────────────────────────────────────────────
async function saveProgram(formData: FormData) {
  "use server";
  const payload = await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  const key = String(formData.get("key") || "").trim();
  const title = String(formData.get("title") || "").trim();
  if (!key || !title) redirect(BASE);

  const data = {
    key,
    title,
    subtitle: String(formData.get("subtitle") || "").trim() || null,
    duration: String(formData.get("duration") || "").trim() || null,
    sessions: String(formData.get("sessions") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    includes: linesToIncludes(String(formData.get("includes") || "")),
    popular: formData.get("popular") === "on",
    hotelIncluded: formData.get("hotelIncluded") === "on",
    order: Number.parseInt(String(formData.get("order") || "0"), 10) || 0,
  };

  if (id) {
    await payload.update({
      collection: "programs",
      id,
      data,
      locale: "tr",
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "programs",
      data,
      locale: "tr",
      overrideAccess: true,
    });
  }

  revalidatePath(BASE);
  redirect(BASE);
}

async function deleteProgram(formData: FormData) {
  "use server";
  const payload = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (id) {
    await payload.delete({
      collection: "programs",
      id,
      overrideAccess: true,
    });
  }
  revalidatePath(BASE);
  redirect(BASE);
}

// ── Sayfa ────────────────────────────────────────────────────────────────────
type SearchParams = { edit?: string };

export default async function PaketlerPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const editId = (params.edit ?? "").trim();

  const payload = await getPayload({ config });

  const list = await payload.find({
    collection: "programs",
    depth: 0,
    limit: 200,
    sort: "order",
    locale: "tr",
  });
  const programs = list.docs as Program[];

  let editProgram: Program | null = null;
  if (editId) {
    editProgram = (await payload
      .findByID({
        collection: "programs",
        id: editId,
        depth: 0,
        locale: "tr",
      })
      .catch(() => null)) as Program | null;
  }

  const includesText = (editProgram?.includes ?? [])
    .map((i) => i?.item ?? "")
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <PageHeader
        title="Paketler"
        subtitle="Retreat & paket içerikleri (site /programlar sayfası)"
      />

      {/* Form */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
              {editProgram ? (
                <Pencil className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}
            </span>
            <h2 className="text-base font-semibold text-foreground">
              {editProgram ? "Paketi Düzenle" : "Yeni Paket"}
            </h2>
          </div>
          {editProgram && (
            <Button asChild variant="ghost" size="sm">
              <Link href={BASE}>
                <X className="size-3.5" /> İptal
              </Link>
            </Button>
          )}
        </div>

        <form
          action={saveProgram}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {editProgram && (
            <input type="hidden" name="id" value={editProgram.id} />
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="key">Sistem Anahtarı</Label>
            <Input
              id="key"
              name="key"
              type="text"
              placeholder="novaVeraRetreat"
              required
              autoComplete="off"
              defaultValue={editProgram?.key ?? ""}
            />
            <p className="text-xs text-muted-foreground">
              Sayfa eşlemesi için kullanılır; mevcut kayıtlarda değiştirmeyin.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Paket Adı</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Nova Vera Retreat"
              required
              autoComplete="off"
              defaultValue={editProgram?.title ?? ""}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="subtitle">Alt Başlık</Label>
            <Input
              id="subtitle"
              name="subtitle"
              type="text"
              placeholder="Ruhsal dönüşüm yolculuğu"
              autoComplete="off"
              defaultValue={editProgram?.subtitle ?? ""}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="duration">Süre</Label>
            <Input
              id="duration"
              name="duration"
              type="text"
              placeholder="3 gün 2 gece"
              autoComplete="off"
              defaultValue={editProgram?.duration ?? ""}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sessions">Seans Tipi</Label>
            <Input
              id="sessions"
              name="sessions"
              type="text"
              placeholder="Grup + bireysel"
              autoComplete="off"
              defaultValue={editProgram?.sessions ?? ""}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="description">Açıklama</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className={fieldClass}
              placeholder="Paketin detaylı açıklaması"
              defaultValue={editProgram?.description ?? ""}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="includes">Dahil Olanlar (her satıra bir madde)</Label>
            <textarea
              id="includes"
              name="includes"
              rows={5}
              className={fieldClass}
              placeholder={"Konaklama\nTüm öğünler\nGrup seansları\nBireysel danışmanlık"}
              defaultValue={includesText}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="order">Sıra</Label>
            <Input
              id="order"
              name="order"
              type="number"
              placeholder="0"
              defaultValue={editProgram?.order ?? 0}
            />
          </div>

          <div className="flex flex-col justify-end gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="popular"
                defaultChecked={editProgram?.popular ?? false}
                className="size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-sm text-foreground">En popüler</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hotelIncluded"
                defaultChecked={editProgram?.hotelIncluded ?? false}
                className="size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-sm text-foreground">Otel konaklamalı</span>
            </label>
          </div>

          <div className="flex items-end sm:col-span-2">
            <Button type="submit">
              {editProgram ? (
                <>
                  <Pencil className="size-4" /> Değişiklikleri Kaydet
                </>
              ) : (
                <>
                  <Plus className="size-4" /> Paket Ekle
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Tablo */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {programs.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Paket yok"
            description="Henüz paket eklenmemiş. Yukarıdaki formdan ekleyebilirsiniz."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Süre</TableHead>
                <TableHead>Popüler</TableHead>
                <TableHead className="text-right">Sıra</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{p.title}</div>
                    {p.subtitle && (
                      <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {p.subtitle}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.duration || "-"}
                  </TableCell>
                  <TableCell>
                    {p.popular ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        <Star className="size-3" /> Popüler
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        Hayır
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {p.order ?? 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`${BASE}?edit=${p.id}`}>
                          <Pencil className="size-3.5" /> Düzenle
                        </Link>
                      </Button>
                      <form action={deleteProgram}>
                        <input type="hidden" name="id" value={p.id} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "text-destructive hover:text-destructive"
                          )}
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
  );
}
