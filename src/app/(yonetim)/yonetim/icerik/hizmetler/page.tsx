import Link from "next/link";
import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import type { SpiritualSession, CoachingService } from "@/payload-types";
import {
  Sparkles,
  HandHeart,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import EmptyState from "@/components/yonetim/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

const BASE = "/yonetim/icerik/hizmetler";

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

function linesToFeatures(raw: string) {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((feature) => ({ feature }));
}

// ── Spiritüel Seans action'ları ─────────────────────────────────────────────
async function saveSpiritual(formData: FormData) {
  "use server";
  const payload = await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  if (!title) redirect(`${BASE}?tab=spiritual`);

  const data = {
    title,
    description: String(formData.get("description") || "").trim() || null,
    duration: String(formData.get("duration") || "").trim() || null,
    price: String(formData.get("price") || "").trim() || null,
    order: Number.parseInt(String(formData.get("order") || "0"), 10) || 0,
  };

  if (id) {
    await payload.update({
      collection: "spiritual-sessions",
      id,
      data,
      locale: "tr",
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "spiritual-sessions",
      data,
      locale: "tr",
      overrideAccess: true,
    });
  }

  revalidatePath(BASE);
  redirect(`${BASE}?tab=spiritual`);
}

async function deleteSpiritual(formData: FormData) {
  "use server";
  const payload = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (id) {
    await payload.delete({
      collection: "spiritual-sessions",
      id,
      overrideAccess: true,
    });
  }
  revalidatePath(BASE);
  redirect(`${BASE}?tab=spiritual`);
}

// ── Koçluk Hizmeti action'ları ──────────────────────────────────────────────
async function saveCoaching(formData: FormData) {
  "use server";
  const payload = await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  const key = String(formData.get("key") || "").trim();
  const title = String(formData.get("title") || "").trim();
  if (!key || !title) redirect(`${BASE}?tab=coaching`);

  const data = {
    key,
    title,
    shortDesc: String(formData.get("shortDesc") || "").trim() || null,
    fullDesc: String(formData.get("fullDesc") || "").trim() || null,
    duration: String(formData.get("duration") || "").trim() || null,
    features: linesToFeatures(String(formData.get("features") || "")),
    order: Number.parseInt(String(formData.get("order") || "0"), 10) || 0,
  };

  if (id) {
    await payload.update({
      collection: "coaching-services",
      id,
      data,
      locale: "tr",
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "coaching-services",
      data,
      locale: "tr",
      overrideAccess: true,
    });
  }

  revalidatePath(BASE);
  redirect(`${BASE}?tab=coaching`);
}

async function deleteCoaching(formData: FormData) {
  "use server";
  const payload = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (id) {
    await payload.delete({
      collection: "coaching-services",
      id,
      overrideAccess: true,
    });
  }
  revalidatePath(BASE);
  redirect(`${BASE}?tab=coaching`);
}

// ── Sayfa ────────────────────────────────────────────────────────────────────
type SearchParams = {
  tab?: string;
  edit?: string;
};

export default async function HizmetlerPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const activeTab = params.tab === "coaching" ? "coaching" : "spiritual";
  const editId = (params.edit ?? "").trim();

  const payload = await getPayload({ config });

  const [spiritualList, coachingList] = await Promise.all([
    payload.find({
      collection: "spiritual-sessions",
      depth: 0,
      limit: 200,
      sort: "order",
      locale: "tr",
    }),
    payload.find({
      collection: "coaching-services",
      depth: 0,
      limit: 200,
      sort: "order",
      locale: "tr",
    }),
  ]);

  const sessions = spiritualList.docs as SpiritualSession[];
  const services = coachingList.docs as CoachingService[];

  // Düzenlenecek kayıtları çek (yalnızca aktif sekmeye göre)
  let editSpiritual: SpiritualSession | null = null;
  let editCoaching: CoachingService | null = null;

  if (editId && activeTab === "spiritual") {
    editSpiritual = (await payload
      .findByID({
        collection: "spiritual-sessions",
        id: editId,
        depth: 0,
        locale: "tr",
      })
      .catch(() => null)) as SpiritualSession | null;
  }
  if (editId && activeTab === "coaching") {
    editCoaching = (await payload
      .findByID({
        collection: "coaching-services",
        id: editId,
        depth: 0,
        locale: "tr",
      })
      .catch(() => null)) as CoachingService | null;
  }

  const coachingFeaturesText = (editCoaching?.features ?? [])
    .map((f) => f?.feature ?? "")
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <PageHeader
        title="Hizmetler"
        subtitle="Spiritüel seanslar ve koçluk hizmetlerini yönetin. İçerikler sitede yayınlanan hizmet kartlarını besler."
      />

      <Tabs key={activeTab} defaultValue={activeTab} className="w-full">
        <TabsList>
          <TabsTrigger value="spiritual" asChild>
            <Link href={`${BASE}?tab=spiritual`}>
              <Sparkles className="size-4" /> Spiritüel Seanslar
            </Link>
          </TabsTrigger>
          <TabsTrigger value="coaching" asChild>
            <Link href={`${BASE}?tab=coaching`}>
              <HandHeart className="size-4" /> Koçluk Hizmetleri
            </Link>
          </TabsTrigger>
        </TabsList>

        {/* ── Spiritüel Seanslar ── */}
        <TabsContent value="spiritual">
          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  {editSpiritual ? (
                    <Pencil className="size-4" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                </span>
                <h2 className="text-base font-semibold text-foreground">
                  {editSpiritual ? "Seansı Düzenle" : "Yeni Seans"}
                </h2>
              </div>
              {editSpiritual && (
                <Button asChild variant="ghost" size="sm">
                  <Link href={`${BASE}?tab=spiritual`}>
                    <X className="size-3.5" /> İptal
                  </Link>
                </Button>
              )}
            </div>

            <form
              action={saveSpiritual}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {editSpiritual && (
                <input type="hidden" name="id" value={editSpiritual.id} />
              )}

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="s-title">Seans Adı</Label>
                <Input
                  id="s-title"
                  name="title"
                  type="text"
                  placeholder="Bireysel Enerji Seansı"
                  required
                  autoComplete="off"
                  defaultValue={editSpiritual?.title ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="s-description">Açıklama</Label>
                <textarea
                  id="s-description"
                  name="description"
                  rows={3}
                  className={fieldClass}
                  placeholder="Seansın kısa açıklaması"
                  defaultValue={editSpiritual?.description ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="s-duration">Süre</Label>
                <Input
                  id="s-duration"
                  name="duration"
                  type="text"
                  placeholder="60 dk"
                  autoComplete="off"
                  defaultValue={editSpiritual?.duration ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="s-price">Fiyat</Label>
                <Input
                  id="s-price"
                  name="price"
                  type="text"
                  placeholder="₺1.500"
                  autoComplete="off"
                  defaultValue={editSpiritual?.price ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="s-order">Sıra</Label>
                <Input
                  id="s-order"
                  name="order"
                  type="number"
                  placeholder="0"
                  defaultValue={editSpiritual?.order ?? 0}
                />
              </div>

              <div className="flex items-end sm:col-span-2">
                <Button type="submit">
                  {editSpiritual ? (
                    <>
                      <Pencil className="size-4" /> Değişiklikleri Kaydet
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" /> Seans Ekle
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Tablo */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {sessions.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="Seans yok"
                description="Henüz spiritüel seans eklenmemiş. Yukarıdaki formdan ekleyebilirsiniz."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seans</TableHead>
                    <TableHead>Süre</TableHead>
                    <TableHead>Fiyat</TableHead>
                    <TableHead className="text-right">Sıra</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {s.title}
                        </div>
                        {s.description && (
                          <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {s.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {s.duration || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {s.price || "-"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {s.order ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`${BASE}?tab=spiritual&edit=${s.id}`}>
                              <Pencil className="size-3.5" /> Düzenle
                            </Link>
                          </Button>
                          <form action={deleteSpiritual}>
                            <input type="hidden" name="id" value={s.id} />
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
        </TabsContent>

        {/* ── Koçluk Hizmetleri ── */}
        <TabsContent value="coaching">
          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  {editCoaching ? (
                    <Pencil className="size-4" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                </span>
                <h2 className="text-base font-semibold text-foreground">
                  {editCoaching ? "Hizmeti Düzenle" : "Yeni Koçluk Hizmeti"}
                </h2>
              </div>
              {editCoaching && (
                <Button asChild variant="ghost" size="sm">
                  <Link href={`${BASE}?tab=coaching`}>
                    <X className="size-3.5" /> İptal
                  </Link>
                </Button>
              )}
            </div>

            <form
              action={saveCoaching}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {editCoaching && (
                <input type="hidden" name="id" value={editCoaching.id} />
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-key">Sistem Anahtarı</Label>
                <Input
                  id="c-key"
                  name="key"
                  type="text"
                  placeholder="oneOnOne"
                  required
                  autoComplete="off"
                  defaultValue={editCoaching?.key ?? ""}
                />
                <p className="text-xs text-muted-foreground">
                  Sayfa eşlemesi için kullanılır; mevcut kayıtlarda değiştirmeyin.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-title">Hizmet Adı</Label>
                <Input
                  id="c-title"
                  name="title"
                  type="text"
                  placeholder="Birebir Koçluk"
                  required
                  autoComplete="off"
                  defaultValue={editCoaching?.title ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="c-shortDesc">Kısa Açıklama</Label>
                <textarea
                  id="c-shortDesc"
                  name="shortDesc"
                  rows={2}
                  className={fieldClass}
                  placeholder="Kart üzerinde görünen kısa açıklama"
                  defaultValue={editCoaching?.shortDesc ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="c-fullDesc">Uzun Açıklama</Label>
                <textarea
                  id="c-fullDesc"
                  name="fullDesc"
                  rows={4}
                  className={fieldClass}
                  placeholder="Detay sayfasında görünen uzun açıklama"
                  defaultValue={editCoaching?.fullDesc ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-duration">Süre</Label>
                <Input
                  id="c-duration"
                  name="duration"
                  type="text"
                  placeholder="90 dk"
                  autoComplete="off"
                  defaultValue={editCoaching?.duration ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-order">Sıra</Label>
                <Input
                  id="c-order"
                  name="order"
                  type="number"
                  placeholder="0"
                  defaultValue={editCoaching?.order ?? 0}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="c-features">Özellikler (her satıra bir madde)</Label>
                <textarea
                  id="c-features"
                  name="features"
                  rows={5}
                  className={fieldClass}
                  placeholder={"Kişiye özel plan\nHaftalık takip\nWhatsApp desteği"}
                  defaultValue={coachingFeaturesText}
                />
              </div>

              <div className="flex items-end sm:col-span-2">
                <Button type="submit">
                  {editCoaching ? (
                    <>
                      <Pencil className="size-4" /> Değişiklikleri Kaydet
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" /> Hizmet Ekle
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Tablo */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {services.length === 0 ? (
              <EmptyState
                icon={HandHeart}
                title="Koçluk hizmeti yok"
                description="Henüz koçluk hizmeti eklenmemiş. Yukarıdaki formdan ekleyebilirsiniz."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hizmet</TableHead>
                    <TableHead>Anahtar</TableHead>
                    <TableHead>Süre</TableHead>
                    <TableHead className="text-right">Özellik</TableHead>
                    <TableHead className="text-right">Sıra</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {c.title}
                        </div>
                        {c.shortDesc && (
                          <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {c.shortDesc}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                          {c.key}
                        </code>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {c.duration || "-"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {c.features?.length ?? 0}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {c.order ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`${BASE}?tab=coaching&edit=${c.id}`}>
                              <Pencil className="size-3.5" /> Düzenle
                            </Link>
                          </Button>
                          <form action={deleteCoaching}>
                            <input type="hidden" name="id" value={c.id} />
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
        </TabsContent>
      </Tabs>
    </>
  );
}
