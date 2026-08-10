"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { useMember } from "@/i18n/MemberContext";

const COPY = {
  tr: {
    loginTitle: "Tekrar Hoş Geldin",
    loginSub: "Dönüşüm yolculuğuna kaldığın yerden devam et.",
    registerTitle: "Aramıza Katıl",
    registerSub: "Ücretsiz hesabını oluştur, yolculuğa bugün başla.",
    name: "Ad Soyad",
    email: "E-posta",
    password: "Şifre",
    loginBtn: "Giriş Yap",
    registerBtn: "Hesap Oluştur",
    toRegister: "Hesabın yok mu? Kayıt ol",
    toLogin: "Zaten hesabın var mı? Giriş yap",
    passwordHint: "En az 8 karakter",
  },
  en: {
    loginTitle: "Welcome Back",
    loginSub: "Continue your transformation journey where you left off.",
    registerTitle: "Join Us",
    registerSub: "Create your free account and start today.",
    name: "Full Name",
    email: "Email",
    password: "Password",
    loginBtn: "Log In",
    registerBtn: "Create Account",
    toRegister: "Don't have an account? Sign up",
    toLogin: "Already have an account? Log in",
    passwordHint: "At least 8 characters",
  },
};

function AuthForm() {
  const { language } = useLanguage();
  const { login, register } = useMember();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/panel";
  const c = COPY[language === "en" ? "en" : "tr"];

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res =
      mode === "login"
        ? await login(email.trim(), password)
        : await register(name.trim(), email.trim(), password);
    setBusy(false);
    if (res.ok) {
      router.push(next);
    } else {
      setError(res.error || "Bir hata oluştu.");
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="max-w-md mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-[var(--lavender)]/40 shadow-sm p-8"
      >
        <h1 className="text-2xl font-bold text-[var(--dark)] mb-1">
          {isLogin ? c.loginTitle : c.registerTitle}
        </h1>
        <p className="text-[var(--text-body)] text-sm mb-6">{isLogin ? c.loginSub : c.registerSub}</p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          {!isLogin && (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-[var(--dark)]">{c.name}</span>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-body)]/50" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--lavender)]/50 focus:border-[var(--indigo)] focus:ring-2 focus:ring-[var(--indigo)]/20 outline-none transition-all text-[var(--dark)]"
                />
              </div>
            </label>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[var(--dark)]">{c.email}</span>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-body)]/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--lavender)]/50 focus:border-[var(--indigo)] focus:ring-2 focus:ring-[var(--indigo)]/20 outline-none transition-all text-[var(--dark)]"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[var(--dark)]">{c.password}</span>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-body)]/50" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--lavender)]/50 focus:border-[var(--indigo)] focus:ring-2 focus:ring-[var(--indigo)]/20 outline-none transition-all text-[var(--dark)]"
              />
            </div>
            {!isLogin && <span className="text-xs text-[var(--text-body)]/60">{c.passwordHint}</span>}
          </label>

          {error && (
            <div className="text-sm text-[var(--rose)] bg-[var(--rose)]/10 rounded-lg px-4 py-3">{error}</div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--indigo)] text-white font-semibold hover:bg-[var(--purple)] transition-colors disabled:opacity-60"
          >
            {busy && <Loader2 size={18} className="animate-spin" />}
            {isLogin ? c.loginBtn : c.registerBtn}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(isLogin ? "register" : "login");
            setError(null);
          }}
          className="w-full text-center text-sm text-[var(--indigo)] font-medium mt-5 hover:underline"
        >
          {isLogin ? c.toRegister : c.toLogin}
        </button>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="pt-28 lg:pt-36 pb-24 bg-gradient-to-b from-[var(--soft)]/40 to-white min-h-screen flex items-start">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Suspense fallback={<div className="text-center text-[var(--text-body)]">…</div>}>
            <AuthForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
