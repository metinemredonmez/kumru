import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Where } from "payload";
import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import EmptyState from "@/components/yonetim/EmptyState";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
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
  formatDate,
  formatNumber,
  initials,
  tierLabel,
  tierTone,
  type Tier,
} from "@/lib/yonetim/format";

const PAGE_SIZE = 20;

const TIER_OPTIONS: { value: Tier; label: string }[] = [
  { value: "free", label: "Ücretsiz" },
  { value: "premium", label: "Premium" },
  { value: "vip", label: "VIP" },
];

type SearchParams = {
  q?: string;
  tier?: string;
  page?: string;
};

export default async function UyelerPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const tier =
    params.tier === "free" || params.tier === "premium" || params.tier === "vip"
      ? params.tier
      : "";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const payload = await getPayload({ config });

  const and: Where[] = [];
  if (q) {
    and.push({
      or: [{ name: { like: q } }, { email: { like: q } }],
    });
  }
  if (tier) {
    and.push({ membershipTier: { equals: tier } });
  }
  const where: Where | undefined = and.length ? { and } : undefined;

  const result = await payload.find({
    collection: "members",
    where,
    limit: PAGE_SIZE,
    page,
    sort: "-createdAt",
    depth: 0,
  });

  const members = result.docs as Array<{
    id: string | number;
    name?: string | null;
    email: string;
    membershipTier?: string | null;
    membershipExpiresAt?: string | null;
    createdAt?: string | null;
  }>;

  const total = result.totalDocs;
  const totalPages = result.totalPages || 1;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const buildHref = (targetPage: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (tier) sp.set("tier", tier);
    if (targetPage > 1) sp.set("page", String(targetPage));
    const query = sp.toString();
    return query ? `/yonetim/uyeler?${query}` : "/yonetim/uyeler";
  };

  return (
    <div>
      <PageHeader
        title="Üyeler"
        subtitle={`Toplam ${formatNumber(total)} üye`}
      />

      <form
        method="get"
        action="/yonetim/uyeler"
        className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Ad veya e-posta ara..."
            className="pl-9"
          />
        </div>
        <select
          name="tier"
          defaultValue={tier}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 sm:w-48"
        >
          <option value="">Tüm seviyeler</option>
          {TIER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Filtrele
        </button>
      </form>

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Üye bulunamadı"
          description={
            q || tier
              ? "Arama ve filtre kriterlerinize uygun üye yok. Filtreleri değiştirmeyi deneyin."
              : "Henüz kayıtlı üye bulunmuyor."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Seviye</TableHead>
                <TableHead>Üyelik Bitiş</TableHead>
                <TableHead>Kayıt</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={String(m.id)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {initials(m.name || m.email)}
                      </span>
                      <span className="font-medium text-foreground">
                        {m.name || "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {m.email}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        tierTone(m.membershipTier)
                      )}
                    >
                      {tierLabel(m.membershipTier)}
                    </span>
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {m.membershipExpiresAt
                      ? formatDate(m.membershipExpiresAt)
                      : "Süresiz"}
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {formatDate(m.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/yonetim/uyeler/${m.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" })
                      )}
                    >
                      Detay
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {members.length > 0 && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatNumber(from)}–{formatNumber(to)} / {formatNumber(total)}
          </p>
          <div className="flex items-center gap-2">
            {result.hasPrevPage ? (
              <Link
                href={buildHref(page - 1)}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                <ChevronLeft />
                Önceki
              </Link>
            ) : (
              <span
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "pointer-events-none opacity-50"
                )}
              >
                <ChevronLeft />
                Önceki
              </span>
            )}
            <span className="text-sm text-muted-foreground tabular-nums">
              Sayfa {formatNumber(page)} / {formatNumber(totalPages)}
            </span>
            {result.hasNextPage ? (
              <Link
                href={buildHref(page + 1)}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Sonraki
                <ChevronRight />
              </Link>
            ) : (
              <span
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "pointer-events-none opacity-50"
                )}
              >
                Sonraki
                <ChevronRight />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
