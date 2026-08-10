import { headers as nextHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

type NotificationItem = {
  key: string;
  label: string;
  count: number;
  href: string;
};

export const GET = async () => {
  try {
    const payload = await getPayload({ config });

    // Admin doğrulama
    const { user } = await payload.auth({ headers: await nextHeaders() });
    if (!user || (user as { collection?: string }).collection !== "users") {
      return Response.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [yeniMesaj, bekleyenAbonelik, sonaErenAbonelik, yeniUye] = await Promise.all([
      payload.count({ collection: "contact-messages" }),
      payload.count({
        collection: "subscriptions",
        where: { status: { equals: "pending" } },
      }),
      payload.count({
        collection: "subscriptions",
        where: {
          and: [
            { status: { equals: "active" } },
            { expiresAt: { less_than: in30Days.toISOString() } },
          ],
        },
      }),
      payload.count({
        collection: "members",
        where: { createdAt: { greater_than: last7Days.toISOString() } },
      }),
    ]);

    const items: NotificationItem[] = [
      {
        key: "yeniMesaj",
        label: "Yeni mesaj",
        count: yeniMesaj.totalDocs,
        href: "/yonetim/mesajlar",
      },
      {
        key: "bekleyenAbonelik",
        label: "Bekleyen abonelik",
        count: bekleyenAbonelik.totalDocs,
        href: "/yonetim/abonelikler",
      },
      {
        key: "sonaErenAbonelik",
        label: "Süresi yaklaşan abonelik",
        count: sonaErenAbonelik.totalDocs,
        href: "/yonetim/abonelikler",
      },
      {
        key: "yeniUye",
        label: "Yeni üye",
        count: yeniUye.totalDocs,
        href: "/yonetim/uyeler",
      },
    ];

    const total = items.reduce((sum, item) => sum + item.count, 0);

    return Response.json({ items, total });
  } catch (error) {
    return Response.json(
      { error: "Bildirimler alınamadı", detail: String(error) },
      { status: 500 },
    );
  }
};
