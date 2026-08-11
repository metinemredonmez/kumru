import PageHeader from "@/components/yonetim/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  LogIn, CheckCircle2, Mail, UserPlus, CreditCard, Tag, Radio, GraduationCap,
  Images, FileText, BarChart3, Settings, Search, Moon, Bell, ArrowLeft, Smartphone,
} from "lucide-react";

export const dynamic = "force-dynamic";

const STEPS_LOGIN = [
  { b: "kumrukoseler.com/yonetim adresini aç.", d: "Giriş yapmadıysan otomatik giriş ekranına gider." },
  { b: "E-posta + şifreni gir, Login'e bas.", d: "Bir kez girince 30 gün seni hatırlar — her seferinde tekrar girmezsin." },
  { b: "Karşına Dashboard (özet ekran) gelir.", d: "Sol menüden her yere ulaşırsın." },
];

const DAILY = [
  "Yeni mesaj var mı? → Mesajlar'a bak, WhatsApp'tan dön.",
  "Yeni üye / bekleyen abonelik var mı? → Üyeler / Abonelikler.",
  "Süresi dolacak abonelik var mı? → yenileme için üyeye ulaş.",
  "Planladıysan Canlı Yayın'ı başlat.",
];

const TASKS = [
  { icon: Mail, title: "Mesajları oku", path: "Mesajlar", desc: "İletişim formundan gelenler burada; WhatsApp'tan dönersin." },
  { icon: UserPlus, title: "Üyeye paket ver", path: "Üyeler → üyeye tıkla", desc: "Üyelik seviyesini (Premium/VIP) ve bitiş tarihini ayarla, kaydet." },
  { icon: CreditCard, title: "Abonelik oluştur", path: "Abonelikler → Yeni", desc: "Üye + seviye + tutar gir. Üyenin seviyesi otomatik yükselir." },
  { icon: Tag, title: "Plan fiyatını değiştir", path: "Üyelik Planları", desc: "Ücretsiz/Premium/VIP fiyat ve özelliklerini düzenle." },
  { icon: Radio, title: "Canlı yayın aç", path: "Canlı Yayın → Yeni", desc: "YouTube linkini yapıştır, Premium seç. Üyeler panelden izler." },
  { icon: GraduationCap, title: "Program & aşama", path: "Programlar", desc: "İlerlemeli programları, aşamalarını ve içeriğini düzenle." },
  { icon: Images, title: "İçerik & medya", path: "İçerik & Medya", desc: "Hizmetler, Etkinlikler, Blog, Kaynaklar, Videolar, Yorumlar, Görseller." },
  { icon: FileText, title: "Sayfa metinleri", path: "Sayfa İçerikleri", desc: "Ana sayfa (Hero), Hakkımda, Nova Vera, Medya sayfası, görseller." },
  { icon: BarChart3, title: "Raporlara bak", path: "Raporlar", desc: "Üye büyümesi, gelir, tamamlanma. CSV indirebilirsin." },
  { icon: Settings, title: "Ayarlar & anahtarlar", path: "Ayarlar · Entegrasyonlar", desc: "İletişim bilgileri, Chatbot; ödeme/e-posta/SMS anahtarları (maskeli)." },
];

const CANLI = [
  "Telefonda YouTube uygulaması → “Yayına Başla (Go Live)” ile yayını başlat.",
  "Yayının linkini kopyala (youtube.com/watch?v=… veya youtu.be/…).",
  "Panelde Canlı Yayın → Yeni: başlık + linki yapıştır, Durum: Canlı, Gereken Üyelik: Premium → kaydet.",
  "Üyeler /panel/canli sayfasında canlı izler. Bitince kayıt kalır, tekrar izlenir.",
];

const TIPS = [
  { icon: Search, b: "Hızlı arama:", s: "Üstteki ⌘K (Ctrl+K) ile üye, program, mesaj ara — anında bul." },
  { icon: Moon, b: "Koyu tema:", s: "Üstteki ay/güneş ikonuyla koyu/açık tema arasında geç." },
  { icon: Bell, b: "Bildirim zili:", s: "Yeni mesaj/üye/abonelik sayısını gösterir; bakınca kaybolur, yeni gelince çıkar." },
  { icon: ArrowLeft, b: "Siteye dön:", s: "Sol alttaki bağlantıyla sitenin normal halini görürsün." },
  { icon: Smartphone, b: "Telefondan:", s: "Panel telefonda da açılır; menü sol üstteki ☰ ile açılır." },
];

const AUTO = [
  ["Ödeme → üyelik:", "Üye ödeme yapınca aboneliği ve seviyesi otomatik açılır."],
  ["Süre bitince:", "Aboneliğin süresi dolunca üye otomatik “Ücretsiz”e düşer."],
  ["İşlem kaydı:", "Yaptığın her değişiklik İşlem Kaydı'na otomatik yazılır."],
  ["Anında yansır:", "Buradan girdiğin her şey siteye ve üye paneline anında yansır."],
];

function SectionTitle({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs font-bold text-primary tracking-wider">{n}</span>
      <h2 className="text-lg font-bold text-foreground">{children}</h2>
    </div>
  );
}

export default function KilavuzPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <PageHeader title="Kullanım Kılavuzu" subtitle="Paneli tek başına kullanman için kısa rehber — kod bilmene gerek yok." />

      {/* 1. Giriş */}
      <section>
        <SectionTitle n="01">Panele Giriş</SectionTitle>
        <Card><CardContent className="p-6">
          <ol className="flex flex-col gap-4">
            {STEPS_LOGIN.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid place-items-center size-7 shrink-0 rounded-full bg-primary text-primary-foreground text-sm font-bold">{i + 1}</span>
                <div><div className="font-medium text-foreground">{s.b}</div><div className="text-sm text-muted-foreground">{s.d}</div></div>
              </li>
            ))}
          </ol>
        </CardContent></Card>
      </section>

      {/* 2. Her gün */}
      <section>
        <SectionTitle n="02">Her Gün Ne Yapmalı?</SectionTitle>
        <Card className="bg-accent/40 border-primary/20"><CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3 text-primary font-semibold"><LogIn className="size-4" /> Günlük 2 dakikalık kontrol</div>
          <ul className="flex flex-col gap-2.5">
            {DAILY.map((d, i) => (
              <li key={i} className="flex gap-2.5 items-start text-sm text-foreground/90"><CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" /> {d}</li>
            ))}
          </ul>
        </CardContent></Card>
      </section>

      {/* 3. Sık işler */}
      <section>
        <SectionTitle n="03">Sık Yapılan İşler</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {TASKS.map((t) => {
            const Icon = t.icon;
            return (
              <Card key={t.title}><CardContent className="p-5">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="grid place-items-center size-8 rounded-lg bg-accent text-primary"><Icon className="size-4" /></span>
                  <h3 className="font-bold text-foreground">{t.title}</h3>
                </div>
                <span className="inline-block text-xs font-semibold text-primary bg-accent rounded px-2 py-0.5 mb-2">{t.path}</span>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </CardContent></Card>
            );
          })}
        </div>
      </section>

      {/* 4. Canlı yayın */}
      <section>
        <SectionTitle n="04">Canlı Yayın Nasıl Yapılır? (YouTube)</SectionTitle>
        <Card><CardContent className="p-6">
          <ol className="flex flex-col gap-4">
            {CANLI.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid place-items-center size-7 shrink-0 rounded-full bg-primary text-primary-foreground text-sm font-bold">{i + 1}</span>
                <div className="text-foreground/90 text-sm pt-0.5">{s}</div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">Not: Agora, API anahtarı vb. gerekmez — tüm yayın işini YouTube yapar.</p>
        </CardContent></Card>
      </section>

      {/* 5. İpuçları */}
      <section>
        <SectionTitle n="05">Panel İpuçları</SectionTitle>
        <div className="flex flex-col gap-3">
          {TIPS.map((t) => {
            const Icon = t.icon;
            return (
              <Card key={t.b}><CardContent className="p-4 flex gap-3 items-start">
                <span className="grid place-items-center size-9 shrink-0 rounded-lg bg-accent text-primary"><Icon className="size-[18px]" /></span>
                <div className="text-sm"><b className="text-foreground">{t.b}</b> <span className="text-muted-foreground">{t.s}</span></div>
              </CardContent></Card>
            );
          })}
        </div>
      </section>

      {/* 6. Otomatik */}
      <section>
        <SectionTitle n="06">Senin Uğraşmana Gerek Olmayanlar</SectionTitle>
        <Card className="bg-emerald/10 border-emerald/30"><CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3 text-emerald font-semibold"><CheckCircle2 className="size-4" /> Otomatik çalışır</div>
          <ul className="flex flex-col gap-2.5">
            {AUTO.map(([b, s], i) => (
              <li key={i} className="text-sm text-muted-foreground"><b className="text-foreground">{b}</b> {s}</li>
            ))}
          </ul>
        </CardContent></Card>
      </section>

      <p className="text-sm text-muted-foreground border-t border-border pt-6">
        Takıldığın an: hangi ekranda ne yapacağını bilemezsen ekran görüntüsü al, sor — birlikte hallederiz. 💜
      </p>
    </div>
  );
}
