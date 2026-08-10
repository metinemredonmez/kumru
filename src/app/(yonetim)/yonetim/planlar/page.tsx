import Link from "next/link";
import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import type { MembershipPlan } from "@/payload-types";
import {
  CreditCard,
  Star,
  Layers,
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
import { tierLabel, tierTone } from "@/lib/yonetim/format";

export const dynamic = "force-dynamic";

const BASE = "/yonetim/planlar";

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";
const textareaClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

const INTERVAL_LABEL: Record<string, string> = {
  monthly: "Aylık",
  yearly: "Yıllık",
  once: "Tek seferlik",
};

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

// Satır-satır textarea → nesne dizisi ({ item })
const parseFeatures = (fd: FormData): { item: string }[] =>
  str(fd, "features")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((item) => ({ item }));

function done() {
  revalidatePath(BASE);
  redirect(BASE);
}

// ── Oluştur / Güncelle / Sil (server actions) ──────────────────────────────
async function createPlan(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const name = str(formData, "name");
  if (!name) return;
  await payload.create({
    collection: "membership-plans",
    locale: "tr",
    overrideAccess: true,
    data: {
      name,
      tier: (str(formData, "tier") || "free") as MembershipPlan["tier"],
      price: str(formData, "price"),
      priceAmount: num(formData, "priceAmount"),
      interval: (str(formData, "interval") ||
        "monthly") as MembershipPlan["interval"],
      features: parseFeatures(formData),
      highlighted: formData.get("highlighted") === "on",
      order: num(formData, "order"),
    },
  });
  done();
}

async function updatePlan(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const id = Number(formData.get("id"));
  const name = str(formData, "name");
  if (!id || !name) return;
  await payload.update({
    collection: "membership-plans",
    id,
    locale: "tr",
    overrideAccess: true,
    data: {
      name,
      tier: (str(formData, "tier") || "free") as MembershipPlan["tier"],
      price: str(formData, "price"),
      priceAmount: num(formData, "priceAmount"),
      interval: (str(formData, "interval") ||
        "monthly") as MembershipPlan["interval"],
      features: parseFeatures(formData),
      highlighted: formData.get("highlighted") === "on",
      order: num(formData, "order"),
    },
  });
  done();
}

async function deletePlan(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const id = Number(formData.get("id"));
  if (id) {
    await payload.delete({
      collection: "membership-plans",
      id,
      overrideAccess: true,
    });
  }
  done();
}

// ── Sayfa ──────────────────────────────────────────────────────────────────
export default async function PlanlarPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const sp = await searchParams;
  const editId = sp.edit ? Number(sp.edit) : null;

  const payload = await getPayload({ config });

  const list = await payload.find({
    collection: "membership-plans",
    locale: "tr",
    depth: 0,
    limit: 200,
    sort: "order",
  });
  const plans = list.docs as MembershipPlan[];

  const highlightedCount = plans.filter((p) => p.highlighted).length;

  const editPlan =
    editId != null
      ? ((await payload
          .findByID({
            collection: "membership-plans",
            id: editId,
            locale: "tr",
            depth: 0,
          })
          .catch(() => null)) as MembershipPlan | null)
      : null;
  const editing = !!editPlan;

  const featuresText =
    editPlan?.features
      ?.map((f) => f.item ?? "")
      .filter((s) => s.length > 0)
      .join("\n") ?? "";

  return (
    <div>
      <PageHeader
        title="Üyelik Planları"
        subtitle="Ücretsiz, Premium ve VIP üyelik planlarını oluştur ve düzenle."
      />

      {/* KPI'lar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Toplam Plan" value={plans.length} icon={Layers} />
        <StatCard
          label="Öne Çıkan"
          value={highlightedCount}
          icon={Star}
          tone="gold"
        />
        <StatCard
          label="Ücretli Plan"
          value={plans.filter((p) => p.tier !== "free").length}
          icon={CreditCard}
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
            {editing ? "Planı Düzenle" : "Yeni Plan"}
          </h2>
        </div>

        <form
          key={editPlan?.id ?? "new"}
          action={editing ? updatePlan : createPlan}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {editPlan && <input type="hidden" name="id" value={editPlan.id} />}

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="name">Plan Adı</Label>
            <Input
              id="name"
              name="name"
              defaultValue={editPlan?.name ?? ""}
              placeholder="Örn. Premium Üyelik"
              required
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tier">Seviye</Label>
            <select
              id="tier"
              name="tier"
              className={fieldClass}
              defaultValue={editPlan?.tier ?? "free"}
            >
              <option value="free">Ücretsiz</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="interval">Periyot</Label>
            <select
              id="interval"
              name="interval"
              className={fieldClass}
              defaultValue={editPlan?.interval ?? "monthly"}
            >
              <option value="monthly">Aylık</option>
              <option value="yearly">Yıllık</option>
              <option value="once">Tek seferlik / süresiz</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Fiyat (görünen)</Label>
            <Input
              id="price"
              name="price"
              defaultValue={editPlan?.price ?? ""}
              placeholder="Örn. ₺750 / ay"
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="priceAmount">Fiyat (sayı, TL)</Label>
            <Input
              id="priceAmount"
              name="priceAmount"
              type="number"
              step="any"
              defaultValue={editPlan?.priceAmount ?? 0}
              placeholder="Örn. 750"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="features">Özellikler (her satıra bir özellik)</Label>
            <textarea
              id="features"
              name="features"
              rows={5}
              defaultValue={featuresText}
              className={textareaClass}
              placeholder={"Sınırsız içerik erişimi\nHaftalık canlı seans\nÖzel topluluk"}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="order">Sıra</Label>
            <Input
              id="order"
              name="order"
              type="number"
              defaultValue={editPlan?.order ?? 0}
            />
          </div>

          <label className="flex items-end gap-2 pb-2">
            <input
              type="checkbox"
              name="highlighted"
              defaultChecked={editPlan?.highlighted ?? false}
              className="size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span className="text-sm text-foreground">Öne çıkan plan</span>
          </label>

          <div className="mt-1 flex items-center gap-2 sm:col-span-2">
            <Button type="submit">
              {editing ? <Save className="size-4" /> : <Plus className="size-4" />}
              {editing ? "Kaydet" : "Plan Ekle"}
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
        {plans.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="Plan yok"
            description="Henüz üyelik planı bulunmuyor. Yukarıdaki formdan ilk planı oluşturabilirsiniz."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>Seviye</TableHead>
                <TableHead>Fiyat</TableHead>
                <TableHead>Periyot</TableHead>
                <TableHead>Öne çıkan?</TableHead>
                <TableHead className="text-right">Sıra</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{p.name}</div>
                    {p.features && p.features.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {p.features.length} özellik
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        tierTone(p.tier)
                      )}
                    >
                      {tierLabel(p.tier)}
                    </span>
                  </TableCell>
                  <TableCell className="tabular-nums text-foreground">
                    {p.price || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {INTERVAL_LABEL[p.interval ?? "monthly"] ??
                      p.interval ??
                      "-"}
                  </TableCell>
                  <TableCell>
                    {p.highlighted ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber/15 px-2.5 py-0.5 text-xs font-semibold text-amber">
                        <Star className="size-3" /> Evet
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
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`${BASE}?edit=${p.id}`}>
                          <Pencil className="size-3.5" /> Düzenle
                        </Link>
                      </Button>
                      <form action={deletePlan} className="inline">
                        <input type="hidden" name="id" value={p.id} />
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
