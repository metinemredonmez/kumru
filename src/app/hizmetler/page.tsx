"use client";

import { motion } from "framer-motion";
import {
  Users, Video, MessageCircle, Calendar, Target, Brain,
  Heart, Briefcase, ArrowRight, CheckCircle, Clock
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ServicesPage() {
  const { t, language } = useLanguage();

  const services = [
    {
      icon: Users,
      title: t.services.servicesList.oneOnOne.title,
      shortDesc: t.services.servicesList.oneOnOne.shortDesc,
      fullDesc: t.services.servicesList.oneOnOne.fullDesc,
      features: t.services.servicesList.oneOnOne.features,
      duration: t.services.servicesList.oneOnOne.duration,
      color: "var(--indigo)",
    },
    {
      icon: Video,
      title: t.services.servicesList.online.title,
      shortDesc: t.services.servicesList.online.shortDesc,
      fullDesc: t.services.servicesList.online.fullDesc,
      features: t.services.servicesList.online.features,
      duration: t.services.servicesList.online.duration,
      color: "var(--purple)",
    },
    {
      icon: MessageCircle,
      title: t.services.servicesList.messaging.title,
      shortDesc: t.services.servicesList.messaging.shortDesc,
      fullDesc: t.services.servicesList.messaging.fullDesc,
      features: t.services.servicesList.messaging.features,
      duration: t.services.servicesList.messaging.duration,
      color: "var(--violet)",
    },
    {
      icon: Calendar,
      title: t.services.servicesList.corporate.title,
      shortDesc: t.services.servicesList.corporate.shortDesc,
      fullDesc: t.services.servicesList.corporate.fullDesc,
      features: t.services.servicesList.corporate.features,
      duration: t.services.servicesList.corporate.duration,
      color: "var(--indigo)",
    },
    {
      icon: Target,
      title: t.services.servicesList.goalTracking.title,
      shortDesc: t.services.servicesList.goalTracking.shortDesc,
      fullDesc: t.services.servicesList.goalTracking.fullDesc,
      features: t.services.servicesList.goalTracking.features,
      duration: t.services.servicesList.goalTracking.duration,
      color: "var(--purple)",
    },
    {
      icon: Users,
      title: t.services.servicesList.group.title,
      shortDesc: t.services.servicesList.group.shortDesc,
      fullDesc: t.services.servicesList.group.fullDesc,
      features: t.services.servicesList.group.features,
      duration: t.services.servicesList.group.duration,
      color: "var(--violet)",
    },
  ];

  const specializations = [
    {
      icon: Brain,
      title: t.services.specializations.personal.title,
      description: t.services.specializations.personal.description,
    },
    {
      icon: Heart,
      title: t.services.specializations.relationship.title,
      description: t.services.specializations.relationship.description,
    },
    {
      icon: Briefcase,
      title: t.services.specializations.career.title,
      description: t.services.specializations.career.description,
    },
    {
      icon: Target,
      title: t.services.specializations.goal.title,
      description: t.services.specializations.goal.description,
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-28">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-bottom"
            style={{ backgroundImage: "url('/hizmetler-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-white/80 font-semibold tracking-wider uppercase text-sm">
                {t.services.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                {t.services.title} {t.services.titleHighlight}
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                {t.services.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Specializations */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {specializations.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--lavender)] flex items-center justify-center">
                    <spec.icon size={28} className="text-[var(--indigo)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--dark)] mb-2">{spec.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{spec.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
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
                {t.services.optionsTitle}
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                {t.services.optionsDescription}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${service.color}15` }}
                  >
                    <service.icon size={28} style={{ color: service.color }} />
                  </div>

                  <h3 className="text-xl font-semibold text-[var(--dark)] mb-2">
                    {service.title}
                  </h3>

                  <p className="text-[var(--text-body)] mb-4">
                    {service.fullDesc}
                  </p>

                  <div className="flex items-center gap-2 mb-4 text-sm text-[var(--text-muted)]">
                    <Clock size={16} />
                    <span>{service.duration}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature: string, fIndex: number) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm text-[var(--text-body)]">
                        <CheckCircle size={16} className="text-[var(--emerald)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/iletisim"
                    className="inline-flex items-center gap-2 text-[var(--indigo)] font-medium hover:gap-3 transition-all"
                  >
                    {t.services.moreInfo} <ArrowRight size={16} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
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
                {t.services.processTitle}
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                {t.services.processDescription}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {t.services.process.map((item: { step: string; title: string; desc: string }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold text-[var(--lavender)] mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-[var(--dark)] mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                {t.services.ctaTitle}
              </h2>
              <p className="text-[var(--lavender)] mb-8 max-w-2xl mx-auto">
                {t.services.ctaDescription}
              </p>
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--dark)] rounded-full font-semibold hover:bg-[var(--lavender)] transition-all"
              >
                {t.services.ctaButton}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
