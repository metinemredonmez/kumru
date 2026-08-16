# kumrukoseler.com

Kumru Köseler — kişisel-marka dönüşüm platformu: yaşam koçluğu, spiritüel danışmanlık, **üyelik + ilerlemeli programlar + canlı yayın**.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · **Tailwind CSS 4** · **shadcn/ui** · Payload CMS 3 (SQLite) · Node **22+**

---

## 🎨 Tasarım sistemi — NEREDEN GELDİĞİNİ HATIRLA

Bu projenin arayüzü **hazır/ücretli bir template DEĞİL** — sıfırdan kodlandı.

- **Temel:** **shadcn/ui + Tailwind CSS 4**. Bileşenler `src/components/ui/*` altında (bizim kodumuz). İkonlar `lucide-react`, grafikler `recharts`.
- **İlham (feyz):** kendi `fal-app` projemizin admin'i (o **TailAdmin** tabanlı) — düzeni oradan örnek aldık, **shadcn ile yeniden yazdık** (kod kopyalamadık).
- **Marka rengi:** indigo `#5B2EFF` (primary), mor `#8B5CF6` (accent), gelir/premium için amber/gold. Tüm renkler **CSS token** olarak `src/app/(frontend)/globals.css`'te; açık + koyu tema `[data-theme]` ile.
- **Tek dil her yerde:** site, üye paneli (`/panel`) ve yönetim paneli (`/yonetim`) aynı shadcn + Tailwind + indigo dilini kullanır.

> Aynı tasarımı başka projede kullanmak için `docs/DESIGN-PROMPT.md` içindeki hazır prompt'u kullan.

---

## 🏗️ Mimari

Payload CMS **arka planda veri + kimlik katmanı**; arayüzler onun üstüne Next.js ile yazıldı.

| Bölüm | Yol | Kim girer |
|---|---|---|
| **Site** (pazarlama, TR/EN) | `src/app/(frontend)/` | Herkes |
| **Üye paneli** | `src/app/(frontend)/panel/` → `/panel` | Danışanlar (`members`) |
| **Yönetim paneli** (custom, modern) | `src/app/(yonetim)/yonetim/` → `/yonetim` | Admin (`users`) |
| **Payload admin** (yedek) | `src/app/(payload)/` → `/admin` → `/yonetim`'e yönlenir | Admin |

- **İki auth koleksiyonu:** `users` (admin) · `members` (danışan). Ayrı, karışmaz.
- **CMS köprüsü:** `src/app/api/content` — içeriği i18n JSON verir; frontend bundle çevirilerin üstüne merge eder (CMS kapalıysa bundle ile çalışır).
- **Üye API'leri:** `src/app/api/my/*` (programlar, ilerleme, canlı yayın) — tier-gate + complete-to-unlock.
- **Ödeme:** `src/lib/payments/` + `src/app/api/checkout/*` (İyzico + Stripe; anahtarlar `integrations` global'inden/`.env`'den; başarıda `subscriptions` kaydı → hook üye seviyesini otomatik verir).
- Ortak admin bileşenleri: `src/components/yonetim/*` · Payload config: `src/payload.config.ts`

## ✨ Özellikler
Üyelik seviyeleri (Ücretsiz/Premium/VIP) · **ilerlemeli programlar** (aşama tamamlamadan diğeri açılmaz) · abonelik yönetimi · İyzico+Stripe ödeme · **canlı yayın** (YouTube gömme, Premium'a kilitli) · e-posta + **Google** giriş · admin: dashboard, raporlar (+CSV), rol/yetki, audit log, ⌘K arama, koyu tema, kullanım kılavuzu.

## 🚀 Kurulum (yerel)
Node **22+** gerekir.
```bash
npm install
cp .env.example .env        # değerleri doldur
npm run migrate
npm run seed                # başlangıç içeriği + ilk admin
npm run dev                 # http://localhost:3000 · panel: /yonetim
```

## 🌐 Deploy (VPS + pm2)
```bash
cd /home/kumrukoseler.com/app && git pull && npm install && npm run build && npm run migrate && npm run seed && pm2 restart kumru-web
```
> **`npm install` şart** — paket eklendiğinde atlanırsa CSS/build kırılır. Yeni koleksiyon eklendiyse `npm run migrate` da şart. `kumru.db` ve `uploads/` kalıcı veridir — silme/yedekle.

## 🔑 `.env` anahtarları (özellikleri aktive eder)
```
PAYLOAD_SECRET=...              # güçlü, sabit
DATABASE_URI=file:./kumru.db
NEXT_PUBLIC_SERVER_URL=https://kumrukoseler.com
# Google ile giriş:
GOOGLE_CLIENT_ID=...  GOOGLE_CLIENT_SECRET=...  NEXT_PUBLIC_GOOGLE_AUTH=true
# Ödeme (Entegrasyonlar panelinden de girilebilir):
IYZICO_API_KEY=...  IYZICO_SECRET_KEY=...  STRIPE_SECRET_KEY=...  STRIPE_WEBHOOK_SECRET=...
# Chatbot:
OPENAI_API_KEY=...
```

## 📚 Komutlar
| Komut | İş |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run migrate` | DB migration uygula |
| `npm run seed` | İçerik aktar (idempotent) |
| `npm run generate:types` / `generate:importmap` | Payload tipleri / admin import map |
