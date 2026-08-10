import type { Metadata } from "next";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import "../(frontend)/globals.css";
import AdminShell from "@/components/yonetim/AdminShell";

export const metadata: Metadata = {
  title: "Kumru Yönetim",
  description: "Kumru yönetim paneli",
};

export default async function YonetimLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });

  if (!user || (user as { collection?: string }).collection !== "users") {
    redirect("/admin/login");
  }

  const admin = {
    name: (user as { name?: string | null }).name ?? null,
    email: (user as { email: string }).email,
    role: (user as { role?: string | null }).role ?? undefined,
  };

  return (
    <html lang="tr">
      <body className="antialiased">
        <AdminShell user={admin}>{children}</AdminShell>
      </body>
    </html>
  );
}
