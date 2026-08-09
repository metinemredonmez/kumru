# kumrukoseler.com

Kumru Köseler — yaşam koçluğu & spiritüel danışmanlık web sitesi.

**Stack:** Next.js 16 (App Router) + Payload CMS 3 (gömülü admin panel) + SQLite + Tailwind CSS 4

## Mimari

- `src/app/(frontend)/` — site sayfaları (TR/EN, i18n: `src/i18n/`)
- `src/app/(payload)/` — Payload admin panel (`/admin`) ve CMS REST API
- `src/app/api/content` — CMS içeriğini i18n JSON şekliyle sunar; frontend bunu bundle çevirilerin üzerine merge eder (CMS kapalıysa site bundle içerikle çalışır)
- `src/app/api/contact` — iletişim formu → panelde "İletişim Mesajları"
- `src/app/api/chat` — AI chatbot (OpenAI, sistem promptu CMS'ten)
- `src/payload.config.ts` — koleksiyonlar: spiritüel seanslar, koçluk hizmetleri, programlar, etkinlikler, videolar (YouTube/mp4), SSS, medya; globals: site ayarları, chatbot

## Kurulum

Node **22+** gerekir.

```bash
npm ci
cp .env.example .env   # değerleri doldurun
npm run migrate        # veritabanı şeması
npm run seed           # başlangıç içeriği + ilk admin kullanıcı
npm run dev            # http://localhost:3000 — panel: /admin
```

## Komutlar

| Komut | İş |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run migrate` | DB migration uygula |
| `npm run seed` | İçerik aktar (idempotent — dolu koleksiyonları atlar) |
| `npm run generate:types` | `src/payload-types.ts` üret |
| `npm run generate:importmap` | Admin import map üret (config değişince) |

## Deploy (VPS)

pm2 ile `npm start` (bkz. sunucudaki `kumru-web` süreci), nginx tüm istekleri uygulamaya proxy'ler. `kumru.db` ve `uploads/` kalıcı veridir — yedekleyin, silmeyin.
