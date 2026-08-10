import type { Payload } from "payload";

/**
 * Başarılı bir ödemeden sonra abonelik kaydı oluşturur.
 *
 * "subscriptions" koleksiyonunun afterChange hook'u, status='active' olduğunda
 * üyenin membershipTier + membershipExpiresAt alanlarını OTOMATİK günceller.
 * Yani ödeme başarısında sadece bu fonksiyonu çağırmak yeterlidir.
 *
 * İdempotent: aynı `reference` ile bir kayıt varsa yenisini oluşturmaz,
 * mevcut kaydı döndürür.
 */

export type SubscriptionTier = "free" | "premium" | "vip";
export type SubscriptionProvider = "manual" | "iyzico" | "stripe";
export type SubscriptionInterval = "monthly" | "yearly" | "once";
export type SubscriptionCurrency = "TRY" | "USD" | "CAD";

export interface CreateSubscriptionArgs {
  payload: Payload;
  memberId: string | number;
  tier: SubscriptionTier;
  amount: number;
  currency: SubscriptionCurrency;
  provider: SubscriptionProvider;
  reference: string;
  interval: SubscriptionInterval;
}

/** interval'a göre bitiş tarihi hesaplar. once → süresiz (null). */
function computeExpiresAt(
  interval: SubscriptionInterval,
  startedAt: Date,
): Date | null {
  const d = new Date(startedAt);
  if (interval === "monthly") {
    d.setMonth(d.getMonth() + 1);
    return d;
  }
  if (interval === "yearly") {
    d.setFullYear(d.getFullYear() + 1);
    return d;
  }
  return null; // "once"
}

export async function createSubscriptionFromPayment({
  payload,
  memberId,
  tier,
  amount,
  currency,
  provider,
  reference,
  interval,
}: CreateSubscriptionArgs) {
  // İdempotentlik: aynı referans daha önce işlendiyse tekrar oluşturma.
  if (reference) {
    const existing = await payload.find({
      collection: "subscriptions",
      where: { reference: { equals: reference } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.totalDocs > 0) {
      return existing.docs[0];
    }
  }

  const startedAt = new Date();
  const expiresAt = computeExpiresAt(interval, startedAt);

  const doc = await payload.create({
    collection: "subscriptions",
    data: {
      member: typeof memberId === "string" ? Number(memberId) : memberId,
      tier,
      status: "active",
      provider,
      amount,
      currency,
      reference,
      startedAt: startedAt.toISOString(),
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
    },
    overrideAccess: true,
  });

  return doc;
}
