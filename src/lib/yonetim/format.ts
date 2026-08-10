/** Yönetim paneli ortak biçimlendirme yardımcıları (Türkçe). */

export type Tier = "free" | "premium" | "vip";
export type MemberStatus =
  | "active"
  | "pending"
  | "expired"
  | "cancelled";

/** Para birimi biçimlendirme. Örn: formatMoney(1500) → "₺1.500,00" */
export function formatMoney(
  amount: number | null | undefined,
  currency: string = "TRY"
): string {
  const value = typeof amount === "number" && !Number.isNaN(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    // Geçersiz para birimi kodu için güvenli geri dönüş
    return `${new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)} ${currency}`;
  }
}

/** Tarih biçimlendirme. Örn: "10 Ağu 2026" */
export function formatDate(
  d: string | number | Date | null | undefined
): string {
  if (!d) return "-";
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Tarih + saat biçimlendirme. Örn: "10 Ağu 2026, 14:30" */
export function formatDateTime(
  d: string | number | Date | null | undefined
): string {
  if (!d) return "-";
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Üyelik seviyesi etiketi. */
export function tierLabel(t: Tier | string | null | undefined): string {
  switch (t) {
    case "free":
      return "Ücretsiz";
    case "premium":
      return "Premium";
    case "vip":
      return "VIP";
    default:
      return t ? String(t) : "-";
  }
}

/** Tier için renk tonu (badge/pill className). */
export function tierTone(
  t: Tier | string | null | undefined
): "bg-muted text-muted-foreground" | "bg-primary/10 text-primary" | "bg-amber/15 text-amber" {
  switch (t) {
    case "premium":
      return "bg-primary/10 text-primary";
    case "vip":
      return "bg-amber/15 text-amber";
    default:
      return "bg-muted text-muted-foreground";
  }
}

/** Durum etiketi (abonelik/üyelik). */
export function statusLabel(s: MemberStatus | string | null | undefined): string {
  switch (s) {
    case "active":
      return "Aktif";
    case "pending":
      return "Beklemede";
    case "expired":
      return "Süresi Doldu";
    case "cancelled":
      return "İptal Edildi";
    default:
      return s ? String(s) : "-";
  }
}

/** Durum için renk tonu (pill/badge className). */
export function statusTone(
  s: MemberStatus | string | null | undefined
):
  | "bg-emerald/15 text-emerald"
  | "bg-amber/15 text-amber"
  | "bg-muted text-muted-foreground"
  | "bg-rose/15 text-rose" {
  switch (s) {
    case "active":
      return "bg-emerald/15 text-emerald";
    case "pending":
      return "bg-amber/15 text-amber";
    case "expired":
      return "bg-muted text-muted-foreground";
    case "cancelled":
      return "bg-rose/15 text-rose";
    default:
      return "bg-muted text-muted-foreground";
  }
}

/** Baş harflerini üretir. Örn: "Kumru Köseler" → "KK" */
export function initials(nameOrEmail: string | null | undefined): string {
  const src = (nameOrEmail || "?").trim();
  return src
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Sayı biçimlendirme (binlik ayraç). Örn: 1500 → "1.500" */
export function formatNumber(n: number | null | undefined): string {
  const value = typeof n === "number" && !Number.isNaN(n) ? n : 0;
  return new Intl.NumberFormat("tr-TR").format(value);
}
