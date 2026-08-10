import Link from "next/link";
import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Course } from "@/payload-types";
import {
  GraduationCap,
  BookOpen,
  Layers,
  Eye,
  Plus,
  Pencil,
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
import { tierLabel, tierTone } from "@/lib/yonetim/format";

const UNLOCK_LABEL: Record<string, string> = {
  complete: "Tamamlayınca açılır",
  drip: "Zamana bağlı (drip)",
  manual: "Kumru manuel açar",
  open: "Hepsi açık",
};

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

// ── Yeni program oluşturma (server action) ────────────────────────────────
async function createProgram(formData: FormData) {
  "use server";

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const requiredTier = String(
    formData.get("requiredTier") || "premium"
  ) as NonNullable<Course["requiredTier"]>;
  const unlockRule = String(
    formData.get("unlockRule") || "complete"
  ) as NonNullable<Course["unlockRule"]>;
  const published = formData.get("published") === "on";

  if (!title || !slug) {
    // Zorunlu alanlar eksikse sessizce çık (form tekrar denenebilir).
    return;
  }

  await payload.create({
    collection: "courses",
    data: {
      title,
      slug,
      requiredTier,
      unlockRule,
      published,
    },
    overrideAccess: true,
  });

  revalidatePath("/yonetim/programlar");
}

// ── Sayfa ──────────────────────────────────────────────────────────────────
export default async function ProgramlarPage() {
  const payload = await getPayload({ config });

  const [list, totalCount, publishedCount] = await Promise.all([
    payload.find({
      collection: "courses",
      depth: 0,
      limit: 200,
      sort: "order",
    }),
    payload.count({ collection: "courses" }),
    payload.count({
      collection: "courses",
      where: { published: { equals: true } },
    }),
  ]);

  const programs = list.docs as Course[];

  // Her program için aşama sayısı
  const stageCounts = await Promise.all(
    programs.map((p) =>
      payload.count({
        collection: "program-stages",
        where: { program: { equals: p.id } },
      })
    )
  );
  const totalStages = stageCounts.reduce((sum, c) => sum + c.totalDocs, 0);

  return (
    <>
      <PageHeader
        title="Programlar"
        subtitle="İlerlemeli programları (courses) yönet ve yeni program oluştur."
      />

      {/* KPI'lar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Toplam Program"
          value={totalCount.totalDocs}
          icon={BookOpen}
        />
        <StatCard
          label="Yayında"
          value={publishedCount.totalDocs}
          icon={Eye}
          tone="good"
        />
        <StatCard
          label="Toplam Aşama"
          value={totalStages}
          icon={Layers}
          tone="gold"
        />
      </div>

      {/* Yeni program formu */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Plus className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Yeni Program
            </h2>
            <p className="text-xs text-muted-foreground">
              Oluşturduktan sonra &quot;Düzenle&quot; ile aşamalarını ekleyebilirsiniz.
            </p>
          </div>
        </div>

        <form
          action={createProgram}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6"
        >
          <div className="flex flex-col gap-1.5 sm:col-span-2 xl:col-span-2">
            <Label htmlFor="title">Program Adı</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Nova Vera Yolculuğu"
              required
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2 xl:col-span-2">
            <Label htmlFor="slug">URL (slug)</Label>
            <Input
              id="slug"
              name="slug"
              type="text"
              placeholder="nova-vera-yolculugu"
              required
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-1.5 xl:col-span-1">
            <Label htmlFor="requiredTier">Gereken Seviye</Label>
            <select
              id="requiredTier"
              name="requiredTier"
              className={fieldClass}
              defaultValue="premium"
            >
              <option value="free">Ücretsiz (herkes)</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 xl:col-span-1">
            <Label htmlFor="unlockRule">Açılma Kuralı</Label>
            <select
              id="unlockRule"
              name="unlockRule"
              className={fieldClass}
              defaultValue="complete"
            >
              <option value="complete">Tamamlayınca açılır</option>
              <option value="drip">Zamana bağlı (drip)</option>
              <option value="manual">Kumru manuel açar</option>
              <option value="open">Hepsi açık</option>
            </select>
          </div>

          <label className="flex items-center gap-2 sm:col-span-2 xl:col-span-3">
            <input
              type="checkbox"
              name="published"
              defaultChecked
              className="size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span className="text-sm text-foreground">Yayında</span>
          </label>

          <div className="flex items-end sm:col-span-2 xl:col-span-3">
            <Button type="submit" className="w-full sm:w-auto">
              <Plus className="size-4" /> Program Ekle
            </Button>
          </div>
        </form>
      </div>

      {/* Tablo */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {programs.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="Program yok"
            description="Henüz program bulunmuyor. Yukarıdaki formdan ilk programı oluşturabilirsiniz."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Gereken Seviye</TableHead>
                <TableHead>Açılma Kuralı</TableHead>
                <TableHead>Yayında</TableHead>
                <TableHead className="text-right">Aşama</TableHead>
                <TableHead className="text-right">Sıra</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((p, i) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{p.title}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {p.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        tierTone(p.requiredTier)
                      )}
                    >
                      {tierLabel(p.requiredTier)}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {UNLOCK_LABEL[p.unlockRule ?? "complete"] ??
                      p.unlockRule ??
                      "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        p.published
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {p.published ? "Evet" : "Hayır"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums text-foreground">
                    {stageCounts[i].totalDocs}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {p.order ?? 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/yonetim/programlar/${p.id}`}>
                        <Pencil className="size-3.5" /> Düzenle
                      </Link>
                    </Button>
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
