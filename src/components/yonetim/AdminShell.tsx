"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  CreditCard,
  GraduationCap,
  Radio,
  Images,
  MessageSquare,
  FileText,
  Settings,
  Plug,
  Tag,
  Package,
  UserCog,
  ScrollText,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Moon,
  Sun,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type NavItem = { label: string; href: string; icon: LucideIcon };

const MENU: NavItem[] = [
  { label: "Dashboard", href: "/yonetim", icon: LayoutDashboard },
  { label: "Raporlar", href: "/yonetim/raporlar", icon: BarChart3 },
  { label: "Üyeler", href: "/yonetim/uyeler", icon: Users },
  { label: "Abonelikler", href: "/yonetim/abonelikler", icon: CreditCard },
  { label: "Üyelik Planları", href: "/yonetim/planlar", icon: Tag },
  { label: "Programlar", href: "/yonetim/programlar", icon: GraduationCap },
  { label: "Paketler", href: "/yonetim/paketler", icon: Package },
  { label: "Canlı Yayın", href: "/yonetim/canli", icon: Radio },
  { label: "İçerik & Medya", href: "/yonetim/icerik", icon: Images },
  { label: "Mesajlar", href: "/yonetim/mesajlar", icon: MessageSquare },
];

const SYSTEM: NavItem[] = [
  { label: "Sayfa İçerikleri", href: "/yonetim/sayfalar", icon: FileText },
  { label: "İşlem Kaydı", href: "/yonetim/audit", icon: ScrollText },
  { label: "Kullanıcılar", href: "/yonetim/kullanicilar", icon: UserCog },
  { label: "Ayarlar", href: "/yonetim/ayarlar", icon: Settings },
  { label: "Entegrasyonlar", href: "/yonetim/entegrasyonlar", icon: Plug },
];

// Editör rolünün göremeyeceği sistem öğeleri (sadece super-admin görür).
const EDITOR_HIDDEN_HREFS = new Set([
  "/yonetim/kullanicilar",
  "/yonetim/entegrasyonlar",
]);

export type AdminUser = { name?: string | null; email: string; role?: string };

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

  // Rol gate: editör "Kullanıcılar" ve "Entegrasyonlar" öğelerini görmez.
  const systemItems =
    user.role === "editor"
      ? SYSTEM.filter((item) => !EDITOR_HIDDEN_HREFS.has(item.href))
      : SYSTEM;

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <Link href="/yonetim" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Kumru Köseler" className="h-8 w-auto" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground rounded bg-muted px-1.5 py-0.5">
            Yönetim
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
          {systemItems.map((item) => (
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

/* ===================== KOYU TEMA TOGGLE ===================== */

type Theme = "light" | "dark";

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="text-sidebar-foreground"
      aria-label={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
      title={theme === "dark" ? "Açık tema" : "Koyu tema"}
    >
      {theme === "dark" ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </Button>
  );
}

/* ===================== ⌘K GLOBAL ARAMA ===================== */

type SearchResult = { group: string; label: string; href: string };

function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Açılınca odak + sıfırla
  useEffect(() => {
    if (open) {
      setQ("");
      setResults([]);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Esc ile kapat
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Debounce'lu fetch
  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    if (!term) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/yonetim/search?q=${encodeURIComponent(term)}`,
          { signal: ctrl.signal }
        );
        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, open]);

  const go = (href: string) => {
    router.push(href);
    onClose();
  };

  if (!open) return null;

  // Sonuçları gruplara ayır
  const groups = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.group] ||= []).push(r);
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Üye, program, mesaj ara…"
            className="h-12 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
          />
          {loading && (
            <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {!q.trim() && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Aramak için yazmaya başlayın.
            </p>
          )}
          {q.trim() && !loading && results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Sonuç bulunamadı.
            </p>
          )}
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="mb-1">
              <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </div>
              {items.map((r, i) => (
                <button
                  key={`${group}-${i}`}
                  onClick={() => go(r.href)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="truncate">{r.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
          <span>Enter ile git</span>
          <span>Esc ile kapat</span>
        </div>
      </div>
    </div>
  );
}

/* ===================== BİLDİRİM ZİLİ ===================== */

type NotificationItem = {
  key: string;
  label: string;
  count: number;
  href: string;
};

function NotificationBell() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [seen, setSeen] = useState(0);

  // "Görüldü" durumu: zile bakınca badge kaybolur, sayı artınca tekrar çıkar.
  useEffect(() => {
    const s = Number(localStorage.getItem("yonetim-notif-seen") || "0");
    if (Number.isFinite(s)) setSeen(s);
  }, []);
  const markSeen = () => {
    setSeen(total);
    try { localStorage.setItem("yonetim-notif-seen", String(total)); } catch { /* yoksay */ }
  };
  const showBadge = total > 0 && total > seen;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/yonetim/notifications");
        const data = await res.json();
        if (!active) return;
        setItems(Array.isArray(data.items) ? data.items : []);
        setTotal(typeof data.total === "number" ? data.total : 0);
      } catch {
        /* sessizce yut */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <DropdownMenu onOpenChange={(open) => { if (open) markSeen(); }}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-sidebar-foreground"
          aria-label="Bildirimler"
        >
          <Bell className="size-5" />
          {showBadge && (
            <span className="absolute right-1 top-1 grid min-w-[18px] place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-4 text-destructive-foreground">
              {total > 99 ? "99+" : total}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 && (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            Bildirim yok.
          </div>
        )}
        {items.map((item) => (
          <DropdownMenuItem
            key={item.key}
            onSelect={(e) => {
              e.preventDefault();
              router.push(item.href);
            }}
            className="flex items-center justify-between gap-2 cursor-pointer"
          >
            <span className="truncate">{item.label}</span>
            <Badge
              variant={item.count > 0 ? "default" : "secondary"}
              className="shrink-0"
            >
              {item.count}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
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
  const [theme, setTheme] = useState<Theme>("light");
  const [searchOpen, setSearchOpen] = useState(false);

  // Route değişince mobil menüyü kapat
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // İlk yüklemede temayı localStorage'dan oku
  useEffect(() => {
    const saved = localStorage.getItem("yonetim-theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("yonetim-theme", next);
      return next;
    });
  }, []);

  // ⌘K / Ctrl+K kısayolu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="panel min-h-screen" data-theme={theme}>
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

          {/* Ara (⌘K) */}
          <Button
            variant="outline"
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex h-9 items-center gap-2 text-muted-foreground"
          >
            <Search className="size-4" />
            <span className="text-sm">Ara</span>
            <kbd className="ml-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
              ⌘K
            </kbd>
          </Button>
          {/* Mobil arama ikonu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="sm:hidden text-sidebar-foreground"
            aria-label="Ara"
          >
            <Search className="size-5" />
          </Button>

          {/* Bildirim zili */}
          <NotificationBell />

          {/* Koyu tema toggle */}
          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          <div className="hidden sm:block text-sm font-medium text-sidebar-foreground">
            {user.name || user.email}
          </div>
        </header>

        {/* ⌘K Arama modalı */}
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

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
