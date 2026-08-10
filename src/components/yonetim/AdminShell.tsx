"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  CreditCard,
  GraduationCap,
  Images,
  MessageSquare,
  FileText,
  Settings,
  Plug,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string; icon: LucideIcon };

const MENU: NavItem[] = [
  { label: "Dashboard", href: "/yonetim", icon: LayoutDashboard },
  { label: "Raporlar", href: "/yonetim/raporlar", icon: BarChart3 },
  { label: "Üyeler", href: "/yonetim/uyeler", icon: Users },
  { label: "Abonelikler", href: "/yonetim/abonelikler", icon: CreditCard },
  { label: "Programlar", href: "/yonetim/programlar", icon: GraduationCap },
  { label: "İçerik & Medya", href: "/yonetim/icerik", icon: Images },
  { label: "Mesajlar", href: "/yonetim/mesajlar", icon: MessageSquare },
];

const SYSTEM: NavItem[] = [
  { label: "Sayfa İçerikleri", href: "/yonetim/sayfalar", icon: FileText },
  { label: "Ayarlar", href: "/yonetim/ayarlar", icon: Settings },
  { label: "Entegrasyonlar", href: "/yonetim/entegrasyonlar", icon: Plug },
];

export type AdminUser = { name?: string | null; email: string };

function isActive(pathname: string | null, href: string) {
  if (href === "/yonetim") return pathname === "/yonetim";
  return pathname === href || (pathname?.startsWith(href + "/") ?? false);
}

function NavLink({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string | null;
}) {
  const active = isActive(pathname, item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="size-[18px] shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function SidebarInner({
  pathname,
  user,
}: {
  pathname: string | null;
  user: AdminUser;
}) {
  const initials = (user.name || user.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <Link href="/yonetim" className="flex items-center gap-2.5">
          <span className="grid place-items-center size-8 rounded-lg bg-primary text-primary-foreground font-bold">
            K
          </span>
          <span className="font-bold text-sidebar-foreground tracking-tight">
            Kumru<span className="text-primary">.</span>
            <span className="ml-1 text-xs font-medium text-muted-foreground">
              Yönetim
            </span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col">
        <div className="px-2.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Menü
        </div>
        <div className="flex flex-col gap-1">
          {MENU.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        <div className="flex-1" />

        <div className="px-2.5 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Sistem
        </div>
        <div className="flex flex-col gap-1">
          {SYSTEM.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </nav>

      {/* Kullanıcı kartı + Çıkış */}
      <div className="mt-auto border-t border-sidebar-border px-3 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <span className="grid place-items-center size-9 shrink-0 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-sidebar-foreground">
              {user.name || user.email}
            </div>
            <div className="text-xs text-muted-foreground">Yönetici</div>
          </div>
        </div>
        <a
          href="/admin/logout"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent/60 hover:text-destructive transition-colors"
        >
          <LogOut className="size-4" /> Çıkış
        </a>
      </div>
    </div>
  );
}

export default function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Route değişince mobil menüyü kapat
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="panel min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-sidebar border-r border-sidebar-border z-30">
        <SidebarInner pathname={pathname} user={user} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border z-50">
            <SidebarInner pathname={pathname} user={user} />
          </aside>
        </>
      )}

      {/* Main column */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Sticky header */}
        <header className="sticky top-0 z-20 flex items-center gap-3 h-16 px-4 sm:px-6 lg:px-8 bg-sidebar/80 backdrop-blur border-b border-sidebar-border">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 -ml-2 text-sidebar-foreground"
            aria-label="Menü"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="flex-1" />
          <div className="text-sm font-medium text-sidebar-foreground">
            {user.name || user.email}
          </div>
        </header>

        {/* Main */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
