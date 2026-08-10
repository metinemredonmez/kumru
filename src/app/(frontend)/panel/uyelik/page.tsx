"use client";

import { useEffect, useState } from "react";
import { Check, Sparkles, Crown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageContext";
import { useMember } from "@/i18n/MemberContext";

interface Plan {
  id: number | string; name: string; tier: "free" | "premium" | "vip";
  price?: string; features?: { item?: string }[]; highlighted?: boolean;
}

const RANK: Record<string, number> = { free: 0, premium: 1, vip: 2 };
const TIER_ICON = { free: Star, premium: Sparkles, vip: Crown };
const WHATSAPP = "905343675669";

export default function PanelMembershipPage() {
  const { language } = useLanguage();
  const { member } = useMember();
  const lang = language === "en" ? "en" : "tr";
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/membership-plans?locale=${lang}&sort=order&limit=20`)
      .then((r) => (r.ok ? r.json() : { docs: [] }))
      .then((d) => setPlans(d?.docs || []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, [lang]);

  const memberTier = member?.membershipTier || "free";
  const t = {
    title: lang === "en" ? "Membership" : "Üyeliğim",
    sub: lang === "en" ? "One Premium plan unlocks everything." : "Tek Premium plan her şeyi açar.",
    current: lang === "en" ? "Current plan" : "Mevcut planın",
    upgrade: lang === "en" ? "Upgrade" : "Yükselt",
    popular: lang === "en" ? "MOST POPULAR" : "EN POPÜLER",
    wa: lang === "en" ? "Hello, I'd like info about Premium membership." : "Merhaba, Premium üyelik hakkında bilgi almak istiyorum.",
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground mt-1">{t.sub}</p>
      </div>

      {loading ? (
        <div className="text-muted-foreground py-16 text-center animate-pulse">…</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3 items-stretch">
          {plans.map((plan) => {
            const Icon = TIER_ICON[plan.tier] || Star;
            const isCurrent = memberTier === plan.tier;
            const canUpgrade = RANK[plan.tier] > RANK[memberTier];
            return (
              <Card key={plan.id} className={cn("relative flex flex-col", plan.highlighted && "border-primary ring-1 ring-primary/20")}>
                {plan.highlighted && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground">
                    {t.popular}
                  </span>
                )}
                <CardContent className="flex flex-col flex-1 p-6">
                  <span className={cn("grid place-items-center size-11 rounded-xl mb-4",
                    plan.highlighted ? "bg-primary text-primary-foreground" : "bg-accent text-primary")}>
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <div className="text-2xl font-extrabold text-foreground mt-1 mb-5">{plan.price}</div>
                  <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                    {(plan.features || []).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="size-4 text-primary shrink-0 mt-0.5" /> {f.item}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <Badge variant="soft" className="justify-center py-2">✓ {t.current}</Badge>
                  ) : canUpgrade ? (
                    <Button asChild className="w-full">
                      <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t.wa)}`} target="_blank" rel="noopener noreferrer">
                        {t.upgrade}
                      </a>
                    </Button>
                  ) : (
                    <div className="h-10" />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
