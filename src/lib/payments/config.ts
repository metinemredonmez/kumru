import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Ödeme sağlayıcı yapılandırması.
 *
 * Anahtarlar "integrations" GLOBAL'inden okunur. GÜVENLİK: aynı isimli bir ENV
 * değişkeni tanımlıysa O ÖNCELİKLİDİR (admin panelindeki değeri ezer).
 */

export type PaymentProvider = "iyzico" | "stripe" | "both";

export interface IyzicoConfig {
  apiKey: string;
  secretKey: string;
  testMode: boolean;
  baseUrl: string;
}

export interface StripeConfig {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
  testMode: boolean;
}

export interface PaymentConfig {
  provider: PaymentProvider;
  iyzico: IyzicoConfig;
  stripe: StripeConfig;
}

/** ENV değeri varsa (boş değilse) onu, yoksa global'deki değeri döndürür. */
function pick(envValue: string | undefined, globalValue: unknown): string {
  const env = typeof envValue === "string" ? envValue.trim() : "";
  if (env) return env;
  return typeof globalValue === "string" ? globalValue : "";
}

/** Sunucu URL'i — webhook / callback adresleri için. */
export function serverURL(): string {
  return process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
}

/**
 * Aktif ödeme yapılandırmasını döndürür.
 * integrations global'ini okur ve ENV override uygular.
 */
export async function getPaymentConfig(): Promise<PaymentConfig> {
  const payload = await getPayload({ config });
  const data = await payload.findGlobal({
    slug: "integrations",
    overrideAccess: true,
  });

  const provider = (data?.paymentProvider as PaymentProvider) || "iyzico";

  const iyzicoTestMode = Boolean(data?.iyzicoTestMode);
  const iyzico: IyzicoConfig = {
    apiKey: pick(process.env.IYZICO_API_KEY, data?.iyzicoApiKey),
    secretKey: pick(process.env.IYZICO_SECRET_KEY, data?.iyzicoSecretKey),
    testMode: iyzicoTestMode,
    baseUrl: iyzicoTestMode
      ? "https://sandbox-api.iyzipay.com"
      : "https://api.iyzipay.com",
  };

  const stripe: StripeConfig = {
    secretKey: pick(process.env.STRIPE_SECRET_KEY, data?.stripeSecretKey),
    publishableKey: pick(
      process.env.STRIPE_PUBLISHABLE_KEY,
      data?.stripePublishableKey,
    ),
    webhookSecret: pick(
      process.env.STRIPE_WEBHOOK_SECRET,
      data?.stripeWebhookSecret,
    ),
    testMode: Boolean(data?.stripeTestMode),
  };

  return { provider, iyzico, stripe };
}
