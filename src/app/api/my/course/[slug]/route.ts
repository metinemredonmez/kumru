import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

const RANK: Record<string, number> = { guest: -1, free: 0, premium: 1, vip: 2 };

/**
 * Bir programın aşamalarını, üyenin durumuna göre KİLİTLİ/AÇIK hesaplayarak döndürür.
 * Kilitli aşamaların içeriği GÖNDERİLMEZ (yalnızca başlık + özet). Güvenlik burada.
 * Kural: tier yeterli olmalı + (aşama 1) VEYA (önceki aşama tamamlanmış) — hızlı geçilemez.
 */
export const GET = async (req: Request, { params }: { params: Promise<{ slug: string }> }) => {
  try {
    const { slug } = await params;
    const payload = await getPayload({ config });
    const lang = new URL(req.url).searchParams.get("lang") === "en" ? "en" : "tr";

    const { user } = await payload.auth({ headers: req.headers });
    const isMember = user && (user as { collection?: string }).collection === "members";
    const memberTier = isMember ? ((user as { membershipTier?: string }).membershipTier || "free") : "guest";

    const courseRes = await payload.find({
      collection: "courses",
      where: { slug: { equals: slug }, published: { not_equals: false } },
      locale: lang,
      depth: 1,
      limit: 1,
    });
    const course = courseRes.docs[0];
    if (!course) return Response.json({ error: "Program bulunamadı" }, { status: 404 });

    const requiredTier = (course.requiredTier as string) || "premium";
    const tierOk = requiredTier === "free" ? true : RANK[memberTier] >= RANK[requiredTier];

    const stagesRes = await payload.find({
      collection: "program-stages",
      where: { program: { equals: course.id } },
      sort: "order",
      locale: lang,
      depth: 1,
      limit: 200,
      pagination: false,
    });

    // Üyenin bu programdaki ilerlemesi
    let completed: number[] = [];
    let currentStage = 1;
    if (isMember) {
      const enr = await payload.find({
        collection: "enrollments",
        where: { member: { equals: user.id }, program: { equals: course.id } },
        limit: 1,
      });
      if (enr.docs[0]) {
        completed = ((enr.docs[0].completedStages as number[]) || []).filter((n) => typeof n === "number");
        currentStage = (enr.docs[0].currentStage as number) || 1;
      }
    }

    const rule = (course.unlockRule as string) || "complete";

    const stages = stagesRes.docs.map((s) => {
      const order = (s.order as number) || 0;
      let unlocked = false;
      if (!tierOk) {
        unlocked = false;
      } else if (rule === "open") {
        unlocked = true;
      } else if (rule === "manual") {
        unlocked = order <= currentStage;
      } else {
        // complete (ve drip için sunucu tarafı basit): 1. aşama + önceki tamamlandıysa
        unlocked = order === 1 || completed.includes(order - 1);
      }
      const done = completed.includes(order);
      const media = s.video as { url?: string } | undefined;
      return {
        order,
        title: s.title,
        summary: s.summary,
        estimatedMinutes: s.estimatedMinutes,
        done,
        unlocked,
        // İçerik SADECE açık aşamalarda gönderilir
        content: unlocked ? s.content : undefined,
        video: unlocked && media && typeof media === "object" ? media.url : undefined,
      };
    });

    const cover = course.coverImage as { url?: string } | undefined;
    return Response.json({
      title: course.title,
      slug: course.slug,
      description: course.description,
      coverImage: cover && typeof cover === "object" ? cover.url : undefined,
      requiredTier,
      unlockRule: rule,
      tierOk,
      memberTier,
      isMember: Boolean(isMember),
      totalStages: stages.length,
      completedCount: stages.filter((s) => s.done).length,
      stages,
    });
  } catch (error) {
    console.error("[/api/my/course] error:", error);
    return Response.json({ error: "Sunucu hatası" }, { status: 500 });
  }
};
