"use client";

import { motion } from "framer-motion";
import { CheckCircle, Award, Heart, Sparkles, GraduationCap, Star, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function AboutPage() {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: Heart,
      title: t.about.values.empathy.title,
      description: t.about.values.empathy.description,
    },
    {
      icon: Star,
      title: t.about.values.honesty.title,
      description: t.about.values.honesty.description,
    },
    {
      icon: Sparkles,
      title: t.about.values.transformation.title,
      description: t.about.values.transformation.description,
    },
    {
      icon: Award,
      title: t.about.values.excellence.title,
      description: t.about.values.excellence.description,
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 gradient-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[var(--indigo)] font-semibold tracking-wider uppercase text-sm">
                  {t.about.subtitle}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mt-4 mb-6">
                  {t.about.title}{" "}
                  <span className="text-gradient">{t.about.name}</span>
                </h1>
                <p className="text-lg text-[var(--text-body)] leading-relaxed mb-6">
                  {t.about.heroDescription}
                </p>
                <p className="text-[var(--text-body)] leading-relaxed mb-8">
                  {t.about.heroDescription2}
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/iletisim"
                    className="inline-flex items-center justify-center px-6 py-3 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all"
                  >
                    {t.about.appointment}
                  </Link>
                  <Link
                    href="/medya"
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-[var(--indigo)] text-[var(--indigo)] rounded-full font-semibold hover:bg-[var(--indigo)] hover:text-white transition-all"
                  >
                    {t.about.mediaButton}
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/profile.jpg"
                    alt="Kumru Köseler"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[var(--indigo)] text-white p-6 rounded-2xl shadow-xl">
                  <div className="text-4xl font-bold">10+</div>
                  <div className="text-sm opacity-80">{t.about.experience}</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[var(--dark)] mb-6">
                {t.about.storyTitle}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg max-w-none text-[var(--text-body)]"
            >
              <p className="mb-6">{t.about.story1}</p>
              <p className="mb-6">{t.about.story2}</p>
              <p className="mb-6">{t.about.story3}</p>
              <p>{t.about.story4}</p>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-[var(--soft)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[var(--dark)] mb-4">
                {t.about.valuesTitle}
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                {t.about.valuesDescription}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--lavender)] flex items-center justify-center">
                    <value.icon size={28} className="text-[var(--indigo)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--dark)] mb-2">{value.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[var(--dark)] mb-4">
                {t.about.certificationsTitle}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.about.certifications.map((cert: { title: string; organization: string; year: string }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[var(--soft)] p-6 rounded-2xl"
                >
                  <div className="w-12 h-12 mb-4 rounded-xl bg-[var(--indigo)] flex items-center justify-center">
                    <GraduationCap size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-[var(--dark)] mb-1">{cert.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-2">{cert.organization}</p>
                  <span className="text-xs text-[var(--indigo)] font-medium">{cert.year}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 gradient-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">{t.about.journeyTitle}</h2>
            </motion.div>

            <div className="space-y-8">
              {t.about.timeline.map((item: { year: string; title: string; description: string }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-20 text-right">
                    <span className="text-[var(--amber)] font-bold">{item.year}</span>
                  </div>
                  <div className="w-3 h-3 mt-2 rounded-full bg-[var(--violet)] flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-[var(--lavender)] text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[var(--dark)] mb-6">
                {t.about.ctaTitle}
              </h2>
              <p className="text-[var(--text-body)] mb-8 max-w-2xl mx-auto">
                {t.about.ctaDescription}
              </p>
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all hover:shadow-lg"
              >
                {t.about.ctaButton}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
