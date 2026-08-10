import Link from "next/link";
import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import type { ResourceItem, BlogPost, Tip } from "@/payload-types";
import {
  BookOpen,
  Newspaper,
  Lightbulb,
  Plus,
  Pencil,
  Trash2,
  Save,
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

const BASE = "/yonetim/icerik/kaynaklar";

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";
const textareaClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

// ── Yetki doğrulama ────────────────────────────────────────────────────────
async function assertAdmin() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }
  return payload;
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v === "" ? 0 : Number(v);
};

function done(tab: string) {
  revalidatePath(BASE);
  redirect(`${BASE}?tab=${tab}`);
}

// ── Kaynaklar (resource-items) ─────────────────────────────────────────────
async function createResource(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const title = str(formData, "title");
  if (!title) return;
  await payload.create({
    collection: "resource-items",
    locale: "tr",
    overrideAccess: true,
    data: {
      title,
      description: str(formData, "description"),
      type: (str(formData, "type") || "PDF") as ResourceItem["type"],
      category: str(formData, "category"),
      order: num(formData, "order"),
    },
  });
  done("kaynaklar");
}

async function updateResource(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const id = Number(formData.get("id"));
  const title = str(formData, "title");
  if (!id || !title) return;
  await payload.update({
    collection: "resource-items",
    id,
    locale: "tr",
    overrideAccess: true,
    data: {
      title,
      description: str(formData, "description"),
      type: (str(formData, "type") || "PDF") as ResourceItem["type"],
      category: str(formData, "category"),
      order: num(formData, "order"),
    },
  });
  done("kaynaklar");
}

async function deleteResource(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const id = Number(formData.get("id"));
  if (id) {
    await payload.delete({ collection: "resource-items", id, overrideAccess: true });
  }
  done("kaynaklar");
}

// ── Blog (blog-posts) ──────────────────────────────────────────────────────
async function createBlog(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const title = str(formData, "title");
  if (!title) return;
  await payload.create({
    collection: "blog-posts",
    locale: "tr",
    overrideAccess: true,
    data: {
      title,
      excerpt: str(formData, "excerpt"),
      category: str(formData, "category"),
      readTime: str(formData, "readTime"),
      order: num(formData, "order"),
    },
  });
  done("blog");
}

async function updateBlog(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const id = Number(formData.get("id"));
  const title = str(formData, "title");
  if (!id || !title) return;
  await payload.update({
    collection: "blog-posts",
    id,
    locale: "tr",
    overrideAccess: true,
    data: {
      title,
      excerpt: str(formData, "excerpt"),
      category: str(formData, "category"),
      readTime: str(formData, "readTime"),
      order: num(formData, "order"),
    },
  });
  done("blog");
}

async function deleteBlog(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const id = Number(formData.get("id"));
  if (id) {
    await payload.delete({ collection: "blog-posts", id, overrideAccess: true });
  }
  done("blog");
}

// ── İpuçları (tips) ────────────────────────────────────────────────────────
async function createTip(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const title = str(formData, "title");
  if (!title) return;
  await payload.create({
    collection: "tips",
    locale: "tr",
    overrideAccess: true,
    data: {
      title,
      tip: str(formData, "tip"),
      order: num(formData, "order"),
    },
  });
  done("ipuclari");
}

async function updateTip(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const id = Number(formData.get("id"));
  const title = str(formData, "title");
  if (!id || !title) return;
  await payload.update({
    collection: "tips",
    id,
    locale: "tr",
    overrideAccess: true,
    data: {
      title,
      tip: str(formData, "tip"),
      order: num(formData, "order"),
    },
  });
  done("ipuclari");
}

async function deleteTip(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const id = Number(formData.get("id"));
  if (id) {
    await payload.delete({ collection: "tips", id, overrideAccess: true });
  }
  done("ipuclari");
}

// ── Küçük yardımcı bileşenler ──────────────────────────────────────────────
function FormHeader({
  editing,
  newLabel,
  editLabel,
}: {
  editing: boolean;
  newLabel: string;
  editLabel: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
        {editing ? <Pencil className="size-4" /> : <Plus className="size-4" />}
      </span>
      <h2 className="text-base font-semibold text-foreground">
        {editing ? editLabel : newLabel}
      </h2>
    </div>
  );
}

function FormActions({ editing, tab }: { editing: boolean; tab: string }) {
  return (
    <div className="mt-5 flex items-center gap-2">
      <Button type="submit">
        {editing ? <Save className="size-4" /> : <Plus className="size-4" />}
        {editing ? "Kaydet" : "Ekle"}
      </Button>
      {editing && (
        <Button asChild variant="outline" type="button">
          <Link href={`${BASE}?tab=${tab}`}>
            <X className="size-4" /> İptal
          </Link>
        </Button>
      )}
    </div>
  );
}

function DeleteButton({
  action,
  id,
}: {
  action: (fd: FormData) => Promise<void>;
  id: number;
}) {
  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-3.5" /> Sil
      </Button>
    </form>
  );
}

// ── Sayfa ──────────────────────────────────────────────────────────────────
export default async function KaynaklarPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; edit?: string }>;
}) {
  const sp = await searchParams;
  const tab = ["kaynaklar", "blog", "ipuclari"].includes(sp.tab ?? "")
    ? (sp.tab as string)
    : "kaynaklar";
  const editId = sp.edit ? Number(sp.edit) : null;

  const payload = await getPayload({ config });

  const [resources, blogs, tips] = await Promise.all([
    payload.find({
      collection: "resource-items",
      locale: "tr",
      depth: 0,
      limit: 200,
      sort: "order",
    }),
    payload.find({
      collection: "blog-posts",
      locale: "tr",
      depth: 0,
      limit: 200,
      sort: "order",
    }),
    payload.find({
      collection: "tips",
      locale: "tr",
      depth: 0,
      limit: 200,
      sort: "order",
    }),
  ]);

  const resourceList = resources.docs as ResourceItem[];
  const blogList = blogs.docs as BlogPost[];
  const tipList = tips.docs as Tip[];

  // Düzenlenen kayıtları çek (yalnızca aktif sekme için)
  const editResource =
    tab === "kaynaklar" && editId
      ? ((await payload
          .findByID({
            collection: "resource-items",
            id: editId,
            locale: "tr",
            depth: 0,
          })
          .catch(() => null)) as ResourceItem | null)
      : null;
  const editBlog =
    tab === "blog" && editId
      ? ((await payload
          .findByID({
            collection: "blog-posts",
            id: editId,
            locale: "tr",
            depth: 0,
          })
          .catch(() => null)) as BlogPost | null)
      : null;
  const editTip =
    tab === "ipuclari" && editId
      ? ((await payload
          .findByID({
            collection: "tips",
            id: editId,
            locale: "tr",
            depth: 0,
          })
          .catch(() => null)) as Tip | null)
      : null;

  return (
    <div>
      <PageHeader
        title="Kaynaklar"
        subtitle="E-kitap ve kaynaklar, blog yazıları ve günlük ipuçlarını yönetin."
      />

      <Tabs defaultValue={tab} className="w-full">
        <TabsList>
          <TabsTrigger value="kaynaklar">
            <BookOpen className="size-4" /> Kaynaklar
          </TabsTrigger>
          <TabsTrigger value="blog">
            <Newspaper className="size-4" /> Blog
          </TabsTrigger>
          <TabsTrigger value="ipuclari">
            <Lightbulb className="size-4" /> İpuçları
          </TabsTrigger>
        </TabsList>

        {/* ── KAYNAKLAR ─────────────────────────────────────────────── */}
        <TabsContent value="kaynaklar">
          <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <FormHeader
              editing={!!editResource}
              newLabel="Yeni Kaynak"
              editLabel="Kaynağı Düzenle"
            />
            <form
              key={editResource?.id ?? "new"}
              action={editResource ? updateResource : createResource}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {editResource && (
                <input type="hidden" name="id" value={editResource.id} />
              )}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="r-title">Başlık</Label>
                <Input
                  id="r-title"
                  name="title"
                  defaultValue={editResource?.title ?? ""}
                  placeholder="Örn. Nefes Egzersizleri E-Kitabı"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="r-description">Açıklama</Label>
                <textarea
                  id="r-description"
                  name="description"
                  rows={3}
                  defaultValue={editResource?.description ?? ""}
                  className={textareaClass}
                  placeholder="Kısa açıklama"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="r-type">Tür</Label>
                <select
                  id="r-type"
                  name="type"
                  className={fieldClass}
                  defaultValue={editResource?.type ?? "PDF"}
                >
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Ses">Ses</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="r-category">Kategori</Label>
                <Input
                  id="r-category"
                  name="category"
                  defaultValue={editResource?.category ?? ""}
                  placeholder="Örn. Meditasyon"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="r-order">Sıra</Label>
                <Input
                  id="r-order"
                  name="order"
                  type="number"
                  defaultValue={editResource?.order ?? 0}
                />
              </div>
              <div className="sm:col-span-2">
                <FormActions editing={!!editResource} tab="kaynaklar" />
              </div>
            </form>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">
            {resourceList.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="Kaynak yok"
                description="Henüz kaynak eklenmemiş. Yukarıdaki formdan ilk kaydı oluşturun."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Tür</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Sıra</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resourceList.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {r.title}
                        </div>
                        {r.description && (
                          <div className="line-clamp-1 text-xs text-muted-foreground">
                            {r.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {r.type ?? "PDF"}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.category || "-"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {r.order ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`${BASE}?tab=kaynaklar&edit=${r.id}`}>
                              <Pencil className="size-3.5" /> Düzenle
                            </Link>
                          </Button>
                          <DeleteButton action={deleteResource} id={r.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* ── BLOG ──────────────────────────────────────────────────── */}
        <TabsContent value="blog">
          <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <FormHeader
              editing={!!editBlog}
              newLabel="Yeni Blog Yazısı"
              editLabel="Blog Yazısını Düzenle"
            />
            <form
              key={editBlog?.id ?? "new"}
              action={editBlog ? updateBlog : createBlog}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {editBlog && <input type="hidden" name="id" value={editBlog.id} />}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="b-title">Başlık</Label>
                <Input
                  id="b-title"
                  name="title"
                  defaultValue={editBlog?.title ?? ""}
                  placeholder="Yazı başlığı"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="b-excerpt">Özet</Label>
                <textarea
                  id="b-excerpt"
                  name="excerpt"
                  rows={3}
                  defaultValue={editBlog?.excerpt ?? ""}
                  className={textareaClass}
                  placeholder="Kısa özet"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="b-category">Kategori</Label>
                <Input
                  id="b-category"
                  name="category"
                  defaultValue={editBlog?.category ?? ""}
                  placeholder="Örn. Farkındalık"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="b-readTime">Okuma Süresi</Label>
                <Input
                  id="b-readTime"
                  name="readTime"
                  defaultValue={editBlog?.readTime ?? ""}
                  placeholder="Örn. 5 dk"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="b-order">Sıra</Label>
                <Input
                  id="b-order"
                  name="order"
                  type="number"
                  defaultValue={editBlog?.order ?? 0}
                />
              </div>
              <div className="sm:col-span-2">
                <FormActions editing={!!editBlog} tab="blog" />
              </div>
            </form>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">
            {blogList.length === 0 ? (
              <EmptyState
                icon={Newspaper}
                title="Blog yazısı yok"
                description="Henüz blog yazısı eklenmemiş. Yukarıdaki formdan ilk yazıyı oluşturun."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Okuma Süresi</TableHead>
                    <TableHead className="text-right">Sıra</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogList.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {b.title}
                        </div>
                        {b.excerpt && (
                          <div className="line-clamp-1 text-xs text-muted-foreground">
                            {b.excerpt}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {b.category || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {b.readTime || "-"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {b.order ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`${BASE}?tab=blog&edit=${b.id}`}>
                              <Pencil className="size-3.5" /> Düzenle
                            </Link>
                          </Button>
                          <DeleteButton action={deleteBlog} id={b.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* ── İPUÇLARI ──────────────────────────────────────────────── */}
        <TabsContent value="ipuclari">
          <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <FormHeader
              editing={!!editTip}
              newLabel="Yeni İpucu"
              editLabel="İpucunu Düzenle"
            />
            <form
              key={editTip?.id ?? "new"}
              action={editTip ? updateTip : createTip}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {editTip && <input type="hidden" name="id" value={editTip.id} />}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="t-title">Başlık</Label>
                <Input
                  id="t-title"
                  name="title"
                  defaultValue={editTip?.title ?? ""}
                  placeholder="Örn. Sabah rutini"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="t-tip">İpucu Metni</Label>
                <textarea
                  id="t-tip"
                  name="tip"
                  rows={4}
                  defaultValue={editTip?.tip ?? ""}
                  className={textareaClass}
                  placeholder="İpucu metni"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="t-order">Sıra</Label>
                <Input
                  id="t-order"
                  name="order"
                  type="number"
                  defaultValue={editTip?.order ?? 0}
                />
              </div>
              <div className="sm:col-span-2">
                <FormActions editing={!!editTip} tab="ipuclari" />
              </div>
            </form>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">
            {tipList.length === 0 ? (
              <EmptyState
                icon={Lightbulb}
                title="İpucu yok"
                description="Henüz ipucu eklenmemiş. Yukarıdaki formdan ilk ipucunu oluşturun."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead>İpucu</TableHead>
                    <TableHead className="text-right">Sıra</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tipList.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {t.title}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md text-muted-foreground">
                        <span className="line-clamp-1">{t.tip || "-"}</span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {t.order ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`${BASE}?tab=ipuclari&edit=${t.id}`}>
                              <Pencil className="size-3.5" /> Düzenle
                            </Link>
                          </Button>
                          <DeleteButton action={deleteTip} id={t.id} />
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
    </div>
  );
}
