"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle, Compass, ArrowRight, Quote } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function NovaVeraPage() {
  const { t } = useLanguage();
  const nv = t.novaVera;

  return (
    <>
      <Header />
      <main className="pt-28">
        {/* Hero */}
        <section className="py-28 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/kaynaklar-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--dark)]/85 via-[var(--dark)]/80 to-[var(--dark)]/90" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[var(--amber)] text-sm font-semibold tracking-wider uppercase mb-6">
                <Sparkles size={16} />
                {nv.brand}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                {nv.tagline}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Intro */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none text-[var(--text-body)]"
            >
              {nv.intro.map((p: string, i: number) => (
                <p key={i} className="mb-6 leading-relaxed">{p}</p>
              ))}
              <p className="text-2xl font-bold text-[var(--dark)] text-center my-8">
                {nv.introQuestion}
              </p>
              <p className="leading-relaxed">{nv.introAnswer}</p>
            </motion.div>
          </div>
        </section>

        {/* What is */}
        <section className="py-20 bg-[var(--soft)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-[var(--dark)] mb-6">
                  {nv.whatTitle}
                </h2>
                {nv.what.map((p: string, i: number) => (
                  <p key={i} className="mb-5 text-[var(--text-body)] leading-relaxed">{p}</p>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
              >
                <img
                  src="/programlar-bg.jpg"
                  alt="Dönüşüm yolculuğu"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center mt-12 max-w-3xl mx-auto">
              <p className="text-xl font-semibold text-[var(--indigo)]">
                {nv.whatQuestion}
              </p>
            </div>
          </div>
        </section>

        {/* Journey */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1"
              >
                <img
                  src="/kaynaklar-bg.jpg"
                  alt="Yeni bir bilinçle yaşamı yeniden tasarlamak"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-1 lg:order-2"
              >
                <h2 className="text-3xl font-bold text-[var(--dark)] mb-6">
                  {nv.journeyTitle}
                </h2>
                {nv.journey.map((p: string, i: number) => (
                  <p key={i} className="mb-5 text-[var(--text-body)] leading-relaxed">{p}</p>
                ))}
                <p className="text-xl font-bold text-gradient mt-6">
                  {nv.journeyHighlight}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Includes */}
        <section className="py-20 bg-[var(--soft)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-[var(--dark)] mb-6">
                {nv.includesTitle}
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">{nv.includesIntro}</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {nv.includes.map((item: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  className="bg-white rounded-2xl p-5 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-[var(--lavender)] flex items-center justify-center flex-shrink-0">
                    <Compass size={18} className="text-[var(--indigo)]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--dark)]">{item}</span>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-[var(--text-muted)] max-w-2xl mx-auto">
              {nv.includesNote}
            </p>
          </div>
        </section>

        {/* Outcomes */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[var(--dark)] mb-10 text-center">
                {nv.outcomesTitle}
              </h2>
              <ul className="space-y-4 mb-10">
                {nv.outcomes.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--text-body)]">
                    <CheckCircle size={20} className="text-[var(--emerald)] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xl font-semibold text-[var(--dark)] text-center mb-6">
                {nv.outcomesFinal}
              </p>
              <p className="text-[var(--text-muted)] text-center">{nv.outcomesNote}</p>
            </motion.div>
          </div>
        </section>

        {/* Image band */}
        <section className="relative h-[320px] md:h-[420px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hizmetler-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-[var(--dark)]/55" />
          <div className="relative z-10 h-full flex items-center justify-center px-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white text-2xl md:text-3xl font-semibold text-center max-w-3xl leading-relaxed"
            >
              {nv.quote}
            </motion.p>
          </div>
        </section>

        {/* Not a session */}
        <section className="py-20 bg-[var(--soft)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[var(--dark)] mb-8 text-center">
                {nv.notSessionTitle}
              </h2>
              {nv.notSession.map((p: string, i: number) => (
                <p key={i} className="mb-6 text-[var(--text-body)] leading-relaxed">{p}</p>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Who */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[var(--dark)] mb-8 text-center">
                {nv.whoTitle}
              </h2>
              <p className="mb-6 text-[var(--text-body)]">{nv.whoIntro}</p>
              <ul className="space-y-3 mb-6">
                {nv.who.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--text-body)]">
                    <ArrowRight size={18} className="text-[var(--indigo)] mt-1 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              {nv.whoOutro && <p className="mb-6 text-[var(--text-body)]">{nv.whoOutro}</p>}
              <p className="text-[var(--text-muted)]">{nv.whoNote}</p>
            </motion.div>
          </div>
        </section>

        {/* First step + CTA */}
        <section className="py-20 gradient-dark text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8">{nv.firstStepTitle}</h2>
              {nv.firstStep.map((p: string, i: number) => (
                <p key={i} className="mb-5 text-[var(--lavender)] leading-relaxed">{p}</p>
              ))}

              <div className="my-10 flex items-start justify-center gap-3">
                <Quote size={24} className="text-[var(--amber)] flex-shrink-0" />
                <p className="text-xl font-semibold italic max-w-xl">{nv.quote}</p>
              </div>

              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--dark)] rounded-full font-semibold hover:bg-[var(--lavender)] transition-all"
              >
                {nv.ctaButton} <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
