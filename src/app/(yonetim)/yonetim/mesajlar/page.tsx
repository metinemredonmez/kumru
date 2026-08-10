import { getPayload } from "payload";
import config from "@payload-config";
import { MailOpen } from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import EmptyState from "@/components/yonetim/EmptyState";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatDate, formatNumber } from "@/lib/yonetim/format";

export default async function MesajlarPage() {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "contact-messages",
    limit: 100,
    sort: "-createdAt",
    depth: 0,
  });

  const messages = result.docs as Array<{
    id: string | number;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    subject?: string | null;
    message?: string | null;
    createdAt?: string | null;
  }>;

  const total = result.totalDocs;

  return (
    <div>
      <PageHeader
        title="İletişim Mesajları"
        subtitle={`Toplam ${formatNumber(total)} mesaj`}
      />

      {messages.length === 0 ? (
        <EmptyState
          icon={MailOpen}
          title="Mesaj bulunamadı"
          description="Henüz iletişim formundan gelen bir mesaj yok."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Mesaj</TableHead>
                <TableHead className="text-right">Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((m) => (
                <TableRow key={String(m.id)}>
                  <TableCell className="align-top font-medium text-foreground">
                    {m.name || "-"}
                  </TableCell>
                  <TableCell className="align-top text-muted-foreground">
                    {m.email ? (
                      <a
                        href={`mailto:${m.email}`}
                        className="hover:text-primary hover:underline"
                      >
                        {m.email}
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="max-w-md align-top">
                    {m.subject && (
                      <span className="mb-0.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {m.subject}
                      </span>
                    )}
                    <span
                      className="block truncate text-foreground"
                      title={m.message ?? undefined}
                    >
                      {m.message || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap align-top text-right tabular-nums text-muted-foreground">
                    {formatDate(m.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
