import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { NovaVera } from "@/payload-types";
import {
  Flower2,
  Sparkles,
  HelpCircle,
  Route,
  ListChecks,
  Award,
  Users,
  Footprints,
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

const BASE = "/yonetim/sayfalar/nova-vera";

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";
const textareaClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

// ── Yardımcılar ────────────────────────────────────────────────────────────
type TextRow = { text?: string | null; id?: string | null };
type ItemRow = { item?: string | null; id?: string | null };

// Nesne dizisini satır-satır metne çevir (yükleme)
function joinRows(
  rows: TextRow[] | ItemRow[] | null | undefined,
  prop: "text" | "item"
): string {
  return (rows ?? [])
    .map((r) => (r as Record<string, unknown>)[prop])
    .filter((v): v is string => typeof v === "string" && v.trim() !== "")
    .join("\n");
}

// ── Kaydet (server action) ─────────────────────────────────────────────────
async function saveNovaVera(formData: FormData) {
  "use server";

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }

  const str = (key: string) => String(formData.get(key) ?? "").trim();
  // Satır-satır textarea → nesne dizisi
  const lines = (key: string, prop: "text" | "item") =>
    String(formData.get(key) ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l !== "")
      .map((l) => ({ [prop]: l }));

  const data: Partial<NovaVera> = {
    brand: str("brand"),
    tagline: str("tagline"),
    quote: str("quote"),
    ctaButton: str("ctaButton"),

    intro: lines("intro", "text"),
    introQuestion: str("introQuestion"),
    introAnswer: str("introAnswer"),

    whatTitle: str("whatTitle"),
    what: lines("what", "text"),
    whatQuestion: str("whatQuestion"),

    journeyTitle: str("journeyTitle"),
    journey: lines("journey", "text"),
    journeyHighlight: str("journeyHighlight"),

    includesTitle: str("includesTitle"),
    includesIntro: str("includesIntro"),
    includes: lines("includes", "item"),
    includesNote: str("includesNote"),

    outcomesTitle: str("outcomesTitle"),
    outcomes: lines("outcomes", "item"),
    outcomesFinal: str("outcomesFinal"),
    outcomesNote: str("outcomesNote"),

    whoTitle: str("whoTitle"),
    whoIntro: str("whoIntro"),
    who: lines("who", "item"),
    whoOutro: str("whoOutro"),
    whoNote: str("whoNote"),

    notSessionTitle: str("notSessionTitle"),
    notSession: lines("notSession", "text"),

    firstStepTitle: str("firstStepTitle"),
    firstStep: lines("firstStep", "text"),
  };

  await payload.updateGlobal({
    slug: "nova-vera",
    locale: "tr",
    overrideAccess: true,
    data,
  });

  revalidatePath(BASE);
}

// ── Küçük form bileşenleri ─────────────────────────────────────────────────
function TextField({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}

function AreaField({
  name,
  label,
  defaultValue,
  rows = 3,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={textareaClass}
      />
    </div>
  );
}

function ListField({
  name,
  label,
  defaultValue,
  rows = 5,
}: {
  name: string;
  label: string;
  defaultValue: string;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder="Her satır bir madde"
        className={textareaClass}
      />
      <span className="text-[11px] text-muted-foreground">
        Her satır ayrı bir madde olarak kaydedilir.
      </span>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

// ── Sayfa ──────────────────────────────────────────────────────────────────
export default async function NovaVeraPage() {
  const payload = await getPayload({ config });
  const data = (await payload.findGlobal({
    slug: "nova-vera",
    locale: "tr",
    overrideAccess: true,
  })) as NovaVera;

  return (
    <div>
      <PageHeader
        title="Nova Vera"
        subtitle="Nova Vera tanıtım sayfasının tüm metinlerini bölüm bölüm düzenleyin."
      />

      <form action={saveNovaVera} className="mt-6">
        <Tabs defaultValue="genel" className="w-full">
          <TabsList className="flex h-auto flex-wrap justify-start gap-1">
            <TabsTrigger value="genel">
              <Flower2 className="size-4" /> Genel
            </TabsTrigger>
            <TabsTrigger value="giris">
              <Sparkles className="size-4" /> Giriş
            </TabsTrigger>
            <TabsTrigger value="nedir">
              <HelpCircle className="size-4" /> Nedir
            </TabsTrigger>
            <TabsTrigger value="yolculuk">
              <Route className="size-4" /> Yolculuk
            </TabsTrigger>
            <TabsTrigger value="icerik">
              <ListChecks className="size-4" /> İçerik
            </TabsTrigger>
            <TabsTrigger value="kazanimlar">
              <Award className="size-4" /> Kazanımlar
            </TabsTrigger>
            <TabsTrigger value="kimler">
              <Users className="size-4" /> Kimler İçin
            </TabsTrigger>
            <TabsTrigger value="kapanis">
              <Footprints className="size-4" /> Kapanış
            </TabsTrigger>
          </TabsList>

          {/* ── GENEL ─────────────────────────────────────────────────── */}
          <TabsContent value="genel" forceMount className="data-[state=inactive]:hidden">
            <Section>
              <TextField
                name="brand"
                label="Marka Adı"
                defaultValue={data.brand}
                placeholder="Nova Vera"
              />
              <AreaField
                name="tagline"
                label="Slogan"
                defaultValue={data.tagline}
                rows={2}
              />
              <AreaField
                name="quote"
                label="Alıntı"
                defaultValue={data.quote}
                rows={3}
              />
              <TextField
                name="ctaButton"
                label="CTA Buton"
                defaultValue={data.ctaButton}
              />
            </Section>
          </TabsContent>

          {/* ── GİRİŞ ─────────────────────────────────────────────────── */}
          <TabsContent value="giris" forceMount className="data-[state=inactive]:hidden">
            <Section>
              <ListField
                name="intro"
                label="Giriş Paragrafları"
                defaultValue={joinRows(data.intro, "text")}
                rows={6}
              />
              <TextField
                name="introQuestion"
                label="Giriş Sorusu"
                defaultValue={data.introQuestion}
              />
              <AreaField
                name="introAnswer"
                label="Giriş Cevabı"
                defaultValue={data.introAnswer}
              />
            </Section>
          </TabsContent>

          {/* ── NEDİR ─────────────────────────────────────────────────── */}
          <TabsContent value="nedir" forceMount className="data-[state=inactive]:hidden">
            <Section>
              <TextField
                name="whatTitle"
                label="Nedir Başlığı"
                defaultValue={data.whatTitle}
              />
              <ListField
                name="what"
                label="Nedir Paragrafları"
                defaultValue={joinRows(data.what, "text")}
                rows={6}
              />
              <AreaField
                name="whatQuestion"
                label="Nedir Sorusu"
                defaultValue={data.whatQuestion}
              />
            </Section>
          </TabsContent>

          {/* ── YOLCULUK ──────────────────────────────────────────────── */}
          <TabsContent value="yolculuk" forceMount className="data-[state=inactive]:hidden">
            <Section>
              <TextField
                name="journeyTitle"
                label="Yolculuk Başlığı"
                defaultValue={data.journeyTitle}
              />
              <ListField
                name="journey"
                label="Yolculuk Paragrafları"
                defaultValue={joinRows(data.journey, "text")}
                rows={6}
              />
              <AreaField
                name="journeyHighlight"
                label="Yolculuk Vurgu"
                defaultValue={data.journeyHighlight}
              />
            </Section>
          </TabsContent>

          {/* ── İÇERİK ────────────────────────────────────────────────── */}
          <TabsContent value="icerik" forceMount className="data-[state=inactive]:hidden">
            <Section>
              <TextField
                name="includesTitle"
                label="İçerik Başlığı"
                defaultValue={data.includesTitle}
              />
              <AreaField
                name="includesIntro"
                label="İçerik Giriş"
                defaultValue={data.includesIntro}
              />
              <ListField
                name="includes"
                label="İçerik Maddeleri"
                defaultValue={joinRows(data.includes, "item")}
                rows={6}
              />
              <AreaField
                name="includesNote"
                label="İçerik Notu"
                defaultValue={data.includesNote}
              />
            </Section>
          </TabsContent>

          {/* ── KAZANIMLAR ────────────────────────────────────────────── */}
          <TabsContent value="kazanimlar" forceMount className="data-[state=inactive]:hidden">
            <Section>
              <TextField
                name="outcomesTitle"
                label="Kazanımlar Başlığı"
                defaultValue={data.outcomesTitle}
              />
              <ListField
                name="outcomes"
                label="Kazanımlar"
                defaultValue={joinRows(data.outcomes, "item")}
                rows={6}
              />
              <AreaField
                name="outcomesFinal"
                label="Kazanımlar Kapanış"
                defaultValue={data.outcomesFinal}
              />
              <AreaField
                name="outcomesNote"
                label="Kazanımlar Notu"
                defaultValue={data.outcomesNote}
              />
            </Section>
          </TabsContent>

          {/* ── KİMLER İÇİN ───────────────────────────────────────────── */}
          <TabsContent value="kimler" forceMount className="data-[state=inactive]:hidden">
            <Section>
              <TextField
                name="whoTitle"
                label="Kimler İçin Başlığı"
                defaultValue={data.whoTitle}
              />
              <AreaField
                name="whoIntro"
                label="Kimler İçin Giriş"
                defaultValue={data.whoIntro}
              />
              <ListField
                name="who"
                label="Kimler İçin Maddeleri"
                defaultValue={joinRows(data.who, "item")}
                rows={6}
              />
              <AreaField
                name="whoOutro"
                label="Kimler İçin Kapanış"
                defaultValue={data.whoOutro}
              />
              <AreaField
                name="whoNote"
                label="Kimler İçin Notu"
                defaultValue={data.whoNote}
              />
            </Section>
          </TabsContent>

          {/* ── KAPANIŞ (Seans Değil + İlk Adım) ──────────────────────── */}
          <TabsContent value="kapanis" forceMount className="data-[state=inactive]:hidden">
            <Section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Seans Değil
              </h3>
              <TextField
                name="notSessionTitle"
                label="Seans Değil Başlığı"
                defaultValue={data.notSessionTitle}
              />
              <ListField
                name="notSession"
                label="Seans Değil Paragrafları"
                defaultValue={joinRows(data.notSession, "text")}
                rows={6}
              />

              <h3 className="mt-2 border-t pt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                İlk Adım
              </h3>
              <TextField
                name="firstStepTitle"
                label="İlk Adım Başlığı"
                defaultValue={data.firstStepTitle}
              />
              <ListField
                name="firstStep"
                label="İlk Adım Paragrafları"
                defaultValue={joinRows(data.firstStep, "text")}
                rows={6}
              />
            </Section>
          </TabsContent>
        </Tabs>

        {/* Kaydet çubuğu */}
        <div className="sticky bottom-4 z-10 mt-6 flex items-center justify-end rounded-2xl border bg-card/95 p-4 shadow-sm backdrop-blur">
          <Button type="submit">
            <Save className="size-4" /> Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
