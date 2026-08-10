import { getPayload } from "payload";
import config from "@payload-config";
import {
  Users,
  BadgeCheck,
  Wallet,
  GraduationCap,
  TrendingUp,
  PieChart,
} from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import StatCard from "@/components/yonetim/StatCard";
import EmptyState from "@/components/yonetim/EmptyState";
import CsvExportButton from "@/components/yonetim/CsvExportButton";
import { ChartArea } from "@/components/ui/chart-area";
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
  formatNumber,
  tierLabel,
  tierTone,
} from "@/lib/yonetim/format";

export const dynamic = "force-dynamic";

type Tier = "free" | "premium" | "vip";
const TIERS: Tier[] = ["free", "premium", "vip"];

const PROVIDER_LABEL: Record<string, string> = {
  manual: "Elle (admin)",
  iyzico: "İyzico",
  stripe: "Stripe",
};

const TR_MONTHS = [
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

export default async function RaporlarPage() {
  const payload = await getPayload({ config });

  const [membersRes, subsRes, enrollmentsRes, coursesRes, stagesRes] =
    await Promise.all([
      payload.find({
        collection: "members",
        pagination: false,
        depth: 0,
        limit: 0,
      }),
      payload.find({
        collection: "subscriptions",
        where: { status: { equals: "active" } },
        pagination: false,
        depth: 0,
        limit: 0,
      }),
      payload.find({
        collection: "enrollments",
        pagination: false,
        depth: 0,
        limit: 0,
      }),
      payload.find({
        collection: "courses",
        pagination: false,
        depth: 0,
        limit: 0,
      }),
      payload.find({
        collection: "program-stages",
        pagination: false,
        depth: 0,
        limit: 0,
      }),
    ]);

  const members = membersRes.docs as Array<{
    id: string | number;
    membershipTier?: string | null;
    createdAt?: string | null;
  }>;
  const subs = subsRes.docs as Array<{
    id: string | number;
    tier?: string | null;
    provider?: string | null;
    amount?: number | null;
  }>;
  const enrollments = enrollmentsRes.docs as Array<{
    id: string | number;
    program?: string | number | null;
    completedStages?: number[] | null;
  }>;
  const courses = coursesRes.docs as Array<{
    id: string | number;
    title?: string | null;
  }>;
  const stages = stagesRes.docs as Array<{
    id: string | number;
    program?: string | number | null;
  }>;

  // ---- KPI'lar ----
  const totalMembers = members.length;
  const activeSubs = subs.length;
  const monthlyRevenue = subs.reduce(
    (sum, s) => sum + (typeof s.amount === "number" ? s.amount : 0),
    0
  );
  const totalEnrollments = enrollments.length;

  // ---- Üye büyümesi (son 12 ay) ----
  const now = new Date();
  const growthBuckets: { key: string; label: string; count: number }[] = [];
  const bucketIndex = new Map<string, number>();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${TR_MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
    bucketIndex.set(key, growthBuckets.length);
    growthBuckets.push({ key, label, count: 0 });
  }
  for (const m of members) {
    if (!m.createdAt) continue;
    const d = new Date(m.createdAt);
    if (Number.isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const idx = bucketIndex.get(key);
    if (idx !== undefined) growthBuckets[idx].count += 1;
  }
  const growthData = growthBuckets.map((b) => ({
    ay: b.label,
    uye: b.count,
  }));
  const newLast12 = growthBuckets.reduce((s, b) => s + b.count, 0);

  // ---- Seviye dağılımı ----
  const tierCounts: Record<Tier, number> = { free: 0, premium: 0, vip: 0 };
  for (const m of members) {
    const t = (m.membershipTier ?? "free") as Tier;
    if (t in tierCounts) tierCounts[t] += 1;
  }

  // ---- Gelir kırılımı: provider ----
  const byProvider = new Map<string, { count: number; amount: number }>();
  for (const s of subs) {
    const p = s.provider ?? "manual";
    const cur = byProvider.get(p) ?? { count: 0, amount: 0 };
    cur.count += 1;
    cur.amount += typeof s.amount === "number" ? s.amount : 0;
    byProvider.set(p, cur);
  }
  const providerRows = Array.from(byProvider.entries())
    .map(([provider, v]) => ({ provider, ...v }))
    .sort((a, b) => b.amount - a.amount);

  // ---- Gelir kırılımı: tier ----
  const byTier = new Map<string, { count: number; amount: number }>();
  for (const s of subs) {
    const t = s.tier ?? "free";
    const cur = byTier.get(t) ?? { count: 0, amount: 0 };
    cur.count += 1;
    cur.amount += typeof s.amount === "number" ? s.amount : 0;
    byTier.set(t, cur);
  }
  const tierRevenueRows = TIERS.filter((t) => byTier.has(t)).map((t) => ({
    tier: t,
    ...(byTier.get(t) as { count: number; amount: number }),
  }));

  // ---- Program tamamlanma ----
  const stageCountByProgram = new Map<string, number>();
  for (const st of stages) {
    if (st.program == null) continue;
    const pid = String(st.program);
    stageCountByProgram.set(pid, (stageCountByProgram.get(pid) ?? 0) + 1);
  }
  const enrollByProgram = new Map<string, number[]>();
  for (const e of enrollments) {
    if (e.program == null) continue;
    const pid = String(e.program);
    const done = Array.isArray(e.completedStages)
      ? e.completedStages.length
      : 0;
    const total = stageCountByProgram.get(pid) ?? 0;
    const pct = total > 0 ? Math.min(1, done / total) : 0;
    const arr = enrollByProgram.get(pid) ?? [];
    arr.push(pct);
    enrollByProgram.set(pid, arr);
  }
  const completionRows = courses
    .map((c) => {
      const pid = String(c.id);
      const pcts = enrollByProgram.get(pid) ?? [];
      const stageCount = stageCountByProgram.get(pid) ?? 0;
      const avg =
        pcts.length > 0
          ? pcts.reduce((s, p) => s + p, 0) / pcts.length
          : 0;
      return {
        id: pid,
        title: c.title || "-",
        stageCount,
        enrollments: pcts.length,
        avg,
      };
    })
    .sort((a, b) => b.enrollments - a.enrollments);

  // ---- CSV özet satırları ----
  const csvRows: (string | number)[][] = [
    ["Kumru — Rapor Özeti"],
    [],
    ["Genel"],
    ["Metrik", "Değer"],
    ["Toplam üye", totalMembers],
    ["Aktif abonelik", activeSubs],
    ["Aylık gelir (aktif abonelik toplamı)", monthlyRevenue],
    ["Toplam program kaydı", totalEnrollments],
    ["Son 12 ayda yeni üye", newLast12],
    [],
    ["Seviye dağılımı"],
    ["Seviye", "Üye"],
    ...TIERS.map((t) => [tierLabel(t), tierCounts[t]] as (string | number)[]),
    [],
    ["Gelir — sağlayıcı bazında"],
    ["Sağlayıcı", "Abonelik", "Tutar"],
    ...providerRows.map(
      (r) =>
        [
          PROVIDER_LABEL[r.provider] ?? r.provider,
          r.count,
          r.amount,
        ] as (string | number)[]
    ),
    [],
    ["Gelir — seviye bazında"],
    ["Seviye", "Abonelik", "Tutar"],
    ...tierRevenueRows.map(
      (r) => [tierLabel(r.tier), r.count, r.amount] as (string | number)[]
    ),
    [],
    ["Üye büyümesi (aylık)"],
    ["Ay", "Yeni üye"],
    ...growthBuckets.map((b) => [b.label, b.count] as (string | number)[]),
    [],
    ["Program tamamlanma"],
    ["Program", "Aşama", "Kayıt", "Ort. tamamlanma %"],
    ...completionRows.map(
      (r) =>
        [
          r.title,
          r.stageCount,
          r.enrollments,
          Math.round(r.avg * 100),
        ] as (string | number)[]
    ),
  ];

  const tierMax = Math.max(1, ...TIERS.map((t) => tierCounts[t]));

  return (
    <div>
      <PageHeader
        title="Raporlar"
        subtitle="Üyelik, gelir ve program analitiği"
        actions={
          <CsvExportButton
            filename={`kumru-rapor-${now.getFullYear()}-${String(
              now.getMonth() + 1
            ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}.csv`}
            rows={csvRows}
            label="CSV indir"
          />
        }
      />

      {/* KPI'lar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Toplam Üye"
          value={formatNumber(totalMembers)}
          icon={Users}
          hint={`Son 12 ayda +${formatNumber(newLast12)} yeni`}
        />
        <StatCard
          label="Aktif Abonelik"
          value={formatNumber(activeSubs)}
          icon={BadgeCheck}
          tone="good"
        />
        <StatCard
          label="≈ Aylık Gelir"
          value={formatMoney(monthlyRevenue)}
          icon={Wallet}
          tone="gold"
          hint="Aktif aboneliklerin tutar toplamı"
        />
        <StatCard
          label="Program Kaydı"
          value={formatNumber(totalEnrollments)}
          icon={GraduationCap}
        />
      </div>

      {/* Büyüme + seviye dağılımı */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Üye Büyümesi
            </h2>
            <span className="text-xs text-muted-foreground">(son 12 ay)</span>
          </div>
          {newLast12 === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="Veri yok"
              description="Son 12 ayda kayıtlı yeni üye bulunmuyor."
            />
          ) : (
            <ChartArea data={growthData} dataKey="uye" xKey="ay" height={260} />
          )}
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <PieChart className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Seviye Dağılımı
            </h2>
          </div>
          <div className="space-y-4">
            {TIERS.map((t) => {
              const count = tierCounts[t];
              const pct = totalMembers > 0 ? (count / totalMembers) * 100 : 0;
              return (
                <div key={t}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        tierTone(t)
                      )}
                    >
                      {tierLabel(t)}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatNumber(count)}{" "}
                      <span className="text-xs">
                        ({Math.round(pct)}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(count / tierMax) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gelir kırılımı */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Gelir — Sağlayıcı Bazında
          </h2>
          {providerRows.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="Aktif abonelik yok"
              description="Henüz aktif abonelik bulunmuyor."
            />
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sağlayıcı</TableHead>
                    <TableHead className="text-right">Abonelik</TableHead>
                    <TableHead className="text-right">Tutar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providerRows.map((r) => (
                    <TableRow key={r.provider}>
                      <TableCell className="font-medium text-foreground">
                        {PROVIDER_LABEL[r.provider] ?? r.provider}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatNumber(r.count)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-semibold text-foreground">
                        {formatMoney(r.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Gelir — Seviye Bazında
          </h2>
          {tierRevenueRows.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="Aktif abonelik yok"
              description="Henüz aktif abonelik bulunmuyor."
            />
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seviye</TableHead>
                    <TableHead className="text-right">Abonelik</TableHead>
                    <TableHead className="text-right">Tutar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tierRevenueRows.map((r) => (
                    <TableRow key={r.tier}>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            tierTone(r.tier)
                          )}
                        >
                          {tierLabel(r.tier)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatNumber(r.count)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-semibold text-foreground">
                        {formatMoney(r.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Program tamamlanma */}
      <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <GraduationCap className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Program Tamamlanma
          </h2>
        </div>
        {completionRows.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="Program yok"
            description="Henüz tanımlı program bulunmuyor."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead className="text-right">Aşama</TableHead>
                  <TableHead className="text-right">Kayıt</TableHead>
                  <TableHead>Ort. Tamamlanma</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completionRows.map((r) => {
                  const pct = Math.round(r.avg * 100);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-foreground">
                        {r.title}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatNumber(r.stageCount)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatNumber(r.enrollments)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-full max-w-[160px] overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                pct >= 66
                                  ? "bg-emerald"
                                  : pct >= 33
                                    ? "bg-amber"
                                    : "bg-primary"
                              )}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground">
                            {pct}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
