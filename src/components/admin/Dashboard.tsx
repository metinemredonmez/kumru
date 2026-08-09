import React from "react";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";

async function safeCount(slug: string): Promise<number> {
  try {
    const payload = await getPayload({ config });
    const res = await payload.count({ collection: slug as never });
    return res.totalDocs ?? 0;
  } catch {
    return 0;
  }
}

const quickLinks = [
  { href: "/admin/collections/spiritual-sessions", title: "Spiritüel Seanslar", desc: "Seansları ve fiyatları düzenle", icon: "✦" },
  { href: "/admin/collections/coaching-services", title: "Koçluk Hizmetleri", desc: "Hizmet içeriklerini yönet", icon: "◇" },
  { href: "/admin/collections/programs", title: "Programlar", desc: "Retreat ve paketler", icon: "❋" },
  { href: "/admin/collections/events", title: "Etkinlikler", desc: "Seminer ve etkinlikler", icon: "❑" },
  { href: "/admin/collections/videos", title: "Videolar", desc: "YouTube ve mp4 içerikleri", icon: "▷" },
  { href: "/admin/globals/site-settings", title: "Ayarlar", desc: "İletişim ve site bilgileri", icon: "⚙" },
];

export const Dashboard = async () => {
  const [messages, sessions, events, videos] = await Promise.all([
    safeCount("contact-messages"),
    safeCount("spiritual-sessions"),
    safeCount("events"),
    safeCount("videos"),
  ]);

  const dateStr = new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const stats = [
    { label: "Yeni Mesaj", value: messages, href: "/admin/collections/contact-messages" },
    { label: "Spiritüel Seans", value: sessions, href: "/admin/collections/spiritual-sessions" },
    { label: "Etkinlik", value: events, href: "/admin/collections/events" },
    { label: "Video", value: videos, href: "/admin/collections/videos" },
  ];

  return (
    <div className="kumru-dash">
      <header className="kumru-dash__head">
        <h1 className="kumru-dash__title">Panel</h1>
        <p className="kumru-dash__date">{dateStr}</p>
      </header>

      <section className="kumru-dash__stats">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="kumru-stat">
            <span className="kumru-stat__label">{s.label}</span>
            <span className="kumru-stat__value">{s.value}</span>
          </Link>
        ))}
      </section>

      <section className="kumru-dash__panel">
        <h2 className="kumru-dash__section-title">Son İletişim Mesajları</h2>
        <div className="kumru-dash__panel-body">
          {messages > 0 ? (
            <p>
              {messages} mesaj var.{" "}
              <Link href="/admin/collections/contact-messages">Tümünü görüntüle →</Link>
            </p>
          ) : (
            <>
              <p className="kumru-dash__empty-title">Henüz mesaj yok</p>
              <p className="kumru-dash__empty-sub">
                Web sitesindeki iletişim formundan gelen mesajlar burada listelenir.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="kumru-dash__quick">
        <h2 className="kumru-dash__section-title">Hızlı Erişim</h2>
        <div className="kumru-dash__quick-grid">
          {quickLinks.map((q) => (
            <Link key={q.href} href={q.href} className="kumru-quick">
              <span className="kumru-quick__icon">{q.icon}</span>
              <span className="kumru-quick__title">{q.title}</span>
              <span className="kumru-quick__desc">{q.desc}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
