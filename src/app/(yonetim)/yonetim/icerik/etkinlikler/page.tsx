import Link from "next/link";
import { headers as nextHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  CalendarDays,
  HelpCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import PageHeader from "@/components/yonetim/PageHeader";
import EmptyState from "@/components/yonetim/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

const BASE = "/yonetim/icerik/etkinlikler";

const textareaClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

// ── Yetki doğrulama yardımcısı ───────────────────────────────────────────
async function assertAdmin() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user || (user as { collection?: string }).collection !== "users") {
    throw new Error("Yetkisiz işlem.");
  }
  return payload;
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => {
  const n = Number.parseInt(String(fd.get(k) ?? ""), 10);
  return Number.isFinite(n) ? n : 0;
};

// ── Etkinlik: oluştur / güncelle / sil ───────────────────────────────────
async function createEvent(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  await payload.create({
    collection: "events",
    locale: "tr",
    overrideAccess: true,
    data: {
      title: str(formData, "title"),
      description: str(formData, "description"),
      dateText: str(formData, "dateText"),
      time: str(formData, "time"),
      isPast: formData.get("isPast") === "on",
      order: num(formData, "order"),
    },
  });
  revalidatePath(BASE);
  redirect(`${BASE}?tab=events`);
}

async function updateEvent(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const id = str(formData, "id");
  await payload.update({
    collection: "events",
    id,
    locale: "tr",
    overrideAccess: true,
    data: {
      title: str(formData, "title"),
      description: str(formData, "description"),
      dateText: str(formData, "dateText"),
      time: str(formData, "time"),
      isPast: formData.get("isPast") === "on",
      order: num(formData, "order"),
    },
  });
  revalidatePath(BASE);
  redirect(`${BASE}?tab=events`);
}

async function deleteEvent(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  await payload.delete({
    collection: "events",
    id: str(formData, "id"),
    overrideAccess: true,
  });
  revalidatePath(BASE);
  redirect(`${BASE}?tab=events`);
}

// ── SSS: oluştur / güncelle / sil ────────────────────────────────────────
async function createFaq(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  await payload.create({
    collection: "faqs",
    locale: "tr",
    overrideAccess: true,
    data: {
      question: str(formData, "question"),
      answer: str(formData, "answer"),
      order: num(formData, "order"),
    },
  });
  revalidatePath(BASE);
  redirect(`${BASE}?tab=faqs`);
}

async function updateFaq(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  const id = str(formData, "id");
  await payload.update({
    collection: "faqs",
    id,
    locale: "tr",
    overrideAccess: true,
    data: {
      question: str(formData, "question"),
      answer: str(formData, "answer"),
      order: num(formData, "order"),
    },
  });
  revalidatePath(BASE);
  redirect(`${BASE}?tab=faqs`);
}

async function deleteFaq(formData: FormData) {
  "use server";
  const payload = await assertAdmin();
  await payload.delete({
    collection: "faqs",
    id: str(formData, "id"),
    overrideAccess: true,
  });
  revalidatePath(BASE);
  redirect(`${BASE}?tab=faqs`);
}

type SearchParams = { [key: string]: string | undefined };

export default async function EtkinliklerPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const tab = params.tab === "faqs" ? "faqs" : "events";
  const editId = (params.edit ?? "").trim();

  const payload = await getPayload({ config });

  const [eventsRes, faqsRes] = await Promise.all([
    payload.find({
      collection: "events",
      locale: "tr",
      overrideAccess: true,
      limit: 200,
      sort: "order",
      depth: 0,
    }),
    payload.find({
      collection: "faqs",
      locale: "tr",
      overrideAccess: true,
      limit: 200,
      sort: "order",
      depth: 0,
    }),
  ]);

  const events = eventsRes.docs;
  const faqs = faqsRes.docs;

  // Düzenlenmekte olan kayıtlar (aktif sekmeye göre)
  const editingEvent =
    tab === "events" && editId
      ? events.find((e) => String(e.id) === editId)
      : undefined;
  const editingFaq =
    tab === "faqs" && editId
      ? faqs.find((f) => String(f.id) === editId)
      : undefined;

  return (
    <div>
      <PageHeader
        title="Etkinlikler & SSS"
        subtitle="Atölye ve buluşmalar ile sık sorulan soruları düzenleyin."
      />

      <Tabs defaultValue={tab} className="w-full">
        <TabsList>
          <TabsTrigger value="events">
            <CalendarDays className="size-4" />
            Etkinlikler
          </TabsTrigger>
          <TabsTrigger value="faqs">
            <HelpCircle className="size-4" />
            SSS
          </TabsTrigger>
        </TabsList>

        {/* ── ETKİNLİKLER ─────────────────────────────────────────────── */}
        <TabsContent value="events" className="space-y-6">
          {/* Form: düzenle veya yeni ekle */}
          <form
            action={editingEvent ? updateEvent : createEvent}
            className="rounded-2xl border bg-card p-6 shadow-sm"
          >
            {editingEvent && (
              <input type="hidden" name="id" value={String(editingEvent.id)} />
            )}

            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">
                  {editingEvent ? "Etkinliği Düzenle" : "Yeni Etkinlik"}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {editingEvent
                    ? "Seçili etkinliğin bilgilerini güncelleyin."
                    : "Yeni bir atölye veya buluşma ekleyin."}
                </p>
              </div>
              {editingEvent && (
                <Button asChild variant="ghost" size="sm">
                  <Link href={`${BASE}?tab=events`}>
                    <X className="size-4" />
                    İptal
                  </Link>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="ev-title" className="text-sm">
                  Etkinlik Adı
                </Label>
                <Input
                  id="ev-title"
                  name="title"
                  required
                  defaultValue={editingEvent?.title ?? ""}
                  placeholder="Örn. Farkındalık Atölyesi"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ev-dateText" className="text-sm">
                  Tarih
                </Label>
                <Input
                  id="ev-dateText"
                  name="dateText"
                  defaultValue={editingEvent?.dateText ?? ""}
                  placeholder="15 Mart 2025"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ev-time" className="text-sm">
                  Saat
                </Label>
                <Input
                  id="ev-time"
                  name="time"
                  defaultValue={editingEvent?.time ?? ""}
                  placeholder="21:00 - 22:00"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="ev-description" className="text-sm">
                  Açıklama
                </Label>
                <textarea
                  id="ev-description"
                  name="description"
                  rows={4}
                  defaultValue={editingEvent?.description ?? ""}
                  className={textareaClass}
                  placeholder="Etkinlik hakkında kısa bilgi"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ev-order" className="text-sm">
                  Sıra
                </Label>
                <Input
                  id="ev-order"
                  name="order"
                  type="number"
                  defaultValue={String(editingEvent?.order ?? 0)}
                />
              </div>

              <div className="flex items-end">
                <label
                  htmlFor="ev-isPast"
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <input
                    id="ev-isPast"
                    name="isPast"
                    type="checkbox"
                    defaultChecked={Boolean(editingEvent?.isPast)}
                    className="size-4 rounded border-input accent-primary"
                  />
                  Gerçekleşti (geçmiş etkinlik)
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit">
                {editingEvent ? (
                  <>
                    <Save className="size-4" />
                    Güncelle
                  </>
                ) : (
                  <>
                    <Plus className="size-4" />
                    Ekle
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Liste */}
          {events.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Henüz etkinlik yok"
              description="Yukarıdaki formu kullanarak ilk etkinliği ekleyin."
            />
          ) : (
            <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14 text-right tabular-nums">
                      Sıra
                    </TableHead>
                    <TableHead>Etkinlik</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Saat</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((e) => (
                    <TableRow key={String(e.id)}>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {e.order ?? 0}
                      </TableCell>
                      <TableCell className="font-medium">{e.title}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {e.dateText || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {e.time || "—"}
                      </TableCell>
                      <TableCell>
                        {e.isPast ? (
                          <Badge variant="secondary">Gerçekleşti</Badge>
                        ) : (
                          <Badge>Yaklaşan</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="ghost" size="sm">
                            <Link
                              href={`${BASE}?tab=events&edit=${String(e.id)}`}
                            >
                              <Pencil className="size-3.5" />
                              Düzenle
                            </Link>
                          </Button>
                          <form action={deleteEvent}>
                            <input
                              type="hidden"
                              name="id"
                              value={String(e.id)}
                            />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                              Sil
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ── SSS ─────────────────────────────────────────────────────── */}
        <TabsContent value="faqs" className="space-y-6">
          {/* Form: düzenle veya yeni ekle */}
          <form
            action={editingFaq ? updateFaq : createFaq}
            className="rounded-2xl border bg-card p-6 shadow-sm"
          >
            {editingFaq && (
              <input type="hidden" name="id" value={String(editingFaq.id)} />
            )}

            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">
                  {editingFaq ? "Soruyu Düzenle" : "Yeni Soru"}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {editingFaq
                    ? "Seçili sık sorulan soruyu güncelleyin."
                    : "Yeni bir sık sorulan soru ekleyin."}
                </p>
              </div>
              {editingFaq && (
                <Button asChild variant="ghost" size="sm">
                  <Link href={`${BASE}?tab=faqs`}>
                    <X className="size-4" />
                    İptal
                  </Link>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="faq-question" className="text-sm">
                  Soru
                </Label>
                <Input
                  id="faq-question"
                  name="question"
                  required
                  defaultValue={editingFaq?.question ?? ""}
                  placeholder="Örn. Seanslar online mı yapılıyor?"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="faq-answer" className="text-sm">
                  Cevap
                </Label>
                <textarea
                  id="faq-answer"
                  name="answer"
                  rows={5}
                  defaultValue={editingFaq?.answer ?? ""}
                  className={textareaClass}
                  placeholder="Sorunun cevabı"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="faq-order" className="text-sm">
                  Sıra
                </Label>
                <Input
                  id="faq-order"
                  name="order"
                  type="number"
                  defaultValue={String(editingFaq?.order ?? 0)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit">
                {editingFaq ? (
                  <>
                    <Save className="size-4" />
                    Güncelle
                  </>
                ) : (
                  <>
                    <Plus className="size-4" />
                    Ekle
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Liste */}
          {faqs.length === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title="Henüz soru yok"
              description="Yukarıdaki formu kullanarak ilk soruyu ekleyin."
            />
          ) : (
            <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14 text-right tabular-nums">
                      Sıra
                    </TableHead>
                    <TableHead>Soru</TableHead>
                    <TableHead>Cevap</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.map((f) => (
                    <TableRow key={String(f.id)}>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {f.order ?? 0}
                      </TableCell>
                      <TableCell className="font-medium">{f.question}</TableCell>
                      <TableCell className="max-w-md truncate text-muted-foreground">
                        {f.answer || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`${BASE}?tab=faqs&edit=${String(f.id)}`}>
                              <Pencil className="size-3.5" />
                              Düzenle
                            </Link>
                          </Button>
                          <form action={deleteFaq}>
                            <input
                              type="hidden"
                              name="id"
                              value={String(f.id)}
                            />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                              Sil
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
