import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

const FALLBACK_PROMPT = `You are 'Kumru Assistant', the digital assistant on Kumru Köseler's website. Respond in the user's language (Turkish or English). Be short, warm and professional. For appointments and pricing of coaching programs, direct users to WhatsApp: +90 534 367 56 69`;

export const POST = async (req: Request) => {
  let language = "tr";
  try {
    const body = await req.json();
    const messages: { role: string; content: string }[] = Array.isArray(body?.messages)
      ? body.messages
      : [];
    language = body?.language === "en" ? "en" : "tr";

    const apiKey = process.env.OPENAI_API_KEY || "";
    if (!apiKey) {
      console.error("chat: OPENAI_API_KEY tanımlı değil");
      return errorResponse(language);
    }

    let systemPrompt = FALLBACK_PROMPT;
    try {
      const payload = await getPayload({ config });
      const chatbot = await payload.findGlobal({ slug: "chatbot" });
      if (chatbot?.systemPrompt) systemPrompt = chatbot.systemPrompt;
    } catch (e) {
      console.error("chat: CMS promptu okunamadı, fallback kullanılıyor", e);
    }

    const sanitized = messages
      .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string")
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, ...sanitized],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!r.ok) {
      console.error("chat: OpenAI hatası", r.status, await r.text());
      return errorResponse(language);
    }

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) return errorResponse(language);

    return Response.json({ message: reply });
  } catch (e) {
    console.error("chat: beklenmeyen hata", e);
    return errorResponse(language);
  }
};

function errorResponse(language: string) {
  const msg =
    language === "tr"
      ? "Bir hata oluştu. Lütfen WhatsApp üzerinden bize ulaşın: +90 534 367 56 69"
      : "An error occurred. Please contact us via WhatsApp: +90 534 367 56 69";
  return Response.json({ message: msg }, { status: 500 });
}
