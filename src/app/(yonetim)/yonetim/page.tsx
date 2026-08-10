import Link from "next/link";
import {
  Users,
  CreditCard,
  Wallet,
  MessageSquare,
  Clock,
  AlarmClock,
  UserPlus,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { getPayload } from "payload";
import config from "@payload-config";
import PageHeader from "@/components/yonetim/PageHeader";
import StatCard from "@/components/yonetim/StatCard";
import EmptyState from "@/components/yonetim/EmptyState";
import { ChartArea } from "@/components/ui/chart-area";
import {
  formatMoney,
  formatDate,
  formatDateTime,
  formatNumber,
  tierLabel,
  tierTone,
  initials,
} from "@/lib/yonetim/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const MONTH_LABELS = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];

export default async function DashboardPage() {
  const payload = await getPayload({ config });

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [
    totalMembers,
    activeSubsCount,
    pendingSubsCount,
    totalMessages,
    newMembers7dCount,
    freeCount,
    premiumCount,
    vipCount,
    activeSubs,
    expiringSubs,
    membersForChart,
    recentMembers,
    recentMessages,
  ] = await Promise.all([
    payload.count({ collection: "members" }),
    payload.count({
      collection: "subscriptions",
      where: { status: { equals: "active" } },
    }),
    payload.count({
      collection: "subscriptions",
      where: { status: { equals: "pending" } },
    }),
    payload.count({ collection: "contact-messages" }),
    payload.count({
      collection: "members",
      where: { createdAt: { greater_than_equal: sevenDaysAgo.toISOString() } },
    }),
    payload.count({
      collection: "members",
      where: { membershipTier: { equals: "free" } },
    }),
    payload.count({
      collection: "members",
      where: { membershipTier: { equals: "premium" } },
    }),
    payload.count({
      collection: "members",
      where: { membershipTier: { equals: "vip" } },
    }),
    payload.find({
      collection: "subscriptions",
      where: { status: { equals: "active" } },
      limit: 1000,
      depth: 0,
      pagination: false,
    }),
    payload.count({
      collection: "subscriptions",
      where: {
        and: [
          { status: { equals: "active" } },
          { expiresAt: { greater_than_equal: now.toISOString() } },
          { expiresAt: { less_than_equal: in30Days.toISOString() } },
        ],
      },
    }),
    payload.find({
      collection: "members",
      limit: 2000,
      depth: 0,
      pagination: false,
      sort: "createdAt",
    }),
    payload.find({
      collection: "members",
      limit: 5,
      depth: 0,
      sort: "-createdAt",
    }),
    payload.find({
      collection: "contact-messages",
      limit: 5,
      depth: 0,
      sort: "-createdAt",
    }),
  ]);

  const monthlyRevenue = activeSubs.docs.reduce(
    (sum, s) => sum + (typeof s.amount === "number" ? s.amount : 0),
    0
  );

  // Üye seviye dağılımı
  const tierTotal = freeCount.totalDocs + premiumCount.totalDocs + vipCount.totalDocs;
  const tierRows: { key: string; label: string; count: number }[] = [
    { key: "free", label: tierLabel("free"), count: freeCount.totalDocs },
    { key: "premium", label: tierLabel("premium"), count: premiumCount.totalDocs },
    { key: "vip", label: tierLabel("vip"), count: vipCount.totalDocs },
  ];

  // Son ~8 dönem üye büyümesi (aylık)
  const buckets: { key: string; label: string; count: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: MONTH_LABELS[d.getMonth()],
      count: 0,
    });
  }
  const bucketIndex = new Map(buckets.map((b, i) => [b.key, i]));
  for (const m of membersForChart.docs) {
    if (!m.createdAt) continue;
    const d = new Date(m.createdAt);
    if (Number.isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const idx = bucketIndex.get(key);
    if (idx !== undefined) buckets[idx].count += 1;
  }
  const chartData = buckets.map((b) => ({ ay: b.label, uye: b.count }));

  const actions = [
    {
      key: "messages",
      label: "Yeni Mesaj",
      value: totalMessages.totalDocs,
      icon: MessageSquare,
      href: "/yonetim/mesajlar",
      tone: "bg-primary/10 text-primary",
    },
    {
      key: "pending",
      label: "Bekleyen Abonelik",
      value: pendingSubsCount.totalDocs,
      icon: Clock,
      href: "/yonetim/abonelikler",
      tone: "bg-amber/15 text-amber",
    },
    {
      key: "expiring",
      label: "30 Günde Bitiyor",
      value: expiringSubs.totalDocs,
      icon: AlarmClock,
      href: "/yonetim/abonelikler",
      tone: "bg-rose/15 text-rose",
    },
    {
      key: "newmembers",
      label: "Son 7 Gün Yeni Üye",
      value: newMembers7dCount.totalDocs,
      icon: UserPlus,
      href: "/yonetim/uyeler",
      tone: "bg-emerald/15 text-emerald",
    },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Merhaba Kumru 👋" />

      {/* Bekleyen aksiyonlar şeridi */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {actions.map((a) => (
          <Link
            key={a.key}
            href={a.href}
            className="group flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-colors hover:border-primary/40"
          >
            <span
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-xl",
                a.tone
              )}
            >
              <a.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <div className="text-xl font-bold tabular-nums leading-none">
                {formatNumber(a.value)}
              </div>
              <div className="mt-1 truncate text-xs text-muted-foreground">
                {a.label}
              </div>
            </div>
            <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      {/* KPI kartları */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Toplam Üye"
          value={formatNumber(totalMembers.totalDocs)}
          icon={Users}
          hint="Kayıtlı üye"
        />
        <StatCard
          label="Aktif Abonelik"
          value={formatNumber(activeSubsCount.totalDocs)}
          icon={CreditCard}
          tone="good"
          hint="Şu an aktif"
        />
        <StatCard
          label="Aylık Gelir ≈"
          value={formatMoney(monthlyRevenue)}
          icon={Wallet}
          tone="gold"
          hint="Aktif aboneliklerden"
        />
        <StatCard
          label="Yeni Mesaj"
          value={formatNumber(totalMessages.totalDocs)}
          icon={MessageSquare}
          hint="İletişim mesajı"
        />
      </div>

      {/* Grafik + Seviye dağılımı */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Üye Büyümesi</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Son 8 ayda yeni üye kayıtları
              </p>
            </div>
          </div>
          <ChartArea data={chartData} dataKey="uye" xKey="ay" height={280} />
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold">Üye Seviye Dağılımı</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formatNumber(tierTotal)} üye
            </p>
          </div>
          <div className="space-y-4">
            {tierRows.map((row) => {
              const pct = tierTotal > 0 ? Math.round((row.count / tierTotal) * 100) : 0;
              return (
                <div key={row.key}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        tierTone(row.key)
                      )}
                    >
                      {row.label}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatNumber(row.count)}{" "}
                      <span className="text-xs">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        row.key === "vip"
                          ? "bg-amber"
                          : row.key === "premium"
                            ? "bg-primary"
                            : "bg-muted-foreground/40"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Son üyeler + Son mesajlar */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Son Üyeler</h2>
            <Link
              href="/yonetim/uyeler"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Tümü <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {recentMembers.docs.length === 0 ? (
            <EmptyState
              title="Henüz üye yok"
              description="Yeni kayıtlar burada görünecek."
              icon={Users}
            />
          ) : (
            <ul className="divide-y">
              {recentMembers.docs.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {initials(m.name || m.email)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {m.name || m.email}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {m.email}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        tierTone(m.membershipTier)
                      )}
                    >
                      {tierLabel(m.membershipTier)}
                    </span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {formatDate(m.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Son Mesajlar</h2>
            <Link
              href="/yonetim/mesajlar"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Tümü <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {recentMessages.docs.length === 0 ? (
            <EmptyState
              title="Henüz mesaj yok"
              description="Gelen iletişim mesajları burada görünecek."
              icon={Inbox}
            />
          ) : (
            <ul className="divide-y">
              {recentMessages.docs.map((msg) => (
                <li key={msg.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="truncate text-sm font-medium">{msg.name}</div>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {formatDateTime(msg.createdAt)}
                    </span>
                  </div>
                  {msg.subject && (
                    <div className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
                      {msg.subject}
                    </div>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {msg.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
