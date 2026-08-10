"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, GraduationCap, Sparkles, UserRound, LogOut, Menu, X, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { useMember } from "@/i18n/MemberContext";

const TIER_LABEL: Record<string, { tr: string; en: string }> = {
  free: { tr: "Ücretsiz", en: "Free" },
  premium: { tr: "Premium", en: "Premium" },
  vip: { tr: "VIP", en: "VIP" },
};

export default function PanelShell({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const { member, loading, logout } = useMember();
  const pathname = usePathname();
  const router = useRouter();
  const lang = language === "en" ? "en" : "tr";
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!loading && !member) {
      router.replace(`/giris?next=${encodeURIComponent(pathname || "/panel")}`);
    }
  }, [loading, member, router, pathname]);

  // Route değişince mobil menüyü kapat
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const nav = [
    { label: lang === "en" ? "Dashboard" : "Panel", href: "/panel", icon: LayoutDashboard },
    { label: lang === "en" ? "My Programs" : "Programlarım", href: "/panel/programlarim", icon: GraduationCap },
    { label: lang === "en" ? "Membership" : "Üyeliğim", href: "/panel/uyelik", icon: Sparkles },
    { label: lang === "en" ? "Account" : "Hesabım", href: "/panel/hesabim", icon: UserRound },
  ];

  if (loading || !member) {
    return (
      <div className="panel min-h-screen grid place-items-center text-muted-foreground">
        <div className="animate-pulse">…</div>
      </div>
    );
  }

  const tier = member.membershipTier || "free";
  const initials = (member.name || member.email || "?")
    .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const SidebarInner = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid place-items-center size-8 rounded-lg bg-primary text-primary-foreground font-bold">K</span>
          <span className="font-bold text-sidebar-foreground tracking-tight">Kumru<span className="text-primary">.</span></span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/panel" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Alt: siteye dön + kullanıcı + çıkış */}
      <div className="mt-auto px-3 pb-4 flex flex-col gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-sidebar-accent/60 transition-colors"
        >
          <ExternalLink className="size-3.5" /> {lang === "en" ? "Back to site" : "Siteye dön"}
        </Link>
        <Separatorish />
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar className="size-9 bg-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-sidebar-foreground">{member.name || "-"}</div>
            <Badge variant="soft" className="mt-0.5 h-4 px-1.5 text-[10px]">{TIER_LABEL[tier]?.[lang] || tier}</Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => { await logout(); router.push("/"); }}
          className="justify-start text-muted-foreground hover:text-destructive"
        >
          <LogOut className="size-4" /> {lang === "en" ? "Log out" : "Çıkış yap"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="panel min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-sidebar border-r border-sidebar-border z-30">
        {SidebarInner}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-sidebar border-b border-sidebar-border">
        <Link href="/panel" className="flex items-center gap-2 font-bold text-sidebar-foreground">
          <span className="grid place-items-center size-7 rounded-md bg-primary text-primary-foreground text-sm font-bold">K</span>
          Kumru
        </Link>
        <button onClick={() => setMobileOpen((v) => !v)} className="p-2 text-sidebar-foreground" aria-label="Menu">
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border z-50">
            {SidebarInner}
          </aside>
        </>
      )}

      {/* Main */}
      <main className="lg:pl-64 min-h-screen">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}

function Separatorish() {
  return <div className="h-px bg-sidebar-border mx-2" />;
}
