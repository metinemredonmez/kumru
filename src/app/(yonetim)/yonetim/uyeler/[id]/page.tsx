import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers as nextHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  GraduationCap,
  Mail,
  Phone,
  Save,
  Star,
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
import {
  formatDate,
  formatDateTime,
  formatMoney,
  initials,
  statusLabel,
  statusTone,
  tierLabel,
  tierTone,
} from "@/lib/yonetim/format";

/** Payload date → <input type="date"> için "YYYY-MM-DD". */
function toDateInputValue(d: string | number | Date | null | undefined): string {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

/** Üyelik seviyesi + bitiş tarihini günceller (admin doğrulamalı). */
async function updateMembership(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  if (!id) return;

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    return;
  }

  const tier = String(formData.get("membershipTier") || "free");
  const expiresRaw = String(formData.get("membershipExpiresAt") || "").trim();
  const membershipExpiresAt = expiresRaw
    ? new Date(expiresRaw).toISOString()
    : null;

  await payload.update({
    collection: "members",
    id,
    data: {
      membershipTier: tier as "free" | "premium" | "vip",
      membershipExpiresAt,
    },
    overrideAccess: true,
  });

  revalidatePath(`/yonetim/uyeler/${id}`);
  revalidatePath("/yonetim/uyeler");
}

export default async function UyeDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payload = await getPayload({ config });

  const member = await payload
    .findByID({ collection: "members", id, depth: 0 })
    .catch(() => null);

  if (!member) notFound();

  const [subs, enrolls] = await Promise.all([
    payload.find({
      collection: "subscriptions",
      where: { member: { equals: id } },
      sort: "-startedAt",
      depth: 0,
      limit: 100,
    }),
    payload.find({
      collection: "enrollments",
      where: { member: { equals: id } },
      depth: 1,
      limit: 100,
    }),
  ]);

  const m = member as {
    id: number;
    name?: string | null;
    email: string;
    phone?: string | null;
    membershipTier?: string | null;
    membershipExpiresAt?: string | null;
    createdAt?: string | null;
  };

  const activeSubs = subs.docs.filter(
    (s) => (s as { status?: string }).status === "active"
  ).length;
  const activePrograms = enrolls.docs.filter(
    (e) => (e as { status?: string }).status === "active"
  ).length;

  const tier = m.membershipTier ?? "free";

  return (
    <div>
      <PageHeader
        title={m.name || m.email}
        subtitle={m.email}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/yonetim/uyeler">
              <ArrowLeft className="size-4" />
              Üyelere dön
            </Link>
          </Button>
        }
      />

      {/* Üst özet kartları */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Üyelik Seviyesi"
          value={tierLabel(tier)}
          icon={Star}
          tone={tier === "vip" ? "gold" : "default"}
          hint={
            m.membershipExpiresAt
              ? `Bitiş: ${formatDate(m.membershipExpiresAt)}`
              : "Süresiz"
          }
        />
        <StatCard
          label="Aktif Abonelik"
          value={activeSubs}
          icon={CreditCard}
          tone={activeSubs > 0 ? "good" : "default"}
          hint={`${subs.totalDocs} toplam abonelik`}
        />
        <StatCard
          label="Aktif Program"
          value={activePrograms}
          icon={GraduationCap}
          hint={`${enrolls.totalDocs} toplam kayıt`}
        />
      </div>

      <Tabs defaultValue="genel">
        <TabsList>
          <TabsTrigger value="genel">Genel</TabsTrigger>
          <TabsTrigger value="abonelikler">
            Abonelikler ({subs.totalDocs})
          </TabsTrigger>
          <TabsTrigger value="programlar">
            Programlar ({enrolls.totalDocs})
          </TabsTrigger>
        </TabsList>

        {/* ---------- GENEL ---------- */}
        <TabsContent value="genel">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Profil kartı */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {initials(m.name || m.email)}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-foreground">
                    {m.name || "İsimsiz üye"}
                  </h2>
                  <span
                    className={cn(
                      "mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      tierTone(tier)
                    )}
                  >
                    {tierLabel(tier)}
                  </span>
                </div>
              </div>

              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      E-posta
                    </dt>
                    <dd className="truncate font-medium text-foreground">
                      {m.email}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      Telefon
                    </dt>
                    <dd className="font-medium text-foreground">
                      {m.phone || "-"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarClock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      Kayıt Tarihi
                    </dt>
                    <dd className="font-medium text-foreground tabular-nums">
                      {formatDateTime(m.createdAt)}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Düzenle formu */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-3">
              <h2 className="text-lg font-semibold text-foreground">
                Üyeliği Düzenle
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Seviye ve bitiş tarihini elle güncelleyin. Boş bitiş tarihi
                süresiz üyelik demektir.
              </p>

              <form action={updateMembership} className="mt-6 space-y-5">
                <input type="hidden" name="id" value={m.id} />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="membershipTier">Üyelik Seviyesi</Label>
                    <Select name="membershipTier" defaultValue={tier}>
                      <SelectTrigger id="membershipTier">
                        <SelectValue placeholder="Seviye seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Ücretsiz</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="membershipExpiresAt">
                      Üyelik Bitiş Tarihi
                    </Label>
                    <Input
                      id="membershipExpiresAt"
                      name="membershipExpiresAt"
                      type="date"
                      defaultValue={toDateInputValue(m.membershipExpiresAt)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="size-4" />
                    Kaydet
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </TabsContent>

        {/* ---------- ABONELİKLER ---------- */}
        <TabsContent value="abonelikler">
          <div className="rounded-2xl border bg-card shadow-sm">
            {subs.docs.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="Abonelik yok"
                description="Bu üyenin henüz bir aboneliği bulunmuyor."
                className="border-0"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seviye</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Yöntem</TableHead>
                    <TableHead className="text-right">Tutar</TableHead>
                    <TableHead>Bitiş</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subs.docs.map((sub) => {
                    const s = sub as {
                      id: number;
                      tier?: string | null;
                      status?: string | null;
                      provider?: string | null;
                      amount?: number | null;
                      currency?: string | null;
                      expiresAt?: string | null;
                    };
                    return (
                      <TableRow key={s.id}>
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
                        <TableCell className="capitalize text-muted-foreground">
                          {s.provider || "-"}
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                          {typeof s.amount === "number"
                            ? formatMoney(s.amount, s.currency || "TRY")
                            : "-"}
                        </TableCell>
                        <TableCell className="tabular-nums text-muted-foreground">
                          {s.expiresAt ? formatDate(s.expiresAt) : "Süresiz"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* ---------- PROGRAMLAR ---------- */}
        <TabsContent value="programlar">
          <div className="rounded-2xl border bg-card shadow-sm">
            {enrolls.docs.length === 0 ? (
              <EmptyState
                icon={GraduationCap}
                title="Program kaydı yok"
                description="Bu üye henüz bir programa kayıtlı değil."
                className="border-0"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
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
                      program?:
                        | number
                        | { id: number; title?: string | null }
                        | null;
                      completedStages?: number[] | null;
                      currentStage?: number | null;
                      status?: string | null;
                    };
                    const programName =
                      e.program && typeof e.program === "object"
                        ? e.program.title || "Program"
                        : "Program";
                    const completedCount = Array.isArray(e.completedStages)
                      ? e.completedStages.length
                      : 0;
                    return (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium text-foreground">
                          {programName}
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
