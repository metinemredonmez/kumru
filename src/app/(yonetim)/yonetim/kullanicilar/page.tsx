import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import type { User } from "@/payload-types";
import { ShieldAlert, ShieldCheck, UserPlus, Trash2, Lock } from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
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
import { formatDate, initials } from "@/lib/yonetim/format";

export const dynamic = "force-dynamic";

const BASE = "/yonetim/kullanicilar";

// ── Yetki kontrolü ──────────────────────────────────────────────────────────
async function requireAdmin() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }
  return { payload, user: user as User };
}

// ── Action: Yeni yönetici oluştur ────────────────────────────────────────────
async function createUser(formData: FormData) {
  "use server";
  const { payload } = await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) redirect(BASE);

  await payload.create({
    collection: "users",
    data: {
      name: name || null,
      email,
      password,
    },
    overrideAccess: true,
  });

  revalidatePath(BASE);
  redirect(BASE);
}

// ── Action: Yönetici sil (kendini silme engellenir) ──────────────────────────
async function deleteUser(formData: FormData) {
  "use server";
  const { payload, user } = await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  if (!id) redirect(BASE);

  // Güvenlik: oturum sahibi kendini silemez.
  if (String(user.id) === id) {
    redirect(BASE);
  }

  await payload.delete({
    collection: "users",
    id,
    overrideAccess: true,
  });

  revalidatePath(BASE);
  redirect(BASE);
}

// ── Sayfa ─────────────────────────────────────────────────────────────────────
export default async function KullanicilarPage() {
  const payload = await getPayload({ config });
  const { user: currentUser } = await payload.auth({
    headers: await nextHeaders(),
  });

  const currentId = currentUser ? String((currentUser as User).id) : "";

  const result = await payload.find({
    collection: "users",
    depth: 0,
    limit: 200,
    sort: "-createdAt",
  });

  const users = result.docs as User[];

  const fieldClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

  return (
    <>
      <PageHeader
        title="Kullanıcılar"
        subtitle="Panele girebilen yöneticiler"
      />

      {/* Uyarı notu */}
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber/10 p-4 text-sm">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-amber/15 text-amber">
          <ShieldAlert className="size-4" />
        </span>
        <div className="text-foreground">
          <p className="font-semibold">Dikkatli olun</p>
          <p className="mt-0.5 text-muted-foreground">
            Buradaki hesaplar yönetim paneline tam erişim sahibidir. Yalnızca
            güvendiğiniz kişiler için yönetici ekleyin; güçlü parolalar kullanın.
          </p>
        </div>
      </div>

      {/* Yeni Yönetici Formu */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <UserPlus className="size-4" />
          </span>
          <h2 className="text-base font-semibold text-foreground">
            Yeni Yönetici
          </h2>
        </div>

        <form
          action={createUser}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="u-name">Ad Soyad</Label>
            <Input
              id="u-name"
              name="name"
              type="text"
              placeholder="Kumru Köseler"
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="u-email">E-posta</Label>
            <Input
              id="u-email"
              name="email"
              type="email"
              placeholder="ornek@kumrukoseler.com"
              required
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="u-password">Parola</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="u-password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="En az 8 karakter"
                className={`${fieldClass} pl-9`}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              En az 8 karakter kullanın. Parola sonradan Payload admin
              üzerinden değiştirilebilir.
            </p>
          </div>

          <div className="flex items-end sm:col-span-2">
            <Button type="submit">
              <UserPlus className="size-4" /> Yönetici Ekle
            </Button>
          </div>
        </form>
      </div>

      {/* Yönetici Listesi */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {users.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="Yönetici yok"
            description="Henüz yönetici hesabı bulunmuyor. Yukarıdaki formdan ekleyebilirsiniz."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Kayıt tarihi</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const isSelf = String(u.id) === currentId;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {initials(u.name || u.email)}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 font-medium text-foreground">
                            <span className="truncate">
                              {u.name || "İsimsiz yönetici"}
                            </span>
                            {isSelf && (
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                                Siz
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {formatDate(u.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {isSelf ? (
                        <span className="text-xs text-muted-foreground">
                          Kendinizi silemezsiniz
                        </span>
                      ) : (
                        <form action={deleteUser} className="inline-flex">
                          <input type="hidden" name="id" value={u.id} />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" /> Sil
                          </Button>
                        </form>
                      )}
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
