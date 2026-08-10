import { headers as nextHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

type SearchResult = {
  group: string;
  label: string;
  href: string;
};

const PER_COLLECTION_LIMIT = 5;

// İlişki alanının (member) adını güvenli biçimde çöz.
const memberName = (member: unknown): string => {
  if (member && typeof member === "object") {
    const m = member as { name?: string; email?: string };
    return m.name || m.email || "Üye";
  }
  return "Üye";
};

export const GET = async (req: Request) => {
  try {
    const payload = await getPayload({ config });

    // Admin doğrulama
    const { user } = await payload.auth({ headers: await nextHeaders() });
    if (!user || (user as { collection?: string }).collection !== "users") {
      return Response.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    if (!q) {
      return Response.json({ results: [] });
    }

    const common = {
      limit: PER_COLLECTION_LIMIT,
      depth: 0 as const,
      locale: "tr" as const,
      pagination: false as const,
    };

    const [
      members,
      courses,
      subscriptions,
      contactMessages,
      blogPosts,
      spiritualSessions,
      events,
    ] = await Promise.all([
      payload.find({
        collection: "members",
        where: { or: [{ name: { like: q } }, { email: { like: q } }] },
        ...common,
      }),
      payload.find({
        collection: "courses",
        where: { title: { like: q } },
        ...common,
      }),
      payload.find({
        collection: "subscriptions",
        where: { "member.name": { like: q } },
        ...common,
        depth: 1,
      }),
      payload.find({
        collection: "contact-messages",
        where: {
          or: [
            { name: { like: q } },
            { email: { like: q } },
            { subject: { like: q } },
          ],
        },
        ...common,
      }),
      payload.find({
        collection: "blog-posts",
        where: { title: { like: q } },
        ...common,
      }),
      payload.find({
        collection: "spiritual-sessions",
        where: { title: { like: q } },
        ...common,
      }),
      payload.find({
        collection: "events",
        where: { title: { like: q } },
        ...common,
      }),
    ]);

    const results: SearchResult[] = [];

    for (const m of members.docs) {
      results.push({
        group: "Üyeler",
        label: (m.name as string) || (m.email as string) || "Üye",
        href: `/yonetim/uyeler/${m.id}`,
      });
    }

    for (const c of courses.docs) {
      results.push({
        group: "Programlar",
        label: (c.title as string) || "Program",
        href: `/yonetim/programlar/${c.id}`,
      });
    }

    for (const s of subscriptions.docs) {
      results.push({
        group: "Abonelikler",
        label: memberName(s.member),
        href: "/yonetim/abonelikler",
      });
    }

    for (const msg of contactMessages.docs) {
      const label =
        (msg.name as string) ||
        (msg.subject as string) ||
        (msg.email as string) ||
        "Mesaj";
      results.push({
        group: "Mesajlar",
        label,
        href: "/yonetim/mesajlar",
      });
    }

    for (const b of blogPosts.docs) {
      results.push({
        group: "Blog Yazıları",
        label: (b.title as string) || "Blog Yazısı",
        href: "/yonetim/icerik/kaynaklar",
      });
    }

    for (const ss of spiritualSessions.docs) {
      results.push({
        group: "Spiritüel Seanslar",
        label: (ss.title as string) || "Seans",
        href: "/yonetim/icerik/hizmetler",
      });
    }

    for (const e of events.docs) {
      results.push({
        group: "Etkinlikler",
        label: (e.title as string) || "Etkinlik",
        href: "/yonetim/icerik/etkinlikler",
      });
    }

    return Response.json({ results });
  } catch (error) {
    return Response.json(
      { error: "Arama yapılamadı", detail: String(error) },
      { status: 500 },
    );
  }
};
