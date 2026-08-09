"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Video, MessageCircle, Instagram } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

export default function EventsPage() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="pt-28">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
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
                {t.events.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                {t.events.title} {t.events.titleHighlight}
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                {t.events.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Past Events */}
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
                {t.events.pastTitle}
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                {t.events.pastDescription}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.events.eventsList.map(
                (event: { title: string; date: string; time: string; description: string }, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-[var(--soft)] rounded-2xl p-6 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--lavender)] text-[var(--indigo)] text-xs font-semibold">
                        <Video size={14} />
                        {t.events.onlineSeminar}
                      </span>
                      <span className="text-xs font-medium text-[var(--text-muted)] px-3 py-1 rounded-full bg-white">
                        {t.events.pastBadge}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-[var(--dark)] mb-3">
                      {event.title}
                    </h3>

                    <p className="text-sm text-[var(--text-body)] mb-6 flex-grow">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                      <span className="flex items-center gap-2">
                        <Calendar size={16} />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={16} />
                        {event.time}
                      </span>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Upcoming CTA */}
        <section className="py-20 gradient-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                {t.events.upcomingTitle}
              </h2>
              <p className="text-[var(--lavender)] mb-8 max-w-2xl mx-auto">
                {t.events.upcomingDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/905343675669"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--dark)] rounded-full font-semibold hover:bg-[var(--lavender)] transition-all"
                >
                  <MessageCircle size={20} />
                  {t.events.ctaButton}
                </a>
                <a
                  href="https://www.instagram.com/kumrukoseler/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 text-white rounded-full font-semibold hover:bg-white/10 transition-all"
                >
                  <Instagram size={20} />
                  {t.events.followInstagram}
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
