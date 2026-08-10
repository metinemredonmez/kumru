// iyzipay paketi tip tanımı (.d.ts) içermez; CommonJS sınıfını any olarak alıyoruz.
// @ts-expect-error - iyzipay için tip tanımı yok
import Iyzipay from "iyzipay";
import { getPayload } from "payload";
import config from "@payload-config";
import { getPaymentConfig, serverURL } from "@/lib/payments/config";
import {
  createSubscriptionFromPayment,
  type SubscriptionTier,
  type SubscriptionInterval,
  type SubscriptionCurrency,
} from "@/lib/payments/subscription";

/**
 * İyzico Checkout Form geri dönüş (callback) adresi.
 *
 * İyzico ödeme sonrası bu adrese `application/x-www-form-urlencoded` bir POST
 * atar; gövdede yalnızca `token` bulunur. Bu token ile ödemenin gerçek durumu
 * İyzico API'sinden sorgulanır (asla sadece form verisine güvenme).
 *
 * Akış:
 *   1. token al → checkoutForm.retrieve({locale, token}).
 *   2. paymentStatus === 'SUCCESS' && status === 'success' → başarılı.
 *   3. basketItems / price'tan tier + amount çıkar.
 *   4. createSubscriptionFromPayment(...) (reference = paymentId, idempotent).
 *   5. /panel?odeme=basarili adresine 303 yönlendir.
 *   Başarısızlıkta /panel/uyelik?odeme=hata adresine yönlendir.
 */

export const dynamic = "force-dynamic";

const VALID_TIERS: SubscriptionTier[] = ["free", "premium", "vip"];
const VALID_INTERVALS: SubscriptionInterval[] = ["monthly", "yearly", "once"];

interface IyzicoBasketItem {
  id?: string;
  name?: string;
  category1?: string;
  category2?: string;
  itemType?: string;
  price?: string;
}

interface IyzicoRetrieveResult {
  status?: string;
  paymentStatus?: string;
  conversationId?: string;
  paymentId?: string;
  price?: string;
  paidPrice?: string;
  currency?: string;
  basketItems?: IyzicoBasketItem[];
  errorMessage?: string;
}

function successRedirect(): Response {
  return Response.redirect(`${serverURL()}/panel?odeme=basarili`, 303);
}

function errorRedirect(): Response {
  return Response.redirect(`${serverURL()}/panel/uyelik?odeme=hata`, 303);
}

function normalizeTier(value: unknown): SubscriptionTier {
  const v = typeof value === "string" ? value.toLowerCase().trim() : "";
  if ((VALID_TIERS as string[]).includes(v)) return v as SubscriptionTier;
  if (v.includes("vip")) return "vip";
  if (v.includes("premium")) return "premium";
  return "premium";
}

function normalizeInterval(value: unknown): SubscriptionInterval {
  const v = typeof value === "string" ? value.toLowerCase().trim() : "";
  if ((VALID_INTERVALS as string[]).includes(v)) return v as SubscriptionInterval;
  if (v.includes("year") || v.includes("yil") || v.includes("yıl")) return "yearly";
  if (v.includes("once") || v.includes("tek")) return "once";
  return "monthly";
}

function normalizeCurrency(value: unknown): SubscriptionCurrency {
  const v = typeof value === "string" ? value.toUpperCase().trim() : "";
  if (v === "USD") return "USD";
  if (v === "CAD") return "CAD";
  return "TRY";
}

export const POST = async (req: Request) => {
  try {
    const cfg = await getPaymentConfig();

    if (!cfg.iyzico.apiKey || !cfg.iyzico.secretKey) {
      console.error("[iyzico/callback] İyzico anahtarları yapılandırılmamış");
      return errorRedirect();
    }

    // İyzico form-urlencoded gönderir; token'ı al.
    const form = await req.formData();
    const token = form.get("token");
    if (!token || typeof token !== "string") {
      console.error("[iyzico/callback] token yok");
      return errorRedirect();
    }

    const iyzipay = new Iyzipay({
      apiKey: cfg.iyzico.apiKey,
      secretKey: cfg.iyzico.secretKey,
      uri: cfg.iyzico.baseUrl,
    });

    // callback-tabanlı SDK'yı Promise'e sar.
    const result = await new Promise<IyzicoRetrieveResult>((resolve, reject) => {
      iyzipay.checkoutForm.retrieve(
        { locale: "tr", token },
        (err: unknown, res: IyzicoRetrieveResult) => {
          if (err) reject(err);
          else resolve(res);
        },
      );
    });

    // Ödeme gerçekten başarılı mı? (form verisine değil API sonucuna güven)
    const paymentOk =
      result?.paymentStatus === "SUCCESS" && result?.status === "success";
    const paymentId = result?.paymentId;

    if (!paymentOk || !paymentId) {
      console.error(
        "[iyzico/callback] Ödeme başarısız:",
        result?.paymentStatus,
        result?.status,
        result?.errorMessage,
      );
      return errorRedirect();
    }

    // conversationId formatı: "member:<id>:tier:<tier>:interval:<interval>"
    // (checkout formu oluşturulurken bu şekilde kodlanır).
    const conversationId = result?.conversationId || "";
    const convParts = conversationId.split(":");
    const convMap: Record<string, string> = {};
    for (let i = 0; i + 1 < convParts.length; i += 2) {
      convMap[convParts[i]] = convParts[i + 1];
    }

    const basketItem = result?.basketItems?.[0];

    const memberId = convMap.member;
    if (!memberId) {
      console.error("[iyzico/callback] conversationId'de member yok:", conversationId);
      return errorRedirect();
    }

    // tier: önce conversationId, sonra basketItem (category1/id/name).
    const tier = normalizeTier(
      convMap.tier ||
        basketItem?.category1 ||
        basketItem?.id ||
        basketItem?.name,
    );

    // interval: önce conversationId, sonra basketItem category2.
    const interval = normalizeInterval(convMap.interval || basketItem?.category2);

    // amount: gerçek ödenen tutar (paidPrice) → yoksa price → yoksa basketItem.
    const amountStr =
      result?.paidPrice || result?.price || basketItem?.price || "0";
    const amount = Number(amountStr) || 0;

    const currency = normalizeCurrency(result?.currency);

    const payload = await getPayload({ config });

    await createSubscriptionFromPayment({
      payload,
      memberId,
      tier,
      amount,
      currency,
      provider: "iyzico",
      reference: paymentId, // idempotentlik anahtarı
      interval,
    });

    return successRedirect();
  } catch (error) {
    console.error("[iyzico/callback] Hata:", error);
    return errorRedirect();
  }
};
