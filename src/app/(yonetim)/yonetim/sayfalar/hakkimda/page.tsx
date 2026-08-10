import Link from "next/link";
import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { ArrowLeft, ImageIcon, Save } from "lucide-react";

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

// ── Kaydet (server action) ───────────────────────────────────────────────
async function saveAbout(formData: FormData) {
  "use server";

  const payload = await assertAdmin();

  const get = (k: string) => String(formData.get(k) ?? "").trim();

  // profileImage → Media ID (boş ise temizle)
  const profileRaw = get("profileImage");
  const profileId = profileRaw ? Number(profileRaw) : null;

  // Satır-satır dizi → [{item}]
  const spiritualApproaches = get("spiritualApproaches")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((item) => ({ item }));

  // JSON dizi ayrıştırıcı: hata olursa alan atlanır (undefined döner)
  const parseJsonArray = (
    k: string
  ): Record<string, unknown>[] | undefined => {
    const raw = String(formData.get(k) ?? "").trim();
    if (!raw) return [];
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v : undefined;
    } catch {
      return undefined;
    }
  };

  const data: Record<string, unknown> = {
    profileImage: profileId && Number.isFinite(profileId) ? profileId : null,
    subtitle: get("subtitle"),
    title: get("title"),
    name: get("name"),
    heroDescription: get("heroDescription"),
    heroDescription2: get("heroDescription2"),
    appointment: get("appointment"),
    mediaButton: get("mediaButton"),
    storyTitle: get("storyTitle"),
    story1: get("story1"),
    story2: get("story2"),
    story3: get("story3"),
    story4: get("story4"),
    valuesTitle: get("valuesTitle"),
    valuesDescription: get("valuesDescription"),
    values: {
      empathy: {
        title: get("values.empathy.title"),
        description: get("values.empathy.description"),
      },
      honesty: {
        title: get("values.honesty.title"),
        description: get("values.honesty.description"),
      },
      transformation: {
        title: get("values.transformation.title"),
        description: get("values.transformation.description"),
      },
      excellence: {
        title: get("values.excellence.title"),
        description: get("values.excellence.description"),
      },
    },
    certificationsTitle: get("certificationsTitle"),
    journeyTitle: get("journeyTitle"),
    spiritualTitle: get("spiritualTitle"),
    spiritual1: get("spiritual1"),
    spiritual2: get("spiritual2"),
    spiritual3: get("spiritual3"),
    spiritualApproaches,
    ctaTitle: get("ctaTitle"),
    ctaDescription: get("ctaDescription"),
    ctaButton: get("ctaButton"),
  };

  const certifications = parseJsonArray("certifications");
  if (certifications !== undefined) data.certifications = certifications;

  const timeline = parseJsonArray("timeline");
  if (timeline !== undefined) data.timeline = timeline;

  await payload.updateGlobal({
    slug: "about",
    locale: "tr",
    overrideAccess: true,
    data,
  });

  revalidatePath("/yonetim/sayfalar/hakkimda");
}

// ── Ortak sınıflar ───────────────────────────────────────────────────────
const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

const textareaClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

const sectionClass = "rounded-2xl border bg-card p-6 shadow-sm";

export default async function HakkimdaEditorPage() {
  const payload = await getPayload({ config });

  const about = await payload.findGlobal({
    slug: "about",
    locale: "tr",
    depth: 1,
  });

  // profileImage: depth 1 ile obje veya sadece ID gelebilir
  const profile = about.profileImage;
  const profileId =
    profile && typeof profile === "object" ? profile.id : profile ?? "";
  const profileUrl =
    profile && typeof profile === "object" ? profile.url ?? null : null;

  const v = about.values ?? {};

  const approachesText = (about.spiritualApproaches ?? [])
    .map((a) => a?.item ?? "")
    .filter(Boolean)
    .join("\n");

  // JSON alanlarını id alanı olmadan gösterelim (daha temiz)
  const certificationsJson = JSON.stringify(
    (about.certifications ?? []).map((c) => ({
      title: c?.title ?? "",
      organization: c?.organization ?? "",
      year: c?.year ?? "",
    })),
    null,
    2
  );
  const timelineJson = JSON.stringify(
    (about.timeline ?? []).map((t) => ({
      year: t?.year ?? "",
      title: t?.title ?? "",
      description: t?.description ?? "",
    })),
    null,
    2
  );

  return (
    <div>
      <PageHeader
        title="Hakkımda Sayfası"
        subtitle="Hakkımda sayfasının tüm metin ve görsellerini düzenleyin."
        actions={
          <Link
            href="/yonetim/sayfalar"
            className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent"
          >
            <ArrowLeft className="size-4" />
            Sayfalar
          </Link>
        }
      />

      <form action={saveAbout}>
        <Tabs defaultValue="genel" className="w-full">
          <TabsList className="flex-wrap">
            <TabsTrigger value="genel">Genel</TabsTrigger>
            <TabsTrigger value="hikaye">Hikaye</TabsTrigger>
            <TabsTrigger value="degerler">Değerler &amp; Sertifikalar</TabsTrigger>
            <TabsTrigger value="spirituel">Spiritüel</TabsTrigger>
            <TabsTrigger value="cta">CTA</TabsTrigger>
          </TabsList>

          {/* ── GENEL ─────────────────────────────────────────────────── */}
          <TabsContent value="genel" forceMount className="data-[state=inactive]:hidden">
            <div className={sectionClass}>
              <div className="mb-5">
                <h2 className="text-base font-semibold">Giriş Bölümü</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Sayfanın üst kısmındaki başlık, isim, açıklamalar ve profil
                  fotoğrafı.
                </p>
              </div>

              {/* Profil fotoğrafı */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                <div className="space-y-1.5">
                  <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border bg-muted">
                    {profileUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profileUrl}
                        alt="Profil fotoğrafı"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="grid size-full place-items-center text-muted-foreground">
                        <ImageIcon className="size-7" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="profileImage" className="text-sm">
                    Profil Fotoğrafı (Media ID)
                  </Label>
                  <Input
                    id="profileImage"
                    name="profileImage"
                    type="number"
                    inputMode="numeric"
                    defaultValue={profileId ? String(profileId) : ""}
                    placeholder="Örn. 12"
                    className="tabular-nums"
                  />
                  <p className="text-xs text-muted-foreground">
                    Medya Kütüphanesi&apos;nden görselin ID numarasını girin.
                    Boş bırakırsanız kaldırılır.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="subtitle" className="text-sm">
                    Üst Başlık
                  </Label>
                  <Input id="subtitle" name="subtitle" defaultValue={about.subtitle ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-sm">
                    Başlık
                  </Label>
                  <Input id="title" name="title" defaultValue={about.title ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm">
                    İsim
                  </Label>
                  <Input id="name" name="name" defaultValue={about.name ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="appointment" className="text-sm">
                    Randevu Butonu
                  </Label>
                  <Input id="appointment" name="appointment" defaultValue={about.appointment ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mediaButton" className="text-sm">
                    Medya Butonu
                  </Label>
                  <Input id="mediaButton" name="mediaButton" defaultValue={about.mediaButton ?? ""} />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="heroDescription" className="text-sm">
                    Giriş Açıklama 1
                  </Label>
                  <textarea
                    id="heroDescription"
                    name="heroDescription"
                    rows={3}
                    defaultValue={about.heroDescription ?? ""}
                    className={textareaClass}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="heroDescription2" className="text-sm">
                    Giriş Açıklama 2
                  </Label>
                  <textarea
                    id="heroDescription2"
                    name="heroDescription2"
                    rows={3}
                    defaultValue={about.heroDescription2 ?? ""}
                    className={textareaClass}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── HİKAYE ────────────────────────────────────────────────── */}
          <TabsContent value="hikaye" forceMount className="data-[state=inactive]:hidden">
            <div className={sectionClass}>
              <div className="mb-5">
                <h2 className="text-base font-semibold">Hikayem</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Hikaye bölümü başlığı ve paragrafları.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="storyTitle" className="text-sm">
                    Hikaye Başlığı
                  </Label>
                  <Input id="storyTitle" name="storyTitle" defaultValue={about.storyTitle ?? ""} />
                </div>

                {([1, 2, 3, 4] as const).map((n) => {
                  const key = `story${n}` as const;
                  return (
                    <div key={key} className="space-y-1.5">
                      <Label htmlFor={key} className="text-sm">
                        Hikaye Paragrafı {n}
                      </Label>
                      <textarea
                        id={key}
                        name={key}
                        rows={4}
                        defaultValue={about[key] ?? ""}
                        className={textareaClass}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* ── DEĞERLER & SERTİFİKALAR ────────────────────────────────── */}
          <TabsContent value="degerler" forceMount className="data-[state=inactive]:hidden">
            <div className="space-y-6">
              {/* Değerler */}
              <div className={sectionClass}>
                <div className="mb-5">
                  <h2 className="text-base font-semibold">Değerler</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Değerler bölümü başlığı, açıklaması ve dört temel değer.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="valuesTitle" className="text-sm">
                      Değerler Başlığı
                    </Label>
                    <Input id="valuesTitle" name="valuesTitle" defaultValue={about.valuesTitle ?? ""} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="valuesDescription" className="text-sm">
                      Değerler Açıklaması
                    </Label>
                    <textarea
                      id="valuesDescription"
                      name="valuesDescription"
                      rows={2}
                      defaultValue={about.valuesDescription ?? ""}
                      className={textareaClass}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(
                    [
                      { key: "empathy", label: "Empati" },
                      { key: "honesty", label: "Dürüstlük" },
                      { key: "transformation", label: "Dönüşüm" },
                      { key: "excellence", label: "Mükemmellik" },
                    ] as const
                  ).map((g) => {
                    const item = (v as Record<string, { title?: string | null; description?: string | null }>)[g.key] ?? {};
                    return (
                      <div key={g.key} className="rounded-xl border bg-background p-4">
                        <p className="mb-3 text-sm font-semibold text-foreground">
                          {g.label}
                        </p>
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label htmlFor={`values.${g.key}.title`} className="text-xs">
                              Başlık
                            </Label>
                            <input
                              id={`values.${g.key}.title`}
                              name={`values.${g.key}.title`}
                              defaultValue={item.title ?? ""}
                              className={fieldClass}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor={`values.${g.key}.description`} className="text-xs">
                              Açıklama
                            </Label>
                            <textarea
                              id={`values.${g.key}.description`}
                              name={`values.${g.key}.description`}
                              rows={3}
                              defaultValue={item.description ?? ""}
                              className={textareaClass}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sertifikalar */}
              <div className={sectionClass}>
                <div className="mb-5">
                  <h2 className="text-base font-semibold">Sertifikalar</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Aşağıdaki JSON listesini düzenleyin. Her öğe{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">title</code>,{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">organization</code>,{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">year</code>{" "}
                    alanlarını içerir. Geçersiz JSON kaydedilmez.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="certificationsTitle" className="text-sm">
                      Sertifikalar Başlığı
                    </Label>
                    <Input
                      id="certificationsTitle"
                      name="certificationsTitle"
                      defaultValue={about.certificationsTitle ?? ""}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="certifications" className="text-sm">
                      Sertifikalar (JSON)
                    </Label>
                    <textarea
                      id="certifications"
                      name="certifications"
                      rows={10}
                      defaultValue={certificationsJson}
                      className={`${textareaClass} font-mono leading-relaxed`}
                      spellCheck={false}
                    />
                  </div>
                </div>
              </div>

              {/* Yolculuk / Zaman çizelgesi */}
              <div className={sectionClass}>
                <div className="mb-5">
                  <h2 className="text-base font-semibold">Yolculuk (Zaman Çizelgesi)</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Her öğe{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">year</code>,{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">title</code>,{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">description</code>{" "}
                    alanlarını içerir. Geçersiz JSON kaydedilmez.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="journeyTitle" className="text-sm">
                      Yolculuk Başlığı
                    </Label>
                    <Input id="journeyTitle" name="journeyTitle" defaultValue={about.journeyTitle ?? ""} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="timeline" className="text-sm">
                      Zaman Çizelgesi (JSON)
                    </Label>
                    <textarea
                      id="timeline"
                      name="timeline"
                      rows={10}
                      defaultValue={timelineJson}
                      className={`${textareaClass} font-mono leading-relaxed`}
                      spellCheck={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── SPİRİTÜEL ─────────────────────────────────────────────── */}
          <TabsContent value="spirituel" forceMount className="data-[state=inactive]:hidden">
            <div className={sectionClass}>
              <div className="mb-5">
                <h2 className="text-base font-semibold">Spiritüel Yaklaşım</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Spiritüel bölüm başlığı, paragraflar ve yaklaşım listesi.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="spiritualTitle" className="text-sm">
                    Spiritüel Başlık
                  </Label>
                  <Input id="spiritualTitle" name="spiritualTitle" defaultValue={about.spiritualTitle ?? ""} />
                </div>

                {([1, 2, 3] as const).map((n) => {
                  const key = `spiritual${n}` as const;
                  return (
                    <div key={key} className="space-y-1.5">
                      <Label htmlFor={key} className="text-sm">
                        Spiritüel Paragraf {n}
                      </Label>
                      <textarea
                        id={key}
                        name={key}
                        rows={3}
                        defaultValue={about[key] ?? ""}
                        className={textareaClass}
                      />
                    </div>
                  );
                })}

                <div className="space-y-1.5">
                  <Label htmlFor="spiritualApproaches" className="text-sm">
                    Spiritüel Yaklaşımlar (her satıra bir madde)
                  </Label>
                  <textarea
                    id="spiritualApproaches"
                    name="spiritualApproaches"
                    rows={6}
                    defaultValue={approachesText}
                    className={textareaClass}
                    placeholder={"Yaklaşım 1\nYaklaşım 2\nYaklaşım 3"}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── CTA ───────────────────────────────────────────────────── */}
          <TabsContent value="cta" forceMount className="data-[state=inactive]:hidden">
            <div className={sectionClass}>
              <div className="mb-5">
                <h2 className="text-base font-semibold">Çağrı Bölümü (CTA)</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Sayfanın alt kısmındaki eylem çağrısı.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ctaTitle" className="text-sm">
                    CTA Başlık
                  </Label>
                  <Input id="ctaTitle" name="ctaTitle" defaultValue={about.ctaTitle ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ctaDescription" className="text-sm">
                    CTA Açıklama
                  </Label>
                  <textarea
                    id="ctaDescription"
                    name="ctaDescription"
                    rows={3}
                    defaultValue={about.ctaDescription ?? ""}
                    className={textareaClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ctaButton" className="text-sm">
                    CTA Buton
                  </Label>
                  <Input id="ctaButton" name="ctaButton" defaultValue={about.ctaButton ?? ""} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* ── Kaydet ──────────────────────────────────────────────────── */}
        <div className="mt-6 flex justify-end">
          <Button type="submit">
            <Save className="size-4" />
            Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
