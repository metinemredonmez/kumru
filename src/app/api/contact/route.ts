import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SUBJECT_LABELS: Record<string, string> = {
  kesif: "Ücretsiz Keşif Görüşmesi",
  birebir: "Birebir Koçluk",
  spirituel: "Spiritüel Danışmanlık",
  retreat: "Retreat Programları",
  kurumsal: "Kurumsal Koçluk",
  diger: "Diğer",
};

export const POST = async (req: Request) => {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return Response.json(
        { success: false, message: "Lütfen zorunlu alanları doldurun." },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return Response.json(
        { success: false, message: "Geçerli bir e-posta adresi giriniz." },
        { status: 400 },
      );
    }

    if (message.length > 5000 || name.length > 200) {
      return Response.json(
        { success: false, message: "Lütfen zorunlu alanları doldurun." },
        { status: 400 },
      );
    }

    const payload = await getPayload({ config });

    await payload.create({
      collection: "contact-messages",
      data: {
        name,
        email,
        phone,
        subject: SUBJECT_LABELS[subject] ?? subject,
        message,
      },
    });

    return Response.json({ success: true, message: "Mesajınız başarıyla gönderildi!" });
  } catch (error) {
    console.error("Contact form error:", error);
    return Response.json(
      { success: false, message: "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin." },
      { status: 500 },
    );
  }
};
