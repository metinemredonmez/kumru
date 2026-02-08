"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-soft" />

      {/* Decorative Elements */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-[var(--indigo)]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--purple)]/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--soft)] rounded-full mb-6">
              <Star size={16} className="text-[var(--amber)] fill-[var(--amber)]" />
              <span className="text-sm font-medium text-[var(--dark)]">
                Profesyonel Yaşam Koçu
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--dark)] leading-tight mb-6">
              Hayatınızı{" "}
              <span className="text-gradient">Dönüştürün,</span>
              <br />
              Potansiyelinizi Keşfedin
            </h1>

            {/* Description */}
            <p className="text-lg text-[var(--text-body)] leading-relaxed mb-8 max-w-lg">
              Birebir koçluk seansları, kişiye özel programlar ve kanıtlanmış
              yöntemlerle hayalinizdeki yaşama ulaşmanıza yardımcı oluyorum.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all hover:shadow-lg hover:shadow-[var(--indigo)]/30"
              >
                Ücretsiz Keşif Görüşmesi
                <ArrowRight size={20} />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--dark)] rounded-full font-semibold border-2 border-[var(--lavender)] hover:border-[var(--indigo)] transition-colors">
                <Play size={20} className="text-[var(--indigo)]" />
                Tanıtım Videosu
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold text-[var(--indigo)]">500+</div>
                <div className="text-sm text-[var(--text-muted)]">Mutlu Danışan</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--indigo)]">10+</div>
                <div className="text-sm text-[var(--text-muted)]">Yıl Deneyim</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--indigo)]">98%</div>
                <div className="text-sm text-[var(--text-muted)]">Memnuniyet</div>
              </div>
            </div>
          </motion.div>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/5] max-w-lg mx-auto">
              {/* Video Container */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--indigo)]/30 to-transparent" />
              </div>

              {/* Floating Card - Google Reviews */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--amber)]/10 flex items-center justify-center">
                    <Star className="text-[var(--amber)] fill-[var(--amber)]" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--dark)]">5.0 Puan</div>
                    <div className="text-sm text-[var(--text-muted)]">Google'da 10 Yorum</div>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
