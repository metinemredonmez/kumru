import { getPayload } from "payload";
import config from "@payload-config";
import type { Where } from "payload";
import type { AuditLog } from "@/payload-types";
import { History, Filter } from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import EmptyState from "@/components/yonetim/EmptyState";
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
import { formatDateTime, formatNumber } from "@/lib/yonetim/format";

export const dynamic = "force-dynamic";

const BASE = "/yonetim/audit";

type ActionValue = "created" | "updated" | "deleted";

const ACTION_OPTIONS: { value: ActionValue; label: string }[] = [
  { value: "created", label: "Oluşturuldu" },
  { value: "updated", label: "Güncellendi" },
  { value: "deleted", label: "Silindi" },
];

function actionLabel(a: string | null | undefined): string {
  switch (a) {
    case "created":
      return "Oluşturuldu";
    case "updated":
      return "Güncellendi";
    case "deleted":
      return "Silindi";
    default:
      return a ? String(a) : "-";
  }
}

/** İşlem türü için pill rengi. */
function actionTone(a: string | null | undefined): string {
  switch (a) {
    case "created":
      return "bg-emerald/15 text-emerald";
    case "updated":
      return "bg-amber/15 text-amber";
    case "deleted":
      return "bg-rose/15 text-rose";
    default:
      return "bg-muted text-muted-foreground";
  }
}

type SearchParams = {
  action?: string;
  collection?: string;
};

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const action: "" | ActionValue =
    params.action === "created" ||
    params.action === "updated" ||
    params.action === "deleted"
      ? params.action
      : "";
  const collection = (params.collection ?? "").trim();

  const payload = await getPayload({ config });

  const and: Where[] = [];
  if (action) and.push({ action: { equals: action } });
  if (collection) and.push({ collectionLabel: { equals: collection } });
  const where: Where | undefined = and.length ? { and } : undefined;

  const result = await payload.find({
    collection: "audit-logs",
    where,
    limit: 100,
    sort: "-createdAt",
    depth: 0,
  });

  const logs = result.docs as AuditLog[];

  // Bölüm filtresi için mevcut etiketleri topla.
  const labelResult = await payload.find({
    collection: "audit-logs",
    limit: 500,
    depth: 0,
    sort: "-createdAt",
  });
  const collectionLabels = Array.from(
    new Set(
      (labelResult.docs as AuditLog[])
        .map((d) => d.collectionLabel)
        .filter((l): l is string => Boolean(l))
    )
  ).sort((a, b) => a.localeCompare(b, "tr"));

  return (
    <div>
      <PageHeader
        title="İşlem Kaydı"
        subtitle={`Son ${formatNumber(logs.length)} işlem (en yeni önce)`}
      />

      <form
        method="get"
        action={BASE}
        className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <select
          name="action"
          defaultValue={action}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 sm:w-52"
        >
          <option value="">Tüm işlemler</option>
          {ACTION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          name="collection"
          defaultValue={collection}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 sm:w-52"
        >
          <option value="">Tüm bölümler</option>
          {collectionLabels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className={cn(buttonVariants({ variant: "default" }), "gap-2")}
        >
          <Filter className="size-4" /> Filtrele
        </button>

        {(action || collection) && (
          <a
            href={BASE}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Temizle
          </a>
        )}
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {logs.length === 0 ? (
          <EmptyState
            icon={History}
            title="Kayıt yok"
            description="Seçtiğiniz filtrelere uygun işlem kaydı bulunamadı."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İşlem</TableHead>
                  <TableHead>Bölüm</TableHead>
                  <TableHead>Özet</TableHead>
                  <TableHead>Yapan</TableHead>
                  <TableHead className="text-right">Tarih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          actionTone(log.action)
                        )}
                      >
                        {actionLabel(log.action)}
                      </span>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {log.collectionLabel || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.summary || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.actor || "sistem"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground tabular-nums">
                      {formatDateTime(log.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
