import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Instagram,
  Youtube,
  Bot,
  Save,
} from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

// ── Yetki doğrulama yardımcısı ───────────────────────────────────────────
async function assertAdmin() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }
  return payload;
}

// ── Site ayarları kaydet (server action) ─────────────────────────────────
async function saveSiteSettings(formData: FormData) {
  "use server";

  const payload = await assertAdmin();

  const get = (k: string) => String(formData.get(k) ?? "").trim();

  await payload.updateGlobal({
    slug: "site-settings",
    locale: "tr",
    overrideAccess: true,
    data: {
      email: get("email"),
      phone: get("phone"),
      whatsapp: get("whatsapp"),
      address: get("address"),
      hours: get("hours"),
      instagram: get("instagram"),
      youtube: get("youtube"),
    },
  });

  revalidatePath("/yonetim/ayarlar");
}

// ── Chatbot ayarları kaydet (server action) ──────────────────────────────
async function saveChatbot(formData: FormData) {
  "use server";

  const payload = await assertAdmin();

  await payload.updateGlobal({
    slug: "chatbot",
    locale: "tr",
    overrideAccess: true,
    data: {
      systemPrompt: String(formData.get("systemPrompt") ?? "").trim(),
    },
  });

  revalidatePath("/yonetim/ayarlar");
}

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

const textareaClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

export default async function AyarlarPage() {
  const payload = await getPayload({ config });

  const [site, chatbot] = await Promise.all([
    payload.findGlobal({ slug: "site-settings", locale: "tr", depth: 0 }),
    payload.findGlobal({ slug: "chatbot", locale: "tr", depth: 0 }),
  ]);

  const siteFields: {
    name: string;
    label: string;
    value: string;
    icon: typeof Mail;
    type?: string;
    placeholder?: string;
  }[] = [
    {
      name: "email",
      label: "E-posta",
      value: site.email ?? "",
      icon: Mail,
      type: "email",
      placeholder: "ornek@kumru.com",
    },
    {
      name: "phone",
      label: "Telefon",
      value: site.phone ?? "",
      icon: Phone,
      placeholder: "+90 5xx xxx xx xx",
    },
    {
      name: "whatsapp",
      label: "WhatsApp Numarası (link için)",
      value: site.whatsapp ?? "",
      icon: MessageCircle,
      placeholder: "905xxxxxxxxx",
    },
    {
      name: "instagram",
      label: "Instagram URL",
      value: site.instagram ?? "",
      icon: Instagram,
      type: "url",
      placeholder: "https://instagram.com/...",
    },
    {
      name: "youtube",
      label: "YouTube URL",
      value: site.youtube ?? "",
      icon: Youtube,
      type: "url",
      placeholder: "https://youtube.com/...",
    },
    {
      name: "hours",
      label: "Çalışma Saatleri",
      value: site.hours ?? "",
      icon: Clock,
      placeholder: "Pazartesi - Cumartesi: 09:00 - 19:00",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Ayarlar"
        subtitle="Site iletişim bilgileri ve chatbot yapılandırması"
      />

      <Tabs defaultValue="site" className="w-full">
        <TabsList>
          <TabsTrigger value="site">Site Ayarları</TabsTrigger>
          <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
        </TabsList>

        {/* ── Site Ayarları ─────────────────────────────────────────── */}
        <TabsContent value="site">
          <form
            action={saveSiteSettings}
            className="rounded-2xl border bg-card p-6 shadow-sm"
          >
            <div className="mb-5">
              <h2 className="text-base font-semibold">İletişim Bilgileri</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Sitenin genelinde ve footer&apos;da kullanılan bilgiler.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {siteFields.map((f) => (
                <div key={f.name} className="space-y-1.5">
                  <Label
                    htmlFor={`site-${f.name}`}
                    className="flex items-center gap-1.5 text-sm"
                  >
                    <f.icon className="size-3.5 text-muted-foreground" />
                    {f.label}
                  </Label>
                  <Input
                    id={`site-${f.name}`}
                    name={f.name}
                    type={f.type ?? "text"}
                    defaultValue={f.value}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}

              {/* Adres — tam genişlik textarea */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label
                  htmlFor="site-address"
                  className="flex items-center gap-1.5 text-sm"
                >
                  <MapPin className="size-3.5 text-muted-foreground" />
                  Adres
                </Label>
                <textarea
                  id="site-address"
                  name="address"
                  rows={3}
                  defaultValue={site.address ?? ""}
                  className={textareaClass}
                  placeholder="Açık adres"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit">
                <Save className="size-4" />
                Kaydet
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* ── Chatbot ───────────────────────────────────────────────── */}
        <TabsContent value="chatbot">
          <form
            action={saveChatbot}
            className="rounded-2xl border bg-card p-6 shadow-sm"
          >
            <div className="mb-5 flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Bot className="size-5" />
              </span>
              <div>
                <h2 className="text-base font-semibold">Sistem Promptu</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Chatbot&apos;un kimliği, hizmet listesi ve yanıt kuralları.
                  Değişiklik kaydedildiğinde bot güncellenir.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="chatbot-systemPrompt" className="text-sm">
                Prompt
              </Label>
              <textarea
                id="chatbot-systemPrompt"
                name="systemPrompt"
                rows={22}
                defaultValue={chatbot.systemPrompt ?? ""}
                className={`${textareaClass} font-mono leading-relaxed`}
                placeholder="Sen Kumru'nun asistanısın..."
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit">
                <Save className="size-4" />
                Kaydet
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
