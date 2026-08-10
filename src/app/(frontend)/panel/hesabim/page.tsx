"use client";

import { useRouter } from "next/navigation";
import { Mail, User as UserIcon, Sparkles, LogOut, CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/i18n/LanguageContext";
import { useMember } from "@/i18n/MemberContext";

const TIER_LABEL: Record<string, { tr: string; en: string }> = {
  free: { tr: "Ücretsiz", en: "Free" },
  premium: { tr: "Premium", en: "Premium" },
  vip: { tr: "VIP", en: "VIP" },
};

export default function PanelAccountPage() {
  const { language } = useLanguage();
  const { member, logout } = useMember();
  const router = useRouter();
  const lang = language === "en" ? "en" : "tr";
  const tier = member?.membershipTier || "free";

  const t = {
    title: lang === "en" ? "Account" : "Hesabım",
    sub: lang === "en" ? "Your membership details." : "Üyelik bilgilerin.",
    name: lang === "en" ? "Full name" : "Ad Soyad",
    email: lang === "en" ? "Email" : "E-posta",
    membership: lang === "en" ? "Membership" : "Üyelik",
    expires: lang === "en" ? "Expires" : "Bitiş",
    noExpiry: lang === "en" ? "No expiry" : "Süresiz",
    logout: lang === "en" ? "Log out" : "Çıkış yap",
  };

  const expiry = member?.membershipExpiresAt
    ? new Intl.DateTimeFormat(lang === "en" ? "en-US" : "tr-TR", { dateStyle: "long" }).format(new Date(member.membershipExpiresAt))
    : t.noExpiry;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground mt-1">{t.sub}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{member?.name || "-"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Row icon={<UserIcon className="size-4" />} label={t.name} value={member?.name || "-"} />
          <Separator />
          <Row icon={<Mail className="size-4" />} label={t.email} value={member?.email || "-"} />
          <Separator />
          <Row
            icon={<Sparkles className="size-4" />}
            label={t.membership}
            value={<Badge variant="soft">{TIER_LABEL[tier]?.[lang] || tier}</Badge>}
          />
          <Separator />
          <Row icon={<CalendarClock className="size-4" />} label={t.expires} value={expiry} />
        </CardContent>
      </Card>

      <Button
        variant="outline"
        onClick={async () => { await logout(); router.push("/"); }}
        className="self-start text-destructive hover:bg-destructive/5"
      >
        <LogOut className="size-4" /> {t.logout}
      </Button>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">{icon} {label}</div>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
