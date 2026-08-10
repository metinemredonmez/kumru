import Stripe from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { getPaymentConfig } from "@/lib/payments/config";
import {
  createSubscriptionFromPayment,
  type SubscriptionTier,
  type SubscriptionInterval,
  type SubscriptionCurrency,
} from "@/lib/payments/subscription";

/**
 * Stripe webhook — checkout.session.completed olayını dinler.
 *
 * App Router'da imza doğrulaması için HAM gövde (raw body) gerekir; bu yüzden
 * `req.text()` kullanılır (JSON parse ETME). `export const config` YOKTUR.
 *
 * Akış:
 *   1. Ham gövde + `stripe-signature` başlığı ile olay doğrulanır.
 *   2. checkout.session.completed → session.metadata{memberId,tier,interval}.
 *   3. amount_total / 100 → gerçek tutar.
 *   4. createSubscriptionFromPayment(...) çağrılır (idempotent).
 *
 * Not: Stripe her durumda 200 bekler; aksi halde webhook'u tekrar dener.
 * İmza/parse hatalarında ise 400 döneriz ki Stripe geçersiz isteği bilsin.
 */

export const dynamic = "force-dynamic";

const VALID_TIERS: SubscriptionTier[] = ["free", "premium", "vip"];
const VALID_INTERVALS: SubscriptionInterval[] = ["monthly", "yearly", "once"];

function normalizeTier(value: unknown): SubscriptionTier {
  const v = typeof value === "string" ? value.toLowerCase().trim() : "";
  return (VALID_TIERS as string[]).includes(v)
    ? (v as SubscriptionTier)
    : "premium";
}

function normalizeInterval(value: unknown): SubscriptionInterval {
  const v = typeof value === "string" ? value.toLowerCase().trim() : "";
  return (VALID_INTERVALS as string[]).includes(v)
    ? (v as SubscriptionInterval)
    : "monthly";
}

function normalizeCurrency(value: unknown): SubscriptionCurrency {
  const v = typeof value === "string" ? value.toUpperCase().trim() : "";
  if (v === "USD") return "USD";
  if (v === "CAD") return "CAD";
  return "TRY";
}

export const POST = async (req: Request) => {
  const cfg = await getPaymentConfig();

  if (!cfg.stripe.secretKey || !cfg.stripe.webhookSecret) {
    console.error("[stripe/webhook] Stripe anahtarları yapılandırılmamış");
    return Response.json(
      { error: "Stripe yapılandırılmamış" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "İmza başlığı yok" }, { status: 400 });
  }

  // HAM gövde — imza doğrulaması için zorunlu.
  const body = await req.text();

  const stripe = new Stripe(cfg.stripe.secretKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      cfg.stripe.webhookSecret,
    );
  } catch (error) {
    console.error("[stripe/webhook] İmza doğrulaması başarısız:", error);
    return Response.json({ error: "Geçersiz imza" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Yalnızca ödemesi tamamlanmış oturumları işle.
      if (session.payment_status === "paid" || session.status === "complete") {
        const metadata = session.metadata || {};
        const memberId = metadata.memberId;

        if (!memberId) {
          console.error("[stripe/webhook] metadata.memberId eksik", session.id);
        } else {
          const tier = normalizeTier(metadata.tier);
          const interval = normalizeInterval(metadata.interval);
          const currency = normalizeCurrency(session.currency);
          // amount_total kuruş/cent cinsinden gelir → gerçek tutara böl.
          const amount =
            typeof session.amount_total === "number"
              ? session.amount_total / 100
              : 0;

          const payload = await getPayload({ config });

          await createSubscriptionFromPayment({
            payload,
            memberId,
            tier,
            amount,
            currency,
            provider: "stripe",
            // Idempotentlik anahtarı: oturum kimliği tekildir.
            reference: session.id,
            interval,
          });
        }
      }
    }

    return Response.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[stripe/webhook] İşleme hatası:", error);
    // 200 döndürerek Stripe'ın sonsuz tekrar denemesini önlüyoruz;
    // hata loglandı ve manuel incelenebilir.
    return Response.json({ received: true }, { status: 200 });
  }
};
