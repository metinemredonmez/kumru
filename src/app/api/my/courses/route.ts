import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

const RANK: Record<string, number> = { guest: -1, free: 0, premium: 1, vip: 2 };

/**
 * Yayındaki tüm programları, üyenin erişim durumu + ilerleme özetiyle listeler.
 */
export const GET = async (req: Request) => {
  try {
    const payload = await getPayload({ config });
    const lang = new URL(req.url).searchParams.get("lang") === "en" ? "en" : "tr";
    const { user } = await payload.auth({ headers: req.headers });
    const isMember = user && (user as { collection?: string }).collection === "members";
    const memberTier = isMember ? ((user as { membershipTier?: string }).membershipTier || "free") : "guest";

    const coursesRes = await payload.find({
      collection: "courses",
      where: { published: { not_equals: false } },
      sort: "order",
      locale: lang,
      depth: 1,
      limit: 100,
      pagination: false,
    });

    // Üyenin kayıtları
    const enrollMap = new Map<number | string, { completed: number[]; currentStage: number }>();
    if (isMember) {
      const enr = await payload.find({ collection: "enrollments", where: { member: { equals: user.id } }, limit: 200, depth: 0, pagination: false });
      for (const e of enr.docs) {
        const pid = typeof e.program === "object" ? (e.program as { id: number }).id : (e.program as number);
        enrollMap.set(pid, {
          completed: ((e.completedStages as number[]) || []).filter((n) => typeof n === "number"),
          currentStage: (e.currentStage as number) || 1,
        });
      }
    }

    const courses = await Promise.all(
      coursesRes.docs.map(async (c) => {
        const requiredTier = (c.requiredTier as string) || "premium";
        const tierOk = requiredTier === "free" ? true : RANK[memberTier] >= RANK[requiredTier];
        const stageCount = await payload.count({ collection: "program-stages", where: { program: { equals: c.id } } });
        const prog = enrollMap.get(c.id);
        const cover = c.coverImage as { url?: string } | undefined;
        return {
          title: c.title,
          slug: c.slug,
          description: c.description,
          coverImage: cover && typeof cover === "object" ? cover.url : undefined,
          requiredTier,
          tierOk,
          totalStages: stageCount.totalDocs || 0,
          completedCount: prog ? prog.completed.length : 0,
          started: Boolean(prog),
        };
      })
    );

    return Response.json({ memberTier, isMember: Boolean(isMember), courses });
  } catch (error) {
    console.error("[/api/my/courses] error:", error);
    return Response.json({ error: "Sunucu hatası" }, { status: 500 });
  }
};
