import { getPayload } from "payload";
import config from "@payload-config";
import {
  getPaymentConfig,
  serverURL,
  type PaymentProvider,
} from "@/lib/payments/config";

export const dynamic = "force-dynamic";

/**
 * ÖDEME BAŞLATMA — POST /api/checkout
 *
 * Gövde: { tier } veya { planId } (opsiyonel { provider } — "both" seçiliyken).
 *
 * 1) Üye oturumu doğrulanır (payload.auth). Yoksa 401.
 * 2) İstenen tier/planId için "membership-plans" kaydı bulunur.
 * 3) getPaymentConfig() ile aktif sağlayıcı + anahtarlar okunur.
 * 4) Sağlayıcıya göre Stripe Checkout veya İyzico Checkout Form başlatılır.
 * 5) Sağlayıcı yapılandırılmamışsa { error, fallback:'whatsapp' } 400 döner.
 */

interface CheckoutBody {
  tier?: string;
  planId?: string | number;
  provider?: string;
}

/** Sağlayıcının kullanıma hazır (anahtarları dolu) olup olmadığını kontrol eder. */
function isConfigured(
  which: "stripe" | "iyzico",
  cfg: Awaited<ReturnType<typeof getPaymentConfig>>,
): boolean {
  if (which === "stripe") return Boolean(cfg.stripe.secretKey);
  return Boolean(cfg.iyzico.apiKey && cfg.iyzico.secretKey);
}

/** İstek + yapılandırmaya göre hangi somut sağlayıcının kullanılacağını seçer. */
function resolveProvider(
  configProvider: PaymentProvider,
  requested: string | undefined,
  cfg: Awaited<ReturnType<typeof getPaymentConfig>>,
): "stripe" | "iyzico" | null {
  const stripeOk = isConfigured("stripe", cfg);
  const iyzicoOk = isConfigured("iyzico", cfg);

  if (configProvider === "stripe") {
    return stripeOk ? "stripe" : iyzicoOk ? "iyzico" : null;
  }
  if (configProvider === "iyzico") {
    return iyzicoOk ? "iyzico" : stripeOk ? "stripe" : null;
  }

  // "both": müşteri tercihini dikkate al, yoksa İyzico'yu (TL) tercih et.
  const pref =
    requested === "stripe" || requested === "iyzico" ? requested : undefined;
  if (pref === "stripe" && stripeOk) return "stripe";
  if (pref === "iyzico" && iyzicoOk) return "iyzico";
  if (iyzicoOk) return "iyzico";
  if (stripeOk) return "stripe";
  return null;
}

/** Üyenin tek "name" alanını ad/soyad olarak böler. */
function splitName(full: string | undefined | null): {
  name: string;
  surname: string;
} {
  const parts = String(full || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { name: "Üye", surname: "-" };
  if (parts.length === 1) return { name: parts[0], surname: "-" };
  return { name: parts[0], surname: parts.slice(1).join(" ") };
}

export const POST = async (req: Request) => {
  try {
    const payload = await getPayload({ config });

    // 1) Üye oturumu
    const { user } = await payload.auth({ headers: req.headers });
    if (!user || (user as { collection?: string }).collection !== "members") {
      return Response.json({ error: "Giriş gerekli" }, { status: 401 });
    }
    const member = user as {
      id: number;
      email: string;
      name?: string | null;
    };

    // Gövde
    const body = (await req.json().catch(() => ({}))) as CheckoutBody;
    const tier = body.tier ? String(body.tier) : "";
    const planId = body.planId;

    if (!tier && planId === undefined) {
      return Response.json(
        { error: "Plan bilgisi eksik" },
        { status: 400 },
      );
    }

    // 2) Plan bul (tr fiyat/isim). planId öncelikli, yoksa tier'a göre.
    let plan:
      | {
          id: number;
          name: string;
          tier: string;
          priceAmount?: number | null;
          interval?: string | null;
        }
      | undefined;

    if (planId !== undefined) {
      const found = await payload
        .findByID({
          collection: "membership-plans",
          id: planId as number,
          locale: "tr",
          overrideAccess: true,
        })
        .catch(() => undefined);
      if (found) plan = found as typeof plan;
    } else {
      const res = await payload.find({
        collection: "membership-plans",
        where: { tier: { equals: tier } },
        limit: 1,
        locale: "tr",
        overrideAccess: true,
      });
      plan = res.docs[0] as typeof plan;
    }

    if (!plan) {
      return Response.json({ error: "Plan bulunamadı" }, { status: 404 });
    }

    const priceAmount = Number(plan.priceAmount);
    if (!Number.isFinite(priceAmount) || priceAmount <= 0) {
      return Response.json(
        { error: "Bu plan için geçerli bir fiyat tanımlanmamış" },
        { status: 400 },
      );
    }

    const planTier = plan.tier;
    const interval = (plan.interval || "monthly") as
      | "monthly"
      | "yearly"
      | "once";
    const planName = plan.name || "Üyelik";

    // 3) Ödeme yapılandırması
    const cfg = await getPaymentConfig();
    const provider = resolveProvider(cfg.provider, body.provider, cfg);

    // 5) Sağlayıcı yapılandırılmamış
    if (!provider) {
      return Response.json(
        { error: "Ödeme yapılandırılmamış", fallback: "whatsapp" },
        { status: 400 },
      );
    }

    const base = serverURL();

    // 4a) STRIPE
    if (provider === "stripe") {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(cfg.stripe.secretKey);

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "try",
              product_data: { name: planName },
              unit_amount: Math.round(priceAmount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${base}/panel?odeme=basarili`,
        cancel_url: `${base}/panel/uyelik?odeme=iptal`,
        client_reference_id: String(member.id),
        metadata: {
          memberId: String(member.id),
          tier: planTier,
          interval,
        },
      });

      if (!session.url) {
        return Response.json(
          { error: "Stripe ödeme oturumu oluşturulamadı" },
          { status: 502 },
        );
      }
      return Response.json({ url: session.url });
    }

    // 4b) İYZİCO
    // iyzipay paketi tip tanımı (.d.ts) içermez.
    // @ts-expect-error - iyzipay için tip tanımı yok
    const Iyzipay = (await import("iyzipay")).default;
    const iyzipay = new Iyzipay({
      apiKey: cfg.iyzico.apiKey,
      secretKey: cfg.iyzico.secretKey,
      uri: cfg.iyzico.baseUrl,
    });

    const { name, surname } = splitName(member.name);
    const priceStr = String(priceAmount);
    // Callback'te üye + tier + interval'ı geri çözebilmek için conversationId'ye gömüyoruz.
    // Format callback route ile UYUMLU olmalı: "member:<id>:tier:<tier>:interval:<interval>".
    const conversationId = `member:${member.id}:tier:${planTier}:interval:${interval}`;
    const basketId = `kumru_${member.id}_${planTier}`;

    const address = {
      contactName: `${name} ${surname}`.trim(),
      city: "Istanbul",
      country: "Turkey",
      address: "-",
    };

    const request = {
      locale: "tr",
      conversationId,
      price: priceStr,
      paidPrice: priceStr,
      currency: "TRY",
      basketId,
      paymentGroup: "SUBSCRIPTION",
      callbackUrl: `${base}/api/checkout/iyzico/callback`,
      buyer: {
        id: String(member.id),
        name,
        surname,
        email: member.email,
        identityNumber: "11111111111",
        registrationAddress: "-",
        city: "Istanbul",
        country: "Turkey",
        ip: "85.34.78.112",
      },
      shippingAddress: address,
      billingAddress: address,
      basketItems: [
        {
          id: planTier,
          name: planName,
          category1: "Membership",
          category2: interval,
          itemType: "VIRTUAL",
          price: priceStr,
        },
      ],
    };

    const result = await new Promise<{
      status?: string;
      errorMessage?: string;
      checkoutFormContent?: string;
      paymentPageUrl?: string;
      token?: string;
    }>((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, (err: unknown, res: unknown) => {
        if (err) reject(err);
        else resolve(res as never);
      });
    });

    if (result.status !== "success") {
      payload.logger.error(
        `[/api/checkout] iyzico init failed: ${result.errorMessage || "bilinmeyen hata"}`,
      );
      return Response.json(
        {
          error: result.errorMessage || "Ödeme başlatılamadı",
          fallback: "whatsapp",
        },
        { status: 502 },
      );
    }

    return Response.json({
      checkoutFormContent: result.checkoutFormContent,
      paymentPageUrl: result.paymentPageUrl,
    });
  } catch (error) {
    console.error("[/api/checkout] error:", error);
    return Response.json({ error: "Sunucu hatası" }, { status: 500 });
  }
};
