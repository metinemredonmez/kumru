"use client";

import { motion } from "framer-motion";
import {
  Clock, Users, CheckCircle, ArrowRight, Hotel, Sparkles,
  Calendar, MapPin, Utensils, Wifi, Star
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const programs = [
  {
    title: "Birebir Koçluk",
    subtitle: "Online Seans",
    duration: "4-12 Hafta",
    sessions: "Birebir",
    price: "Görüşme ile",
    description:
      "Online veya yüz yüze birebir koçluk seansları. Kişisel hedeflerinize odaklı özel program.",
    includes: [
      "60 dakikalık birebir seanslar",
      "Kişisel değerlendirme raporu",
      "Hedef belirleme çalışması",
      "WhatsApp destek hattı",
      "Kişiye özel egzersizler",
    ],
    color: "var(--violet)",
    featured: false,
    isRetreat: false,
  },
  {
    title: "Dönüşüm Retreati",
    subtitle: "3 Gün - Otel Konaklama",
    duration: "3 Gün 2 Gece",
    sessions: "Grup Seans",
    price: "Görüşme ile",
    description:
      "Lüks otelde konaklama dahil yoğun dönüşüm programı. Grup dinamiği ile güçlü değişim.",
    includes: [
      "5 yıldızlı otelde 2 gece konaklama",
      "Günlük grup seansları",
      "Meditasyon ve nefes çalışmaları",
      "Birebir mini seanslar",
      "Kahvaltı ve öğle yemeği dahil",
      "Özel hediye paketi",
    ],
    color: "var(--indigo)",
    featured: true,
    isRetreat: true,
  },
  {
    title: "VIP Retreat",
    subtitle: "4 Gün - Premium Deneyim",
    duration: "4 Gün 3 Gece",
    sessions: "VIP Grup",
    price: "Görüşme ile",
    description:
      "Sınırlı katılımlı, yoğun ve dönüştürücü premium retreat deneyimi.",
    includes: [
      "Lüks otelde 3 gece konaklama",
      "Tüm öğünler dahil",
      "Günde 2 grup seansı",
      "Özel birebir koçluk seansı",
      "Spa & wellness aktiviteleri",
      "1 ay sonrası takip seansı",
      "VIP hediye seti",
    ],
    color: "var(--purple)",
    featured: false,
    isRetreat: true,
  },
];

const retreatFeatures = [
  {
    icon: Hotel,
    title: "Lüks Konaklama",
    description: "5 yıldızlı otellerde konforlu odalar",
  },
  {
    icon: Utensils,
    title: "Öğünler Dahil",
    description: "Sağlıklı ve lezzetli yemekler",
  },
  {
    icon: Users,
    title: "Küçük Gruplar",
    description: "Maksimum 12 kişilik gruplar",
  },
  {
    icon: Sparkles,
    title: "Wellness",
    description: "Spa ve rahatlama aktiviteleri",
  },
];

const upcomingRetreats = [
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
];

export default function ProgramsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 gradient-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[var(--indigo)] font-semibold tracking-wider uppercase text-sm">
                Programlar
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mt-4 mb-6">
                Dönüşüm <span className="text-gradient">Programları</span>
              </h1>
              <p className="text-lg text-[var(--text-body)] max-w-2xl mx-auto">
                Birebir koçluktan otel konaklamalı retreat programlarına kadar
                size uygun seçenekler
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
                      En Popüler
                    </div>
                  )}

                  {program.isRetreat && (
                    <div className="flex items-center gap-2 mb-4">
                      <Hotel size={18} className={program.featured ? "text-[var(--violet)]" : "text-[var(--indigo)]"} />
                      <span className={`text-sm font-medium ${program.featured ? "text-[var(--lavender)]" : "text-[var(--indigo)]"}`}>
                        Otel Konaklamalı
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
                    {program.includes.map((item, iIndex) => (
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
                    Programa Başla
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
                Retreat Deneyimi
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                Otel konaklamalı programlarımızda sizi neler bekliyor?
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
                Yaklaşan Retreatler
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                Takvimimizdeki yaklaşan programlar
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
                      <span className="text-sm">{retreat.spots} kişilik yer</span>
                    </div>
                  </div>
                  <Link
                    href="/iletisim"
                    className="inline-flex items-center gap-2 text-[var(--indigo)] font-medium hover:gap-3 transition-all"
                  >
                    Kayıt Ol <ArrowRight size={16} />
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
              <h2 className="text-3xl font-bold mb-4">Sık Sorulan Sorular</h2>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  q: "Retreat programlarına kimler katılabilir?",
                  a: "Retreat programlarımız 18 yaş üstü herkese açıktır. Kişisel gelişim yolculuğunuzda yeni bir adım atmak isteyen herkes katılabilir.",
                },
                {
                  q: "Konaklama ve yemekler dahil mi?",
                  a: "Evet, tüm retreat programlarımızda otel konaklaması ve belirtilen öğünler fiyata dahildir.",
                },
                {
                  q: "Grup büyüklüğü ne kadar?",
                  a: "Kaliteli bir deneyim için gruplarımız maksimum 12 kişi ile sınırlıdır. VIP retreatlerde bu sayı 6-8 kişidir.",
                },
                {
                  q: "İptal ve iade koşulları nedir?",
                  a: "Program başlangıcından 14 gün öncesine kadar tam iade yapılmaktadır. Detaylı bilgi için iletişime geçebilirsiniz.",
                },
              ].map((item, index) => (
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
                Dönüşüm Yolculuğunuza Başlayın
              </h2>
              <p className="text-[var(--text-body)] mb-8">
                Tüm programlar ücretsiz keşif görüşmesi ile başlar. Taksit imkanı mevcuttur.
              </p>
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all hover:shadow-lg"
              >
                Ücretsiz Görüşme Ayarla
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
