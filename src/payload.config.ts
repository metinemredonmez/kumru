import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

// sharp bazı sunucularda native modül sorunu çıkarabiliyor; yüklenemezse
// görsel işleme (crop/resize) kapalı çalışır, uygulama etkilenmez.
const sharp = await import("sharp")
  .then((m) => m.default)
  .catch(() => undefined);

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
    theme: "light",
    meta: {
      titleSuffix: " · Kumru Köseler",
      title: "Kumru Köseler Panel",
      description: "Kumru Köseler web sitesi yönetim paneli",
      icons: [{ rel: "icon", type: "image/png", url: "/favicon.png" }],
    },
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, "app/(payload)/admin/importMap.js"),
    },
    components: {
      graphics: {
        Logo: "/components/admin/Logo#Logo",
        Icon: "/components/admin/Icon#Icon",
      },
      actions: ["/components/admin/ViewSiteAction#ViewSiteAction"],
      views: {
        dashboard: {
          Component: "/components/admin/Dashboard#Dashboard",
        },
      },
    },
  },
  editor: lexicalEditor(),
  localization: {
    locales: [
      { label: "Türkçe", code: "tr" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "tr",
    fallback: true,
  },
  collections: [
    {
      slug: "users",
      auth: true,
      admin: { useAsTitle: "email" },
      labels: { singular: "Kullanıcı", plural: "Kullanıcılar" },
      fields: [
        { name: "name", type: "text", label: "Ad Soyad" },
      ],
    },
    {
      slug: "media",
      labels: { singular: "Medya", plural: "Medya Kütüphanesi" },
      access: { read: () => true },
      upload: {
        staticDir: path.resolve(dirname, "../uploads"),
        mimeTypes: ["image/*", "video/mp4", "video/webm", "application/pdf"],
        ...(sharp ? {} : { crop: false, focalPoint: false }),
      },
      fields: [
        { name: "alt", type: "text", label: "Açıklama (alt metin)", localized: true },
      ],
    },
    {
      slug: "videos",
      labels: { singular: "Video", plural: "Videolar" },
      access: { read: () => true },
      admin: { useAsTitle: "title", defaultColumns: ["title", "source", "published"] },
      fields: [
        { name: "title", type: "text", required: true, localized: true, label: "Başlık" },
        { name: "description", type: "textarea", localized: true, label: "Açıklama" },
        {
          name: "source",
          type: "select",
          required: true,
          defaultValue: "youtube",
          label: "Kaynak",
          options: [
            { label: "YouTube", value: "youtube" },
            { label: "Dosya (mp4)", value: "upload" },
          ],
        },
        {
          name: "youtubeUrl",
          type: "text",
          label: "YouTube Linki",
          admin: { condition: (data) => data?.source === "youtube" },
        },
        {
          name: "videoFile",
          type: "upload",
          relationTo: "media",
          label: "Video Dosyası",
          admin: { condition: (data) => data?.source === "upload" },
        },
        { name: "thumbnail", type: "upload", relationTo: "media", label: "Kapak Görseli" },
        { name: "published", type: "checkbox", defaultValue: true, label: "Yayında" },
        { name: "order", type: "number", defaultValue: 0, label: "Sıra" },
      ],
    },
    {
      slug: "spiritual-sessions",
      labels: { singular: "Spiritüel Seans", plural: "Spiritüel Seanslar" },
      access: { read: () => true },
      admin: { useAsTitle: "title", defaultColumns: ["title", "duration", "price", "order"] },
      fields: [
        { name: "title", type: "text", required: true, localized: true, label: "Seans Adı" },
        { name: "description", type: "textarea", localized: true, label: "Açıklama" },
        { name: "duration", type: "text", localized: true, label: "Süre" },
        { name: "price", type: "text", label: "Fiyat" },
        { name: "order", type: "number", defaultValue: 0, label: "Sıra" },
      ],
    },
    {
      slug: "coaching-services",
      labels: { singular: "Koçluk Hizmeti", plural: "Koçluk Hizmetleri" },
      access: { read: () => true },
      admin: { useAsTitle: "title", defaultColumns: ["title", "duration", "order"] },
      fields: [
        { name: "key", type: "text", required: true, unique: true, label: "Sistem Anahtarı", admin: { description: "Sayfa eşlemesi için - değiştirmeyin (örn. oneOnOne)" } },
        { name: "title", type: "text", required: true, localized: true, label: "Hizmet Adı" },
        { name: "shortDesc", type: "textarea", localized: true, label: "Kısa Açıklama" },
        { name: "fullDesc", type: "textarea", localized: true, label: "Uzun Açıklama" },
        { name: "duration", type: "text", localized: true, label: "Süre" },
        {
          name: "features",
          type: "array",
          localized: true,
          label: "Özellikler",
          fields: [{ name: "feature", type: "text", label: "Özellik" }],
        },
        { name: "order", type: "number", defaultValue: 0, label: "Sıra" },
      ],
    },
    {
      slug: "programs",
      labels: { singular: "Program", plural: "Programlar" },
      access: { read: () => true },
      admin: { useAsTitle: "title", defaultColumns: ["title", "duration", "order"] },
      fields: [
        { name: "key", type: "text", required: true, unique: true, label: "Sistem Anahtarı", admin: { description: "Sayfa eşlemesi için - değiştirmeyin (örn. oneOnOne)" } },
        { name: "title", type: "text", required: true, localized: true, label: "Program Adı" },
        { name: "subtitle", type: "text", localized: true, label: "Alt Başlık" },
        { name: "duration", type: "text", localized: true, label: "Süre" },
        { name: "sessions", type: "text", localized: true, label: "Seans Tipi" },
        { name: "description", type: "textarea", localized: true, label: "Açıklama" },
        {
          name: "includes",
          type: "array",
          localized: true,
          label: "Dahil Olanlar",
          fields: [{ name: "item", type: "text", label: "Madde" }],
        },
        { name: "popular", type: "checkbox", defaultValue: false, label: "En Popüler" },
        { name: "hotelIncluded", type: "checkbox", defaultValue: false, label: "Otel Konaklamalı" },
        { name: "order", type: "number", defaultValue: 0, label: "Sıra" },
      ],
    },
    {
      slug: "events",
      labels: { singular: "Etkinlik", plural: "Etkinlikler" },
      access: { read: () => true },
      admin: { useAsTitle: "title", defaultColumns: ["title", "dateText", "isPast", "order"] },
      fields: [
        { name: "title", type: "text", required: true, localized: true, label: "Etkinlik Adı" },
        { name: "description", type: "textarea", localized: true, label: "Açıklama" },
        { name: "dateText", type: "text", localized: true, label: "Tarih (örn. 15 Mart 2025)" },
        { name: "time", type: "text", label: "Saat (örn. 21:00 - 22:00)" },
        { name: "isPast", type: "checkbox", defaultValue: false, label: "Gerçekleşti" },
        { name: "order", type: "number", defaultValue: 0, label: "Sıra" },
      ],
    },
    {
      slug: "faqs",
      labels: { singular: "SSS", plural: "Sık Sorulan Sorular" },
      access: { read: () => true },
      admin: { useAsTitle: "question" },
      fields: [
        { name: "question", type: "text", required: true, localized: true, label: "Soru" },
        { name: "answer", type: "textarea", localized: true, label: "Cevap" },
        { name: "order", type: "number", defaultValue: 0, label: "Sıra" },
      ],
    },
    {
      slug: "contact-messages",
      labels: { singular: "İletişim Mesajı", plural: "İletişim Mesajları" },
      access: {
        read: ({ req: { user } }) => Boolean(user),
        create: () => true,
        update: () => false,
        delete: ({ req: { user } }) => Boolean(user),
      },
      admin: {
        useAsTitle: "name",
        defaultColumns: ["name", "email", "subject", "createdAt"],
        description: "Web sitesindeki iletişim formundan gelen mesajlar",
      },
      fields: [
        { name: "name", type: "text", required: true, label: "Ad Soyad" },
        { name: "email", type: "email", required: true, label: "E-posta" },
        { name: "phone", type: "text", label: "Telefon" },
        { name: "subject", type: "text", label: "Konu" },
        { name: "message", type: "textarea", required: true, label: "Mesaj" },
      ],
    },
  ],
  globals: [
    {
      slug: "site-settings",
      label: "Site Ayarları",
      access: { read: () => true },
      fields: [
        { name: "email", type: "text", label: "E-posta", defaultValue: "kumrukoseler@gmail.com" },
        { name: "phone", type: "text", label: "Telefon", defaultValue: "+90 534 367 56 69" },
        { name: "whatsapp", type: "text", label: "WhatsApp Numarası (link için)", defaultValue: "905343675669" },
        { name: "address", type: "textarea", localized: true, label: "Adres", defaultValue: "Akmerkez Residens, Kültür, Nisbetiye Cd, 34100 Beşiktaş/İstanbul" },
        { name: "hours", type: "text", localized: true, label: "Çalışma Saatleri", defaultValue: "Pazartesi - Cumartesi: 09:00 - 19:00" },
        { name: "instagram", type: "text", label: "Instagram URL", defaultValue: "https://www.instagram.com/kumrukoseler/" },
        { name: "youtube", type: "text", label: "YouTube URL", defaultValue: "https://www.youtube.com/@kumrukoseler9055" },
      ],
    },
    {
      slug: "chatbot",
      label: "Chatbot Ayarları",
      access: { read: () => true },
      fields: [
        {
          name: "systemPrompt",
          type: "textarea",
          label: "Sistem Promptu",
          admin: {
            description: "Chatbot'un kimliği, hizmet listesi ve kuralları. Değişiklik sonrası bot otomatik güncellenir.",
            rows: 30,
          },
        },
      ],
    },
  ],
  secret: process.env.PAYLOAD_SECRET || "kumru-dev-secret-degistir",
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./kumru.db",
    },
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
