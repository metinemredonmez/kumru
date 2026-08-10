"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface Member {
  id: number | string;
  name?: string;
  email?: string;
  membershipTier?: "free" | "premium" | "vip";
  membershipExpiresAt?: string | null;
}

interface MemberContextType {
  member: Member | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider = ({ children }: { children: ReactNode }) => {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/members/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setMember(data?.user || null);
      } else {
        setMember(null);
      }
    } catch {
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/members/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setMember(data?.user || null);
        return { ok: true };
      }
      const err = await res.json().catch(() => ({}));
      return { ok: false, error: err?.errors?.[0]?.message || "E-posta veya şifre hatalı." };
    } catch {
      return { ok: false, error: "Bağlantı hatası." };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        // Kayıt sonrası otomatik giriş
        return await login(email, password);
      }
      const err = await res.json().catch(() => ({}));
      return { ok: false, error: err?.errors?.[0]?.message || "Kayıt oluşturulamadı. E-posta zaten kullanılıyor olabilir." };
    } catch {
      return { ok: false, error: "Bağlantı hatası." };
    }
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/members/logout", { method: "POST", credentials: "include" });
    } catch {
      /* yoksay */
    }
    setMember(null);
  }, []);

  return (
    <MemberContext.Provider value={{ member, loading, refresh, login, register, logout }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = () => {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error("useMember must be used within a MemberProvider");
  return ctx;
};

export default MemberContext;
