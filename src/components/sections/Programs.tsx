"use client";

import { motion } from "framer-motion";
import { Clock, Users, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const programs = [
  {
    title: "Keşif Yolculuğu",
    subtitle: "Başlangıç Programı",
    duration: "4 Hafta",
    sessions: "4 Seans",
    price: "2.500",
    currency: "CAD",
    description:
      "Koçluk sürecini tanıyın ve kendi yolculuğunuzu başlatın. Hedeflerinizi netleştirin.",
    includes: [
      "Haftalık 60 dakika seans",
      "Kişisel değerlendirme raporu",
      "Hedef belirleme çalışması",
      "Mesaj desteği",
    ],
    color: "var(--violet)",
    featured: false,
  },
  {
    title: "Dönüşüm Programı",
    subtitle: "En Çok Tercih Edilen",
    duration: "12 Hafta",
    sessions: "12 Seans",
    price: "6.500",
    currency: "CAD",
    description:
      "Kapsamlı bir dönüşüm için tasarlanmış yoğun program. Gerçek değişim burada başlar.",
    includes: [
      "Haftalık 60 dakika seans",
      "Kişisel eylem planı",
      "7/24 mesaj desteği",
      "Kaynak kütüphanesine erişim",
      "İlerleme takip sistemi",
      "Bonus: 2 acil destek seansı",
    ],
    color: "var(--indigo)",
    featured: true,
  },
  {
    title: "Elite Mentorluk",
    subtitle: "Premium Deneyim",
    duration: "6 Ay",
    sessions: "24 Seans",
    price: "12.000",
    currency: "CAD",
    description:
      "Yoğun, kişiselleştirilmiş ve sürekli destek. Hayatınızda kalıcı dönüşüm yaratın.",
    includes: [
      "2 haftalık seanslar (60 dk)",
      "Sınırsız mesaj desteği",
      "Aylık strateji görüşmesi",
      "VIP kaynak erişimi",
      "Kişisel gelişim kitaplığı",
      "Özel etkinliklere davet",
    ],
    color: "var(--purple)",
    featured: false,
  },
];

export default function Programs() {
  return (
    <section id="programs" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[var(--indigo)] font-semibold tracking-wider uppercase text-sm">
            Programlar
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mt-4 mb-6">
            Size Uygun <span className="text-gradient">Programı Seçin</span>
          </h2>
          <p className="text-[var(--text-body)] max-w-2xl mx-auto">
            Her bütçeye ve ihtiyaca uygun programlar. İlk adımı atmak için doğru
            zamanı beklemeyin.
          </p>
        </motion.div>

        {/* Programs Grid */}
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

              {/* Header */}
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

              {/* Price */}
              <div className="mb-6">
                <span
                  className={`text-4xl font-bold ${
                    program.featured ? "text-white" : "text-[var(--dark)]"
                  }`}
                >
                  {program.price}
                </span>
                <span
                  className={`text-lg ml-1 ${
                    program.featured ? "text-[var(--lavender)]" : "text-[var(--text-muted)]"
                  }`}
                >
                  {program.currency}
                </span>
              </div>

              {/* Meta */}
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

              {/* Description */}
              <p
                className={`mb-6 ${
                  program.featured ? "text-[var(--lavender)]" : "text-[var(--text-body)]"
                }`}
              >
                {program.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {program.includes.map((item, iIndex) => (
                  <li key={iIndex} className="flex items-start gap-3">
                    <CheckCircle
                      size={18}
                      className={`flex-shrink-0 mt-0.5 ${
                        program.featured ? "text-[var(--emerald)]" : "text-[var(--emerald)]"
                      }`}
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

              {/* CTA */}
              <Link
                href="#contact"
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

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-[var(--text-muted)] mt-12"
        >
          Tüm programlar ücretsiz keşif görüşmesi ile başlar. Taksit imkanı mevcuttur.
        </motion.p>
      </div>
    </section>
  );
}
