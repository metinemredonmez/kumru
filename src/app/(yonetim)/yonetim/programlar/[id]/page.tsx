import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers as nextHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  ArrowLeft,
  GraduationCap,
  Layers,
  ListChecks,
  Plus,
  Save,
  Users,
} from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import StatCard from "@/components/yonetim/StatCard";
import EmptyState from "@/components/yonetim/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { tierLabel, tierTone } from "@/lib/yonetim/format";

const TIER_OPTIONS = [
  { value: "free", label: "Ücretsiz (herkes)" },
  { value: "premium", label: "Premium" },
  { value: "vip", label: "VIP" },
] as const;

const UNLOCK_OPTIONS = [
  { value: "complete", label: "Tamamlayınca açılır (sırayla)" },
  { value: "drip", label: "Zamana bağlı (drip)" },
  { value: "manual", label: "Kumru manuel açar" },
  { value: "open", label: "Hepsi açık (kilitsiz)" },
] as const;

function unlockLabel(v: string | null | undefined): string {
  return UNLOCK_OPTIONS.find((o) => o.value === v)?.label ?? "-";
}

/** Admin oturumunu doğrular; admin değilse hata fırlatır. */
async function requireAdmin() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("yetkisiz");
  }
  return payload;
}

/** Program (course) genel alanlarını günceller. */
async function updateCourse(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  if (!id) return;

  const payload = await requireAdmin();

  await payload.update({
    collection: "courses",
    id,
    data: {
      title: String(formData.get("title") || "").trim(),
      description: String(formData.get("description") || "").trim() || null,
      requiredTier: String(formData.get("requiredTier") || "premium") as
        | "free"
        | "premium"
        | "vip",
      unlockRule: String(formData.get("unlockRule") || "complete") as
        | "complete"
        | "drip"
        | "manual"
        | "open",
      published: formData.get("published") === "on",
    },
    overrideAccess: true,
  });

  revalidatePath(`/yonetim/programlar/${id}`);
  revalidatePath("/yonetim/programlar");
}

/** Bu programa yeni bir aşama ekler. */
async function createStage(formData: FormData) {
  "use server";

  const programId = String(formData.get("programId") || "");
  if (!programId) return;

  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const payload = await requireAdmin();

  const orderRaw = String(formData.get("order") || "").trim();
  const minutesRaw = String(formData.get("estimatedMinutes") || "").trim();

  await payload.create({
    collection: "program-stages",
    data: {
      program: Number(programId),
      order: orderRaw ? Number(orderRaw) : 1,
      title,
      summary: String(formData.get("summary") || "").trim() || null,
      content: String(formData.get("content") || "").trim() || null,
      estimatedMinutes: minutesRaw ? Number(minutesRaw) : null,
    },
    overrideAccess: true,
  });

  revalidatePath(`/yonetim/programlar/${programId}`);
}

export default async function ProgramDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payload = await getPayload({ config });

  const course = await payload
    .findByID({ collection: "courses", id, depth: 0, locale: "tr" })
    .catch(() => null);

  if (!course) notFound();

  const [stages, enrolls] = await Promise.all([
    payload.find({
      collection: "program-stages",
      where: { program: { equals: id } },
      sort: "order",
      depth: 0,
      locale: "tr",
      limit: 200,
    }),
    payload.find({
      collection: "enrollments",
      where: { program: { equals: id } },
      depth: 1,
      limit: 200,
    }),
  ]);

  const c = course as {
    id: number;
    title?: string | null;
    description?: string | null;
    requiredTier?: string | null;
    unlockRule?: string | null;
    published?: boolean | null;
  };

  const tier = c.requiredTier ?? "premium";
  const completedEnrolls = enrolls.docs.filter(
    (e) => (e as { status?: string }).status === "completed"
  ).length;

  return (
    <div>
      <PageHeader
        title={c.title || "Program"}
        subtitle={c.published ? "Yayında" : "Taslak (yayında değil)"}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/yonetim/programlar">
              <ArrowLeft className="size-4" />
              Programlara dön
            </Link>
          </Button>
        }
      />

      {/* Üst özet kartları */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Gereken Üyelik"
          value={tierLabel(tier)}
          icon={GraduationCap}
          tone={tier === "vip" ? "gold" : "default"}
          hint={unlockLabel(c.unlockRule)}
        />
        <StatCard
          label="Aşama Sayısı"
          value={stages.totalDocs}
          icon={Layers}
        />
        <StatCard
          label="Kayıtlı Üye"
          value={enrolls.totalDocs}
          icon={Users}
          tone={enrolls.totalDocs > 0 ? "good" : "default"}
          hint={`${completedEnrolls} tamamladı`}
        />
      </div>

      <Tabs defaultValue="genel">
        <TabsList>
          <TabsTrigger value="genel">Genel</TabsTrigger>
          <TabsTrigger value="asamalar">
            Aşamalar ({stages.totalDocs})
          </TabsTrigger>
          <TabsTrigger value="kayitlar">
            Kayıtlar ({enrolls.totalDocs})
          </TabsTrigger>
        </TabsList>

        {/* ---------- GENEL ---------- */}
        <TabsContent value="genel">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Programı Düzenle
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Program adını, açıklamasını ve erişim kurallarını güncelleyin.
            </p>

            <form action={updateCourse} className="mt-6 space-y-5">
              <input type="hidden" name="id" value={c.id} />

              <div className="space-y-2">
                <Label htmlFor="title">Program Adı</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={c.title ?? ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={c.description ?? ""}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="requiredTier">Gereken Üyelik</Label>
                  <Select name="requiredTier" defaultValue={tier}>
                    <SelectTrigger id="requiredTier">
                      <SelectValue placeholder="Seviye seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIER_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unlockRule">Aşama Açılma Kuralı</Label>
                  <Select
                    name="unlockRule"
                    defaultValue={c.unlockRule ?? "complete"}
                  >
                    <SelectTrigger id="unlockRule">
                      <SelectValue placeholder="Kural seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNLOCK_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-foreground">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={Boolean(c.published)}
                  className="size-4 rounded border-input text-primary focus-visible:ring-1 focus-visible:ring-ring"
                />
                Yayında
              </label>

              <div className="flex justify-end">
                <Button type="submit">
                  <Save className="size-4" />
                  Kaydet
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* ---------- AŞAMALAR ---------- */}
        <TabsContent value="asamalar">
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card shadow-sm">
              {stages.docs.length === 0 ? (
                <EmptyState
                  icon={Layers}
                  title="Aşama yok"
                  description="Bu programa henüz bir aşama eklenmemiş. Aşağıdaki formdan ilk aşamayı ekleyin."
                  className="border-0"
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-right">Sıra</TableHead>
                      <TableHead>Başlık</TableHead>
                      <TableHead>Özet</TableHead>
                      <TableHead className="text-right">Süre (dk)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stages.docs.map((stage) => {
                      const s = stage as {
                        id: number;
                        order?: number | null;
                        title?: string | null;
                        summary?: string | null;
                        estimatedMinutes?: number | null;
                      };
                      return (
                        <TableRow key={s.id}>
                          <TableCell className="text-right font-medium tabular-nums">
                            {s.order ?? "-"}
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            {s.title || "-"}
                          </TableCell>
                          <TableCell className="max-w-md truncate text-muted-foreground">
                            {s.summary || "-"}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-muted-foreground">
                            {typeof s.estimatedMinutes === "number"
                              ? s.estimatedMinutes
                              : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Yeni aşama ekle */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">
                Yeni Aşama Ekle
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Aşama sırasını ve içeriğini belirleyin.
              </p>

              <form action={createStage} className="mt-6 space-y-5">
                <input type="hidden" name="programId" value={c.id} />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="order">Sıra No</Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      min={1}
                      defaultValue={stages.totalDocs + 1}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="stage-title">Aşama Başlığı</Label>
                    <Input id="stage-title" name="title" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Kısa Özet</Label>
                  <textarea
                    id="summary"
                    name="summary"
                    rows={2}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">İçerik (metin)</Label>
                  <textarea
                    id="content"
                    name="content"
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2 sm:max-w-xs">
                  <Label htmlFor="estimatedMinutes">Tahmini Süre (dk)</Label>
                  <Input
                    id="estimatedMinutes"
                    name="estimatedMinutes"
                    type="number"
                    min={0}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Plus className="size-4" />
                    Aşama Ekle
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </TabsContent>

        {/* ---------- KAYITLAR ---------- */}
        <TabsContent value="kayitlar">
          <div className="rounded-2xl border bg-card shadow-sm">
            {enrolls.docs.length === 0 ? (
              <EmptyState
                icon={ListChecks}
                title="Kayıt yok"
                description="Bu programa henüz kimse kayıtlı değil."
                className="border-0"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Üye</TableHead>
                    <TableHead className="text-right">
                      Tamamlanan Aşama
                    </TableHead>
                    <TableHead className="text-right">Mevcut Aşama</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolls.docs.map((enr) => {
                    const e = enr as {
                      id: number;
                      member?:
                        | number
                        | {
                            id: number;
                            name?: string | null;
                            email?: string | null;
                          }
                        | null;
                      completedStages?: number[] | null;
                      currentStage?: number | null;
                      status?: string | null;
                    };
                    const memberName =
                      e.member && typeof e.member === "object"
                        ? e.member.name || e.member.email || "Üye"
                        : "Üye";
                    const completedCount = Array.isArray(e.completedStages)
                      ? e.completedStages.length
                      : 0;
                    return (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium text-foreground">
                          {memberName}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {completedCount}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {e.currentStage ?? "-"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                              e.status === "completed"
                                ? "bg-emerald/15 text-emerald"
                                : "bg-primary/10 text-primary"
                            )}
                          >
                            {e.status === "completed"
                              ? "Tamamlandı"
                              : "Devam ediyor"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
