"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const WHATSAPP = "905343675669";
const WA_MSG = "Merhaba, Premium üyelik hakkında bilgi almak istiyorum.";

interface UpgradeButtonProps {
  tier: "premium" | "vip" | string;
  label: string;
  className?: string;
}

/**
 * Üyelik yükseltme butonu.
 * Tıklayınca POST /api/checkout { tier } çağırır ve cevaba göre yönlendirir:
 *  - { url }                -> Stripe Checkout'a yönlendir
 *  - { paymentPageUrl }     -> İyzico ödeme sayfasına yönlendir (tercih edilir)
 *  - { checkoutFormContent} -> İyzico form script'ini enjekte et
 *  - { error, fallback }    -> WhatsApp'a düş
 *  - 401                    -> /giris'e yönlendir
 */
export default function UpgradeButton({ tier, label, className }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const goWhatsApp = () => {
    window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WA_MSG)}`;
  };

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tier }),
      });

      if (res.status === 401) {
        window.location.href = "/giris?next=/panel/uyelik";
        return;
      }

      let data: {
        url?: string;
        paymentPageUrl?: string;
        checkoutFormContent?: string;
        error?: string;
        fallback?: string;
      } = {};
      try {
        data = await res.json();
      } catch {
        // gövde okunamadı -> aşağıda fallback
      }

      // Stripe
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // İyzico: ödeme sayfası URL'i varsa onu tercih et (en basiti)
      if (data.paymentPageUrl) {
        window.location.href = data.paymentPageUrl;
        return;
      }

      // İyzico: form script'i (paymentPageUrl yoksa)
      if (data.checkoutFormContent) {
        const container = document.createElement("div");
        container.id = "iyzipay-checkout-form";
        container.className = "responsive";
        document.body.appendChild(container);

        // Script içeriğini ayrıştır ve yeniden çalışacak şekilde enjekte et
        const wrapper = document.createElement("div");
        wrapper.innerHTML = data.checkoutFormContent;
        const scripts = Array.from(wrapper.querySelectorAll("script"));
        // Önce script olmayan içerik
        wrapper.querySelectorAll("script").forEach((s) => s.remove());
        container.appendChild(wrapper);
        // Script'leri yeniden oluştur (innerHTML ile eklenen script'ler çalışmaz)
        scripts.forEach((old) => {
          const s = document.createElement("script");
          if (old.src) s.src = old.src;
          if (old.type) s.type = old.type;
          s.text = old.text;
          container.appendChild(s);
        });
        return;
      }

      // Hata veya bilinmeyen cevap -> WhatsApp fallback (güvenli davranış)
      goWhatsApp();
    } catch {
      // Ağ hatası vb. -> WhatsApp fallback
      goWhatsApp();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-busy={loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed",
        className,
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {label}
    </button>
  );
}
