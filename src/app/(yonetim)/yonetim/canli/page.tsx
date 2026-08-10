import Link from "next/link";
import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import type { LiveStream } from "@/payload-types";
import {
  Radio,
  Youtube,
  Eye,
  Plus,
  Pencil,
  Trash2,
  Save,
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
import { formatDate, tierLabel, tierTone } from "@/lib/yonetim/format";

export const dynamic = "force-dynamic";

const BASE = "/yonetim/canli";

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";
const textareaClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

const STATUS_LABEL: Record<string, string> = {
  upcoming: "Yaklaşan",
  live: "Canlı",
  ended: "Bitti",
};

function statusTone(status: string | null | undefined) {
  switch (status) {
    case "live":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    case "ended":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-primary/10 text-primary";
  }
}

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

function done() {
  revalidatePath(BASE);
  redirect(BASE);
}

function buildData(fd: FormData) {
  const scheduledAt = str(fd, "scheduledAt");
  return {
    title: str(fd, "title"),
    youtubeUrl: str(fd, "youtubeUrl"),
    description: str(fd, "description") || null,
    scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
    status: (str(fd, "status") || "upcoming") as LiveStream["status"],
    requiredTier: (str(fd, "requiredTier") ||
      "premium") as LiveStream["requiredTier"],
    published: fd.get("published") === "on",
    order: num(fd, "order"),
  };
}

// ── Oluştur / Güncelle / Sil (server actions) ──────────────────────────────
async function createStream(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const title = str(formData, "title");
  const youtubeUrl = str(formData, "youtubeUrl");
  if (!title || !youtubeUrl) return;
  await payload.create({
    collection: "live-streams",
    locale: "tr",
    overrideAccess: true,
    data: buildData(formData),
  });
  done();
}

async function updateStream(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const id = Number(formData.get("id"));
  const title = str(formData, "title");
  const youtubeUrl = str(formData, "youtubeUrl");
  if (!id || !title || !youtubeUrl) return;
  await payload.update({
    collection: "live-streams",
    id,
    locale: "tr",
    overrideAccess: true,
    data: buildData(formData),
  });
  done();
}

async function deleteStream(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const id = Number(formData.get("id"));
  if (id) {
    await payload.delete({
      collection: "live-streams",
      id,
      overrideAccess: true,
    });
  }
  done();
}

// datetime-local input değeri için ISO → "YYYY-MM-DDTHH:mm"
function toLocalInput(d: string | null | undefined): string {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// ── Sayfa ──────────────────────────────────────────────────────────────────
export default async function CanliPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const sp = await searchParams;
  const editId = sp.edit ? Number(sp.edit) : null;

  const payload = await getPayload({ config });

  const list = await payload.find({
    collection: "live-streams",
    locale: "tr",
    depth: 0,
    limit: 200,
    sort: "order",
  });
  const streams = list.docs as LiveStream[];

  const liveCount = streams.filter((s) => s.status === "live").length;
  const publishedCount = streams.filter((s) => s.published).length;

  const editStream =
    editId != null
      ? ((await payload
          .findByID({
            collection: "live-streams",
            id: editId,
            locale: "tr",
            depth: 0,
          })
          .catch(() => null)) as LiveStream | null)
      : null;
  const editing = !!editStream;

  return (
    <div>
      <PageHeader
        title="Canlı Yayın"
        subtitle="YouTube canlı yayınlarını ve videolarını oluştur, düzenle ve yayınla."
      />

      {/* KPI'lar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Toplam Yayın" value={streams.length} icon={Radio} />
        <StatCard
          label="Şu An Canlı"
          value={liveCount}
          icon={Youtube}
          tone="gold"
        />
        <StatCard
          label="Yayında"
          value={publishedCount}
          icon={Eye}
          tone="good"
        />
      </div>

      {/* Yeni / Düzenle formu */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
            {editing ? <Pencil className="size-4" /> : <Plus className="size-4" />}
          </span>
          <h2 className="text-base font-semibold text-foreground">
            {editing ? "Yayını Düzenle" : "Yeni Canlı Yayın"}
          </h2>
        </div>

        <form
          key={editStream?.id ?? "new"}
          action={editing ? updateStream : createStream}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {editStream && <input type="hidden" name="id" value={editStream.id} />}

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              name="title"
              defaultValue={editStream?.title ?? ""}
              placeholder="Örn. Haftalık Canlı Seans"
              required
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="youtubeUrl">YouTube Linki / ID</Label>
            <Input
              id="youtubeUrl"
              name="youtubeUrl"
              defaultValue={editStream?.youtubeUrl ?? ""}
              placeholder="https://youtube.com/watch?v=..."
              required
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="description">Açıklama</Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={editStream?.description ?? ""}
              className={textareaClass}
              placeholder="Yayın hakkında kısa bir açıklama…"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="scheduledAt">Yayın Tarihi/Saati</Label>
            <input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              defaultValue={toLocalInput(editStream?.scheduledAt)}
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">Durum</Label>
            <select
              id="status"
              name="status"
              className={fieldClass}
              defaultValue={editStream?.status ?? "upcoming"}
            >
              <option value="upcoming">Yaklaşan</option>
              <option value="live">Canlı</option>
              <option value="ended">Bitti</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="requiredTier">Gereken Üyelik</Label>
            <select
              id="requiredTier"
              name="requiredTier"
              className={fieldClass}
              defaultValue={editStream?.requiredTier ?? "premium"}
            >
              <option value="free">Ücretsiz</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="order">Sıra</Label>
            <Input
              id="order"
              name="order"
              type="number"
              defaultValue={editStream?.order ?? 0}
            />
          </div>

          <label className="flex items-end gap-2 pb-2">
            <input
              type="checkbox"
              name="published"
              defaultChecked={editStream?.published ?? true}
              className="size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span className="text-sm text-foreground">Yayında</span>
          </label>

          <div className="mt-1 flex items-center gap-2 sm:col-span-2">
            <Button type="submit">
              {editing ? <Save className="size-4" /> : <Plus className="size-4" />}
              {editing ? "Kaydet" : "Yayın Ekle"}
            </Button>
            {editing && (
              <Button asChild variant="outline" type="button">
                <Link href={BASE}>
                  <X className="size-4" /> İptal
                </Link>
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Tablo */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {streams.length === 0 ? (
          <EmptyState
            icon={Radio}
            title="Canlı yayın yok"
            description="Henüz canlı yayın bulunmuyor. Yukarıdaki formdan ilk yayını oluşturabilirsiniz."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Gereken Üyelik</TableHead>
                <TableHead>Yayında?</TableHead>
                <TableHead className="text-right">Sıra</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {streams.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{s.title}</div>
                    {s.youtubeUrl && (
                      <div className="max-w-[240px] truncate text-xs text-muted-foreground">
                        {s.youtubeUrl}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        statusTone(s.status)
                      )}
                    >
                      {STATUS_LABEL[s.status ?? "upcoming"] ?? s.status ?? "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(s.scheduledAt)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        tierTone(s.requiredTier)
                      )}
                    >
                      {tierLabel(s.requiredTier)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        s.published
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {s.published ? "Evet" : "Hayır"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {s.order ?? 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`${BASE}?edit=${s.id}`}>
                          <Pencil className="size-3.5" /> Düzenle
                        </Link>
                      </Button>
                      <form action={deleteStream} className="inline">
                        <input type="hidden" name="id" value={s.id} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
    </div>
  );
}
