import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Integration } from "@/payload-types";
import {
  CreditCard,
  Bot,
  Mail,
  MessageSquare,
  Save,
  ShieldCheck,
} from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MaskedInput from "@/components/yonetim/MaskedInput";

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

// ── Kaydet (server action) ─────────────────────────────────────────────────
async function saveIntegrations(formData: FormData) {
  "use server";

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }

  const str = (key: string) => String(formData.get(key) ?? "").trim();
  const bool = (key: string) => formData.get(key) === "on";

  await payload.updateGlobal({
    slug: "integrations",
    overrideAccess: true,
    data: {
      paymentProvider: str("paymentProvider") as Integration["paymentProvider"],
      iyzicoTestMode: bool("iyzicoTestMode"),
      iyzicoApiKey: str("iyzicoApiKey"),
      iyzicoSecretKey: str("iyzicoSecretKey"),
      stripeTestMode: bool("stripeTestMode"),
      stripePublishableKey: str("stripePublishableKey"),
      stripeSecretKey: str("stripeSecretKey"),
      stripeWebhookSecret: str("stripeWebhookSecret"),
      openaiApiKey: str("openaiApiKey"),
      emailProvider: str("emailProvider") as Integration["emailProvider"],
      emailFrom: str("emailFrom"),
      emailApiKey: str("emailApiKey"),
      netgsmUser: str("netgsmUser"),
      netgsmPassword: str("netgsmPassword"),
      netgsmHeader: str("netgsmHeader"),
    },
  });

  revalidatePath("/yonetim/entegrasyonlar");
}

// ── Bölüm başlığı yardımcı bileşeni ────────────────────────────────────────
function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

// ── Sayfa ──────────────────────────────────────────────────────────────────
export default async function EntegrasyonlarPage() {
  const payload = await getPayload({ config });
  const data = (await payload.findGlobal({
    slug: "integrations",
    overrideAccess: true,
  })) as Integration;

  return (
    <>
      <PageHeader
        title="Entegrasyonlar"
        subtitle="Ödeme, AI, e-posta ve SMS servis anahtarları. Gizli anahtarlar maskeli görünür."
      />

      <form action={saveIntegrations} className="mt-6 flex flex-col gap-6">
        {/* Ödeme sağlayıcı */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <SectionHeading
            icon={CreditCard}
            title="Ödeme"
            description="Aktif ödeme yöntemini ve sağlayıcı anahtarlarını yönetin."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="paymentProvider">Aktif Ödeme Sağlayıcı</Label>
              <select
                id="paymentProvider"
                name="paymentProvider"
                className={fieldClass}
                defaultValue={data.paymentProvider ?? "iyzico"}
              >
                <option value="iyzico">İyzico (TL / taksit)</option>
                <option value="stripe">Stripe (döviz / yurt dışı)</option>
                <option value="both">İkisi de</option>
              </select>
              <span className="text-[11px] text-muted-foreground">
                &quot;İkisi de&quot; seçilirse müşteri ödeme adımında seçebilir.
              </span>
            </div>
          </div>

          {/* İyzico */}
          <h3 className="mt-6 border-t border-border pt-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            İyzico
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                name="iyzicoTestMode"
                defaultChecked={data.iyzicoTestMode ?? true}
                className="size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-sm text-foreground">
                Test modu (sandbox)
              </span>
            </label>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="iyzicoApiKey">İyzico API Key</Label>
              <MaskedInput
                id="iyzicoApiKey"
                name="iyzicoApiKey"
                defaultValue={data.iyzicoApiKey ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="iyzicoSecretKey">İyzico Secret Key</Label>
              <MaskedInput
                id="iyzicoSecretKey"
                name="iyzicoSecretKey"
                defaultValue={data.iyzicoSecretKey ?? ""}
              />
            </div>
          </div>

          {/* Stripe */}
          <h3 className="mt-6 border-t border-border pt-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Stripe
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                name="stripeTestMode"
                defaultChecked={data.stripeTestMode ?? true}
                className="size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-sm text-foreground">Test modu</span>
            </label>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stripePublishableKey">
                Stripe Publishable Key
              </Label>
              <Input
                id="stripePublishableKey"
                name="stripePublishableKey"
                defaultValue={data.stripePublishableKey ?? ""}
                placeholder="pk_..."
                autoComplete="off"
              />
              <span className="text-[11px] text-muted-foreground">
                Herkese açık anahtar (pk_...)
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
              <MaskedInput
                id="stripeSecretKey"
                name="stripeSecretKey"
                defaultValue={data.stripeSecretKey ?? ""}
                placeholder="sk_..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stripeWebhookSecret">Stripe Webhook Secret</Label>
              <MaskedInput
                id="stripeWebhookSecret"
                name="stripeWebhookSecret"
                defaultValue={data.stripeWebhookSecret ?? ""}
                placeholder="whsec_..."
              />
            </div>
          </div>
        </section>

        {/* OpenAI */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <SectionHeading
            icon={Bot}
            title="OpenAI"
            description="Chatbot için kullanılan OpenAI API anahtarı."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="openaiApiKey">OpenAI API Key (Chatbot)</Label>
              <MaskedInput
                id="openaiApiKey"
                name="openaiApiKey"
                defaultValue={data.openaiApiKey ?? ""}
                placeholder="sk-..."
              />
            </div>
          </div>
        </section>

        {/* E-posta */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <SectionHeading
            icon={Mail}
            title="E-posta"
            description="Bildirim ve işlem e-postalarının gönderim ayarları."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="emailProvider">E-posta Sağlayıcı</Label>
              <select
                id="emailProvider"
                name="emailProvider"
                className={fieldClass}
                defaultValue={data.emailProvider ?? "resend"}
              >
                <option value="resend">Resend</option>
                <option value="postmark">Postmark</option>
                <option value="smtp">SMTP</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="emailFrom">Gönderen adresi</Label>
              <Input
                id="emailFrom"
                name="emailFrom"
                defaultValue={data.emailFrom ?? ""}
                placeholder="Kumru Köseler <info@kumrukoseler.com>"
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="emailApiKey">E-posta API Key</Label>
              <MaskedInput
                id="emailApiKey"
                name="emailApiKey"
                defaultValue={data.emailApiKey ?? ""}
              />
            </div>
          </div>
        </section>

        {/* SMS */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <SectionHeading
            icon={MessageSquare}
            title="SMS (NetGSM)"
            description="Doğrulama ve bilgilendirme SMS'leri için NetGSM bilgileri."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="netgsmUser">NetGSM Kullanıcı</Label>
              <Input
                id="netgsmUser"
                name="netgsmUser"
                defaultValue={data.netgsmUser ?? ""}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="netgsmPassword">NetGSM Şifre</Label>
              <MaskedInput
                id="netgsmPassword"
                name="netgsmPassword"
                defaultValue={data.netgsmPassword ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="netgsmHeader">NetGSM Mesaj Başlığı (onaylı)</Label>
              <Input
                id="netgsmHeader"
                name="netgsmHeader"
                defaultValue={data.netgsmHeader ?? ""}
                autoComplete="off"
              />
            </div>
          </div>
        </section>

        {/* Kaydet çubuğu */}
        <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/95 p-4 shadow-sm backdrop-blur">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            Gizli anahtarlar maskeli görünür. .env&apos;de tanımlı değerler
            önceliklidir.
          </p>
          <Button type="submit">
            <Save className="size-4" /> Kaydet
          </Button>
        </div>
      </form>
    </>
  );
}
