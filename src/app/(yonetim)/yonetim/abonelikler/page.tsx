import Link from "next/link";
import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayload, type Where } from "payload";
import config from "@payload-config";
import type { Member, Subscription } from "@/payload-types";
import {
  CreditCard,
  BadgeCheck,
  Clock3,
  Wallet,
  Plus,
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
import {
  formatMoney,
  formatDate,
  statusLabel,
  statusTone,
  tierLabel,
  tierTone,
  initials,
} from "@/lib/yonetim/format";

type StatusFilter = "all" | "active" | "pending" | "expiring";

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "active", label: "Aktif" },
  { key: "pending", label: "Beklemede" },
  { key: "expiring", label: "Süresi Dolacak (30g)" },
];

const PROVIDER_LABEL: Record<string, string> = {
  manual: "Elle",
  iyzico: "İyzico",
  stripe: "Stripe",
};

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

// ── Yeni abonelik oluşturma (server action) ──────────────────────────────
async function createSubscription(formData: FormData) {
  "use server";

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }

  const memberIdRaw = String(formData.get("memberId") || "").trim();
  const memberEmail = String(formData.get("memberEmail") || "").trim();
  const tier = String(formData.get("tier") || "premium") as Subscription["tier"];
  const currency = String(
    formData.get("currency") || "TRY"
  ) as NonNullable<Subscription["currency"]>;
  const amountRaw = String(formData.get("amount") || "").trim();
  const expiresAt = String(formData.get("expiresAt") || "").trim();

  // Üyeyi çöz: önce e-posta (girildiyse), sonra seçili üye.
  let memberId: number | null = null;
  if (memberEmail) {
    const found = await payload.find({
      collection: "members",
      where: { email: { equals: memberEmail } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    memberId = found.docs[0]?.id ?? null;
  }
  if (!memberId && memberIdRaw) {
    memberId = Number(memberIdRaw) || null;
  }
  if (!memberId) {
    // Üye bulunamazsa sessizce çık (form tekrar denenebilir).
    return;
  }

  const amount =
    amountRaw !== "" && !Number.isNaN(Number(amountRaw))
      ? Number(amountRaw)
      : undefined;

  await payload.create({
    collection: "subscriptions",
    data: {
      member: memberId,
      tier,
      status: "active",
      provider: "manual",
      amount,
      currency,
      startedAt: new Date().toISOString(),
      expiresAt: expiresAt || undefined,
    },
    overrideAccess: true,
  });

  revalidatePath("/yonetim/abonelikler");
}

// ── Sayfa ────────────────────────────────────────────────────────────────
export default async function AboneliklerPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeTab: StatusFilter = TABS.some((t) => t.key === status)
    ? (status as StatusFilter)
    : "all";

  const payload = await getPayload({ config });

  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Sekmeye göre filtre
  let where: Where = {};
  if (activeTab === "active") {
    where = { status: { equals: "active" } };
  } else if (activeTab === "pending") {
    where = { status: { equals: "pending" } };
  } else if (activeTab === "expiring") {
    where = {
      and: [
        { status: { equals: "active" } },
        { expiresAt: { greater_than_equal: now.toISOString() } },
        { expiresAt: { less_than_equal: in30.toISOString() } },
      ],
    };
  }

  const [list, recentMembers, totalCount, activeCount, pendingCount, expiringAgg, activeForRevenue] =
    await Promise.all([
      payload.find({
        collection: "subscriptions",
        where,
        depth: 1,
        limit: 100,
        sort: "-createdAt",
      }),
      payload.find({
        collection: "members",
        depth: 0,
        limit: 100,
        sort: "-createdAt",
      }),
      payload.count({ collection: "subscriptions" }),
      payload.count({
        collection: "subscriptions",
        where: { status: { equals: "active" } },
      }),
      payload.count({
        collection: "subscriptions",
        where: { status: { equals: "pending" } },
      }),
      payload.count({
        collection: "subscriptions",
        where: {
          and: [
            { status: { equals: "active" } },
            { expiresAt: { greater_than_equal: now.toISOString() } },
            { expiresAt: { less_than_equal: in30.toISOString() } },
          ],
        },
      }),
      payload.find({
        collection: "subscriptions",
        where: { status: { equals: "active" } },
        depth: 0,
        limit: 1000,
      }),
    ]);

  const subs = list.docs as Subscription[];
  const members = recentMembers.docs as Member[];

  const totalRevenue = (activeForRevenue.docs as Subscription[]).reduce(
    (sum, s) => sum + (typeof s.amount === "number" ? s.amount : 0),
    0
  );

  return (
    <>
      <PageHeader
        title="Abonelikler"
        subtitle="Üye aboneliklerini görüntüle ve elle yeni abonelik tanımla."
      />

      {/* KPI'lar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Toplam Abonelik"
          value={totalCount.totalDocs}
          icon={CreditCard}
        />
        <StatCard
          label="Aktif"
          value={activeCount.totalDocs}
          icon={BadgeCheck}
          tone="good"
        />
        <StatCard
          label="Aktif Gelir"
          value={formatMoney(totalRevenue)}
          icon={Wallet}
          tone="gold"
          hint="Aktif aboneliklerin toplamı"
        />
        <StatCard
          label="30 Günde Bitecek"
          value={expiringAgg.totalDocs}
          icon={Clock3}
          tone="warn"
        />
      </div>

      {/* Yeni abonelik formu */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Plus className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Yeni Abonelik
            </h2>
            <p className="text-xs text-muted-foreground">
              Oluşturulan abonelik &quot;Aktif&quot; olur ve üyenin seviyesi otomatik
              güncellenir.
            </p>
          </div>
        </div>

        <form
          action={createSubscription}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6"
        >
          <div className="flex flex-col gap-1.5 sm:col-span-2 xl:col-span-2">
            <Label htmlFor="memberId">Üye</Label>
            <select id="memberId" name="memberId" className={fieldClass} defaultValue="">
              <option value="">Son üyelerden seç…</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} · {m.email}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2 xl:col-span-2">
            <Label htmlFor="memberEmail">veya E-posta ile</Label>
            <Input
              id="memberEmail"
              name="memberEmail"
              type="email"
              placeholder="uye@ornek.com"
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-1.5 xl:col-span-1">
            <Label htmlFor="tier">Verilen Seviye</Label>
            <select id="tier" name="tier" className={fieldClass} defaultValue="premium">
              <option value="free">Ücretsiz</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 xl:col-span-1">
            <Label htmlFor="currency">Para Birimi</Label>
            <select id="currency" name="currency" className={fieldClass} defaultValue="TRY">
              <option value="TRY">₺ TRY</option>
              <option value="USD">$ USD</option>
              <option value="CAD">CAD</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 xl:col-span-1">
            <Label htmlFor="amount">Tutar</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="0"
            />
          </div>

          <div className="flex flex-col gap-1.5 xl:col-span-2">
            <Label htmlFor="expiresAt">Bitiş Tarihi</Label>
            <Input id="expiresAt" name="expiresAt" type="date" />
            <span className="text-[11px] text-muted-foreground">
              Boş bırakılırsa süresiz.
            </span>
          </div>

          <div className="flex items-end sm:col-span-2 xl:col-span-3">
            <Button type="submit" className="w-full sm:w-auto">
              <Plus className="size-4" /> Abonelik Ekle
            </Button>
          </div>
        </form>
      </div>

      {/* Sekmeler */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {TABS.map((t) => {
          const isActive = t.key === activeTab;
          const href = t.key === "all" ? "?" : `?status=${t.key}`;
          return (
            <Link
              key={t.key}
              href={href}
              scroll={false}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Tablo */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {subs.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="Abonelik yok"
            description={
              activeTab === "all"
                ? "Henüz abonelik kaydı bulunmuyor. Yukarıdaki formdan elle abonelik ekleyebilirsiniz."
                : "Bu filtreye uyan abonelik bulunamadı."
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Üye</TableHead>
                <TableHead>Verilen Seviye</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Sağlayıcı</TableHead>
                <TableHead className="text-right">Tutar</TableHead>
                <TableHead>Bitiş</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs.map((s) => {
                const member =
                  s.member && typeof s.member === "object"
                    ? (s.member as Member)
                    : null;
                const memberName = member?.name || member?.email || "Üye";
                const memberEmail = member?.email ?? "";
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {initials(memberName)}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate font-medium text-foreground">
                            {memberName}
                          </div>
                          {memberEmail && (
                            <div className="truncate text-xs text-muted-foreground">
                              {memberEmail}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          tierTone(s.tier)
                        )}
                      >
                        {tierLabel(s.tier)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          statusTone(s.status)
                        )}
                      >
                        {statusLabel(s.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {PROVIDER_LABEL[s.provider ?? "manual"] ?? s.provider ?? "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-foreground">
                      {typeof s.amount === "number"
                        ? formatMoney(s.amount, s.currency ?? "TRY")
                        : "-"}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {formatDate(s.expiresAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
