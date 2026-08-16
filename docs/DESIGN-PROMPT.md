# Tasarım Prompt'u — bu panelin görünümünü başka projede kullanmak için

Bu projenin arayüzü (site + `/panel` üye alanı + `/yonetim` yönetim paneli) **shadcn/ui + Tailwind CSS 4 + indigo `#5B2EFF`** ile sıfırdan kodlandı; hazır template değil, `fal-app` (TailAdmin) düzeninden ilham alındı.

Aynı tasarımı başka bir projede kurmak için aşağıdaki prompt'u herhangi bir AI'ya (Claude Code, v0, Cursor…) yapıştır:

```text
# GÖREV: Modern SaaS Yönetim Paneli / Dashboard tasarla

## Teknoloji
- Next.js (App Router) + React + TypeScript + Tailwind CSS v4
- Bileşen sistemi: shadcn/ui (kendi kodumuzda, src/components/ui altında)
- İkonlar: lucide-react · Grafikler: recharts
- Renkleri CSS değişkeni (design token) olarak tanımla; hardcoded hex kullanma

## Marka & Renk paleti (CSS token)
- Primary (marka): indigo #5B2EFF  ·  Accent: mor #8B5CF6
- "Para/premium" vurgusu: amber/gold (#A9803F light, #D8B877 dark) — SADECE gelir/premium için
- Nötrler hafif lavanta tonlu: çizgi #E9E6F5, muted-foreground #6A6590
- Zemin #FAF9FE, kart #FFFFFF, ink #1B1836
- Semantic: success emerald, warning amber, danger rose
- radius: 0.75rem · yumuşak gölge (0 10px 30px rgba(91,46,255,.06))

## Açık + Koyu tema (ikisi de şart)
- Tüm renkleri :root'ta token olarak tanımla; koyu tema için [data-theme="dark"] altında override et
- Koyu palet: zemin #131024, kart #1C1833, sidebar #17132C, çizgi #2C2748, ink #F4F2FF
- Header'da ay/güneş toggle; tercih localStorage'da; kök elemana data-theme yaz

## Düzen (shell)
- Sol SABİT sidebar (~256px): üstte logo, GRUPLU nav (üstte ana menü, EN ALTTA "Sistem/Ayarlar" grubu), en altta kullanıcı kartı + Çıkış
- Aktif menü öğesi: dolu indigo "hap" (bg-primary + beyaz metin)
- Yapışkan üst header: sayfa başlığı, sağda ⌘K global arama, bildirim zili (badge), tema toggle, kullanıcı adı
- İçerik: bg-muted zemin, ortalı max-genişlik, p-6
- Mobilde sidebar sheet/drawer olarak açılır (hamburger)
- AÇILIR-KAPANIR (collapsible/accordion) form grubu YOK — uzun formlar shadcn Tabs ile bölünür; detay sayfaları tam genişlik düz form

## Bileşen dili
- Kartlar: rounded-2xl, ince border, bg-card, yumuşak gölge, p-5/p-6
- KPI/stat kartı: köşede tinted ikon chip, minik UPPERCASE letter-spaced etiket, büyük değer (tabular-nums); gelir kartında gold vurgu
- Tablolar: bg-muted UPPERCASE ince başlık, divide-y satırlar, hover; durum/etiketler için rounded-full renkli pill badge; avatar-initial daireler; sağa hizalı aksiyonlar; alt pagination
- Boş durum: EmptyState (ikon + başlık + açıklama) · Yükleme: skeleton
- Grafikler: recharts area/bar; soluk grid, uç nokta vurgusu, marka rengi

## Genel his
Temiz, bilgi-yoğun ama havadar; kurumsal-modern SaaS. Payload/generic "liste+form" görünümünün zıddı. Tutarlı boşluk, net tipografik hiyerarşi. Türkçe arayüz.

## İstersem ekstra
Dashboard'da: "bekleyen aksiyonlar" şeridi + KPI kartları + büyüme grafiği + dağılım. Rol/yetki (menü gizleme), audit log, global ⌘K arama.
```

## Bu projede nerede uygulandı (referans dosyalar)
- Token'lar / açık-koyu tema: `src/app/(frontend)/globals.css` (`:root`, `@theme inline`, `.panel[data-theme="dark"]`)
- shadcn bileşenleri: `src/components/ui/*` (button, card, table, tabs, select, badge, avatar, dropdown-menu, chart-area, chart-bar…)
- Admin shell (sidebar + header + tema/arama/bildirim): `src/components/yonetim/AdminShell.tsx`
- Ortak admin parçaları: `src/components/yonetim/{PageHeader,StatCard,EmptyState}.tsx`, `src/lib/yonetim/format.ts`
- Üye paneli shell: `src/components/panel/PanelShell.tsx`
