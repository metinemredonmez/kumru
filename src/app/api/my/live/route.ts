import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

const RANK: Record<string, number> = { guest: -1, free: 0, premium: 1, vip: 2 };

/**
 * YouTube linkinden video/live ID çıkarır.
 * Desteklenen formatlar: watch?v=, youtu.be/, /live/, /embed/
 * Ayrıca doğrudan 11 karakterlik ID de kabul edilir.
 */
function extractYoutubeId(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  const url = raw.trim();

  // Doğrudan ID (11 karakter, tipik YouTube ID formatı)
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;

  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/, // watch?v=
    /youtu\.be\/([A-Za-z0-9_-]{11})/, // youtu.be/
    /\/live\/([A-Za-z0-9_-]{11})/, // /live/
    /\/embed\/([A-Za-z0-9_-]{11})/, // /embed/
    /\/shorts\/([A-Za-z0-9_-]{11})/, // /shorts/
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m?.[1]) return m[1];
  }
  return undefined;
}

/**
 * Yayındaki canlı yayınları, üyenin erişim durumuyla listeler.
 * Kilitli yayınlar için youtubeId gönderilmez.
 */
export const GET = async (req: Request) => {
  try {
    const payload = await getPayload({ config });
    const lang = new URL(req.url).searchParams.get("lang") === "en" ? "en" : "tr";
    const { user } = await payload.auth({ headers: req.headers });
    const isMember = user && (user as { collection?: string }).collection === "members";
    const memberTier = isMember ? ((user as { membershipTier?: string }).membershipTier || "free") : "guest";

    const res = await payload.find({
      collection: "live-streams",
      where: { published: { not_equals: false } },
      sort: ["scheduledAt", "order"],
      locale: lang,
      depth: 0,
      limit: 200,
      pagination: false,
    });

    const streams = res.docs.map((s) => {
      const requiredTier = (s.requiredTier as string) || "premium";
      const tierOk = requiredTier === "free" ? true : RANK[memberTier] >= RANK[requiredTier];
      const youtubeId = tierOk ? extractYoutubeId(s.youtubeUrl as string) : undefined;
      return {
        id: s.id,
        title: s.title,
        description: s.description,
        scheduledAt: s.scheduledAt,
        status: s.status || "upcoming",
        requiredTier,
        tierOk,
        youtubeId,
      };
    });

    return Response.json({ isMember: Boolean(isMember), memberTier, streams });
  } catch (error) {
    console.error("[/api/my/live] error:", error);
    return Response.json({ error: "Sunucu hatası" }, { status: 500 });
  }
};
