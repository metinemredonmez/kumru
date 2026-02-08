"use client";

import { motion } from "framer-motion";
import {
  Clock, Users, CheckCircle, ArrowRight, Hotel, Sparkles,
  Calendar, MapPin, Utensils, Wifi, Star
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ProgramsPage() {
  const { t, language } = useLanguage();

  const programs = [
    {
      title: t.programs.programsList.oneOnOne.title,
      subtitle: t.programs.programsList.oneOnOne.subtitle,
      duration: t.programs.programsList.oneOnOne.duration,
      sessions: t.programs.programsList.oneOnOne.sessions,
      price: t.programs.byConsultation,
      description: t.programs.programsList.oneOnOne.description,
      includes: t.programs.programsList.oneOnOne.includes,
      color: "var(--violet)",
      featured: false,
      isRetreat: false,
    },
    {
      title: t.programs.programsList.transformationRetreat.title,
      subtitle: t.programs.programsList.transformationRetreat.subtitle,
      duration: t.programs.programsList.transformationRetreat.duration,
      sessions: t.programs.programsList.transformationRetreat.sessions,
      price: t.programs.byConsultation,
      description: t.programs.programsList.transformationRetreat.description,
      includes: t.programs.programsList.transformationRetreat.includes,
      color: "var(--indigo)",
      featured: true,
      isRetreat: true,
    },
    {
      title: t.programs.programsList.vipRetreat.title,
      subtitle: t.programs.programsList.vipRetreat.subtitle,
      duration: t.programs.programsList.vipRetreat.duration,
      sessions: t.programs.programsList.vipRetreat.sessions,
      price: t.programs.byConsultation,
      description: t.programs.programsList.vipRetreat.description,
      includes: t.programs.programsList.vipRetreat.includes,
      color: "var(--purple)",
      featured: false,
      isRetreat: true,
    },
  ];

  const retreatFeatures = [
    {
      icon: Hotel,
      title: t.programs.retreatExperience.features.accommodation.title,
      description: t.programs.retreatExperience.features.accommodation.description,
    },
    {
      icon: Utensils,
      title: t.programs.retreatExperience.features.meals.title,
      description: t.programs.retreatExperience.features.meals.description,
    },
    {
      icon: Users,
      title: t.programs.retreatExperience.features.smallGroups.title,
      description: t.programs.retreatExperience.features.smallGroups.description,
    },
    {
      icon: Sparkles,
      title: t.programs.retreatExperience.features.wellness.title,
      description: t.programs.retreatExperience.features.wellness.description,
    },
  ];

  const upcomingRetreats = language === 'tr' ? [
    {
      title: "Dönüşüm Retreati",
      date: "15-17 Mart 2025",
      location: "İstanbul",
      spots: 8,
    },
    {
      title: "VIP Retreat",
      date: "5-8 Nisan 2025",
      location: "Antalya",
      spots: 6,
    },
    {
      title: "Dönüşüm Retreati",
      date: "10-12 Mayıs 2025",
      location: "Bodrum",
      spots: 10,
    },
  ] : [
    {
      title: "Transformation Retreat",
      date: "March 15-17, 2025",
      location: "Istanbul",
      spots: 8,
    },
    {
      title: "VIP Retreat",
      date: "April 5-8, 2025",
      location: "Antalya",
      spots: 6,
    },
    {
      title: "Transformation Retreat",
      date: "May 10-12, 2025",
      location: "Bodrum",
      spots: 10,
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-28">
        {/* Hero Section */}
        <section className="py-32 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/programlar-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-white/80 font-semibold tracking-wider uppercase text-sm">
                {t.programs.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                {t.programs.title} {t.programs.titleHighlight}
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                {t.programs.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative rounded-3xl p-8 ${
                    program.featured
                      ? "bg-[var(--dark)] text-white scale-105 shadow-2xl"
                      : "bg-[var(--soft)]"
                  }`}
                >
                  {program.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--amber)] text-[var(--dark)] text-sm font-bold rounded-full">
                      {t.programs.mostPopular}
                    </div>
                  )}

                  {program.isRetreat && (
                    <div className="flex items-center gap-2 mb-4">
                      <Hotel size={18} className={program.featured ? "text-[var(--violet)]" : "text-[var(--indigo)]"} />
                      <span className={`text-sm font-medium ${program.featured ? "text-[var(--lavender)]" : "text-[var(--indigo)]"}`}>
                        {t.programs.hotelIncluded}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <span
                      className={`text-sm font-medium ${
                        program.featured ? "text-[var(--lavender)]" : "text-[var(--indigo)]"
                      }`}
                    >
                      {program.subtitle}
                    </span>
                    <h3
                      className={`text-2xl font-bold mt-1 ${
                        program.featured ? "text-white" : "text-[var(--dark)]"
                      }`}
                    >
                      {program.title}
                    </h3>
                  </div>

                  <div className="mb-6">
                    <span
                      className={`text-4xl font-bold ${
                        program.featured ? "text-white" : "text-[var(--dark)]"
                      }`}
                    >
                      {program.price}
                    </span>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock
                        size={16}
                        className={program.featured ? "text-[var(--violet)]" : "text-[var(--indigo)]"}
                      />
                      <span
                        className={`text-sm ${
                          program.featured ? "text-[var(--lavender)]" : "text-[var(--text-muted)]"
                        }`}
                      >
                        {program.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users
                        size={16}
                        className={program.featured ? "text-[var(--violet)]" : "text-[var(--indigo)]"}
                      />
                      <span
                        className={`text-sm ${
                          program.featured ? "text-[var(--lavender)]" : "text-[var(--text-muted)]"
                        }`}
                      >
                        {program.sessions}
                      </span>
                    </div>
                  </div>

                  <p
                    className={`mb-6 ${
                      program.featured ? "text-[var(--lavender)]" : "text-[var(--text-body)]"
                    }`}
                  >
                    {program.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {program.includes.map((item: string, iIndex: number) => (
                      <li key={iIndex} className="flex items-start gap-3">
                        <CheckCircle
                          size={18}
                          className="flex-shrink-0 mt-0.5 text-[var(--emerald)]"
                        />
                        <span
                          className={`text-sm ${
                            program.featured ? "text-white/90" : "text-[var(--text-body)]"
                          }`}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/iletisim"
                    className={`flex items-center justify-center gap-2 w-full py-4 rounded-full font-semibold transition-all ${
                      program.featured
                        ? "bg-white text-[var(--dark)] hover:bg-[var(--lavender)]"
                        : "bg-[var(--indigo)] text-white hover:bg-[var(--purple)]"
                    }`}
                  >
                    {t.programs.startProgram}
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Retreat Features */}
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
                {t.programs.retreatExperience.title}
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                {t.programs.retreatExperience.description}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {retreatFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--lavender)] flex items-center justify-center">
                    <feature.icon size={28} className="text-[var(--indigo)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--dark)] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Retreats */}
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
                {t.programs.upcomingTitle}
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                {t.programs.upcomingDescription}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {upcomingRetreats.map((retreat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[var(--soft)] p-6 rounded-2xl"
                >
                  <h3 className="font-semibold text-[var(--dark)] text-lg mb-4">
                    {retreat.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-[var(--text-body)]">
                      <Calendar size={16} className="text-[var(--indigo)]" />
                      <span className="text-sm">{retreat.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-body)]">
                      <MapPin size={16} className="text-[var(--indigo)]" />
                      <span className="text-sm">{retreat.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-body)]">
                      <Users size={16} className="text-[var(--indigo)]" />
                      <span className="text-sm">{retreat.spots} {t.programs.spots}</span>
                    </div>
                  </div>
                  <Link
                    href="/iletisim"
                    className="inline-flex items-center gap-2 text-[var(--indigo)] font-medium hover:gap-3 transition-all"
                  >
                    {t.programs.register} <ArrowRight size={16} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 gradient-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">{t.programs.faqTitle}</h2>
            </motion.div>

            <div className="space-y-6">
              {t.programs.faq.map((item: { q: string; a: string }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/10 p-6 rounded-2xl"
                >
                  <h3 className="font-semibold mb-2">{item.q}</h3>
                  <p className="text-[var(--lavender)] text-sm">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[var(--dark)] mb-6">
                {t.programs.ctaTitle}
              </h2>
              <p className="text-[var(--text-body)] mb-8">
                {t.programs.ctaDescription}
              </p>
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all hover:shadow-lg"
              >
                {t.programs.ctaButton}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
