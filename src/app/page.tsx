"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import { motion } from "framer-motion";
import { ArrowRight, Users, Video, Calendar, Target, CheckCircle, Star } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Users,
    title: "Birebir Koçluk",
    description: "Kişiye özel, yoğun ve dönüştürücü koçluk seansları.",
  },
  {
    icon: Video,
    title: "Online Seanslar",
    description: "Dünyanın her yerinden video görüşme ile koçluk.",
  },
  {
    icon: Calendar,
    title: "Retreat Programları",
    description: "Otel konaklamalı grup dönüşüm programları.",
  },
  {
    icon: Target,
    title: "Kurumsal Koçluk",
    description: "Şirketler için özel liderlik programları.",
  },
];

const stats = [
  { value: "500+", label: "Mutlu Danışan" },
  { value: "10+", label: "Yıl Deneyim" },
  { value: "98%", label: "Memnuniyet" },
  { value: "50+", label: "Retreat" },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* About Preview */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/profile.jpg"
                    alt="Kumru Köseler"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[var(--indigo)] text-white p-6 rounded-2xl shadow-xl">
                  <div className="text-4xl font-bold">10+</div>
                  <div className="text-sm opacity-80">Yıl Deneyim</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[var(--indigo)] font-semibold tracking-wider uppercase text-sm">
                  Hakkımda
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mt-4 mb-6">
                  Merhaba, Ben{" "}
                  <span className="text-gradient">Kumru Köseler</span>
                </h2>
                <p className="text-[var(--text-body)] leading-relaxed mb-6">
                  10 yılı aşkın deneyimimle, bireylerin ve profesyonellerin hayatlarında
                  anlamlı dönüşümler yaratmalarına yardımcı oluyorum. Bilimsel yöntemler
                  ve empatik bir yaklaşımla, her danışanımın benzersiz yolculuğuna
                  eşlik ediyorum.
                </p>
                <p className="text-[var(--text-body)] leading-relaxed mb-8">
                  İnsanların hayatlarının pozitif yönde değişimine vesile olabilen
                  spiritüel bir rehber ve davranış bilimleri uzmanıyım.
                </p>
                <Link
                  href="/hakkimda"
                  className="inline-flex items-center gap-2 text-[var(--indigo)] font-semibold hover:gap-3 transition-all"
                >
                  Daha Fazla Bilgi <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-24 bg-[var(--soft)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-[var(--indigo)] font-semibold tracking-wider uppercase text-sm">
                Hizmetler
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mt-4 mb-6">
                Size Nasıl <span className="text-gradient">Yardımcı Olabilirim?</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-[var(--lavender)] flex items-center justify-center mb-4">
                    <service.icon size={28} className="text-[var(--indigo)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-[var(--text-body)] text-sm">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Link
                href="/hizmetler"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all"
              >
                Tüm Hizmetleri Gör <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 gradient-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-[var(--amber)] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[var(--lavender)]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Programs Preview */}
        <section className="py-24 bg-[var(--soft)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Dönüşüm <span className="text-gradient">Programları</span>
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                Birebir koçluktan otel konaklamalı retreat programlarına kadar
                size uygun seçenekler
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Birebir Koçluk",
                  duration: "4-12 Hafta",
                  features: ["60 dk seanslar", "WhatsApp destek", "Kişiye özel program"],
                },
                {
                  title: "Dönüşüm Retreati",
                  duration: "3 Gün 2 Gece",
                  features: ["5 yıldızlı otel", "Grup seansları", "Meditasyon"],
                  featured: true,
                },
                {
                  title: "VIP Retreat",
                  duration: "4 Gün 3 Gece",
                  features: ["Lüks konaklama", "Birebir seans", "Spa & wellness"],
                },
              ].map((program, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`rounded-2xl p-8 ${
                    program.featured
                      ? "bg-[var(--dark)] text-white"
                      : "bg-white"
                  }`}
                >
                  {program.featured && (
                    <span className="inline-block px-3 py-1 bg-[var(--amber)] text-[var(--dark)] text-xs font-bold rounded-full mb-4">
                      En Popüler
                    </span>
                  )}
                  <h3 className={`text-xl font-bold mb-2 ${program.featured ? "text-white" : "text-[var(--dark)]"}`}>
                    {program.title}
                  </h3>
                  <p className={`text-sm mb-4 ${program.featured ? "text-[var(--lavender)]" : "text-[var(--text-muted)]"}`}>
                    {program.duration}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {program.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle size={16} className="text-[var(--emerald)]" />
                        <span className={program.featured ? "text-white/90" : "text-[var(--text-body)]"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Link
                href="/programlar"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all"
              >
                Tüm Programları Gör <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} className="text-[var(--amber)] fill-[var(--amber)]" />
                ))}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-6">
                Dönüşüm Yolculuğunuza Başlayın
              </h2>
              <p className="text-lg text-[var(--text-body)] mb-8 max-w-2xl mx-auto">
                Hayatınızda pozitif bir değişim yaratmak için ilk adımı atın.
                Ücretsiz 30 dakikalık keşif görüşmesi ile tanışalım.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/iletisim"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all hover:shadow-lg"
                >
                  Ücretsiz Görüşme Ayarla <ArrowRight size={18} />
                </Link>
                <a
                  href="https://wa.me/905343675669"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-full font-semibold hover:bg-[#128C7E] transition-all"
                >
                  WhatsApp'tan Yaz
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
