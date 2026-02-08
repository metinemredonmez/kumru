"use client";

import { motion } from "framer-motion";
import { CheckCircle, Award, Heart, Sparkles } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Sertifikalı Koç",
    description: "Uluslararası akredite kurumlardan alınmış profesyonel sertifikalar.",
  },
  {
    icon: Heart,
    title: "Empatik Yaklaşım",
    description: "Her danışanı benzersiz bir birey olarak görüp, kişiye özel çözümler.",
  },
  {
    icon: Sparkles,
    title: "Kanıtlanmış Sonuçlar",
    description: "Yüzlerce danışanın hayatında somut değişimler ve başarılar.",
  },
];

const values = [
  "Kişisel gelişim ve farkındalık",
  "Hedef belirleme ve planlama",
  "Stres ve kaygı yönetimi",
  "İlişki ve iletişim becerileri",
  "Kariyer ve iş yaşamı dengesi",
  "Öz güven ve motivasyon",
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image Placeholder */}
              <div className="aspect-[4/5] rounded-3xl bg-[var(--soft)] flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-40 h-40 mx-auto mb-4 rounded-full bg-[var(--lavender)] flex items-center justify-center">
                    <span className="text-5xl font-bold text-[var(--indigo)]">KK</span>
                  </div>
                  <p className="text-[var(--text-muted)]">Kumru Köseler</p>
                </div>
              </div>

              {/* Experience Badge */}
              <div className="absolute -bottom-6 -right-6 bg-[var(--indigo)] text-white p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold">10+</div>
                <div className="text-sm opacity-80">Yıl Deneyim</div>
              </div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Section Label */}
            <span className="text-[var(--indigo)] font-semibold tracking-wider uppercase text-sm">
              Hakkımda
            </span>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mt-4 mb-6">
              Merhaba, Ben{" "}
              <span className="text-gradient">Kumru Köseler</span>
            </h2>

            {/* Description */}
            <p className="text-[var(--text-body)] leading-relaxed mb-6">
              10 yılı aşkın deneyimimle, bireylerin ve profesyonellerin hayatlarında
              anlamlı dönüşümler yaratmalarına yardımcı oluyorum. Bilimsel yöntemler
              ve empatik bir yaklaşımla, her danışanımın benzersiz yolculuğuna
              eşlik ediyorum.
            </p>

            <p className="text-[var(--text-body)] leading-relaxed mb-8">
              Amacım, sizin içinizdeki potansiyeli ortaya çıkarmak ve hayallerinize
              ulaşmanız için gereken araçları size sunmaktır.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--soft)] flex items-center justify-center flex-shrink-0">
                    <feature.icon size={24} className="text-[var(--indigo)]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--dark)] mb-1">{feature.title}</h4>
                    <p className="text-sm text-[var(--text-muted)]">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Values List */}
            <div className="bg-[var(--soft)] rounded-2xl p-6">
              <h4 className="font-semibold text-[var(--dark)] mb-4">Uzmanlık Alanlarım</h4>
              <div className="grid grid-cols-2 gap-3">
                {values.map((value, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[var(--emerald)]" />
                    <span className="text-sm text-[var(--text-body)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
