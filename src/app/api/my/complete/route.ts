import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

const RANK: Record<string, number> = { guest: -1, free: 0, premium: 1, vip: 2 };

/**
 * Bir aşamayı "tamamlandı" işaretler ve sıradakini açar.
 * Güvenlik: yalnızca AÇIK bir aşama tamamlanabilir — kilitli aşama atlanamaz.
 */
export const POST = async (req: Request) => {
  try {
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: req.headers });
    if (!user || (user as { collection?: string }).collection !== "members") {
      return Response.json({ error: "Giriş gerekli" }, { status: 401 });
    }
    const memberTier = (user as { membershipTier?: string }).membershipTier || "free";

    const body = await req.json().catch(() => ({}));
    const slug = String(body?.slug || "");
    const order = Number(body?.order);
    if (!slug || !Number.isFinite(order)) {
      return Response.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const courseRes = await payload.find({ collection: "courses", where: { slug: { equals: slug } }, limit: 1 });
    const course = courseRes.docs[0];
    if (!course) return Response.json({ error: "Program bulunamadı" }, { status: 404 });

    const requiredTier = (course.requiredTier as string) || "premium";
    const tierOk = requiredTier === "free" ? true : RANK[memberTier] >= RANK[requiredTier];
    if (!tierOk) return Response.json({ error: "Bu program için üyelik yükseltmen gerekli" }, { status: 403 });

    // Mevcut kayıt
    const enrRes = await payload.find({
      collection: "enrollments",
      where: { member: { equals: user.id }, program: { equals: course.id } },
      limit: 1,
    });
    const existing = enrRes.docs[0];
    const completed: number[] = existing ? (((existing.completedStages as number[]) || []).filter((n) => typeof n === "number")) : [];

    const rule = (course.unlockRule as string) || "complete";
    // Kilit kontrolü: complete/manual kuralında sadece açık aşama tamamlanabilir
    const isUnlocked = rule === "open" || order === 1 || completed.includes(order - 1) || (rule === "manual" && order <= ((existing?.currentStage as number) || 1));
    if (!isUnlocked) {
      return Response.json({ error: "Bu aşama henüz kilitli — önceki aşamayı tamamlamalısın" }, { status: 403 });
    }

    const newCompleted = Array.from(new Set([...completed, order])).sort((a, b) => a - b);
    const nextStage = order + 1;

    if (existing) {
      await payload.update({
        collection: "enrollments",
        id: existing.id,
        data: { completedStages: newCompleted, currentStage: Math.max((existing.currentStage as number) || 1, nextStage) },
      });
    } else {
      await payload.create({
        collection: "enrollments",
        data: { member: user.id, program: course.id, completedStages: newCompleted, currentStage: nextStage, status: "active" },
      });
    }

    return Response.json({ ok: true, completedStages: newCompleted, nextStage });
  } catch (error) {
    console.error("[/api/my/complete] error:", error);
    return Response.json({ error: "Sunucu hatası" }, { status: 500 });
  }
};
