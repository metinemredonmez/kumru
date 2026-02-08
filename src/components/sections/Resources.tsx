"use client";

import { motion } from "framer-motion";
import { BookOpen, Headphones, Video, FileText, ArrowRight, Lock } from "lucide-react";

const resources = [
  {
    icon: FileText,
    title: "Ücretsiz E-Kitap",
    description: "\"Hayatınızı Dönüştürmenin 7 Adımı\" - Kişisel gelişim rehberi",
    type: "PDF",
    status: "free",
    cta: "İndir",
  },
  {
    icon: Video,
    title: "Video Eğitimler",
    description: "Stres yönetimi, hedef belirleme ve motivasyon videoları",
    type: "Video Serisi",
    status: "youtube",
    cta: "YouTube'da İzle",
    link: "https://www.youtube.com/@kumrukoseler9055/videos",
  },
  {
    icon: Headphones,
    title: "Meditasyon Seansları",
    description: "Günlük rahatlama ve farkındalık meditasyonları",
    type: "Sesli İçerik",
    status: "coming",
    cta: "Yakında",
  },
  {
    icon: BookOpen,
    title: "Blog Yazıları",
    description: "Kişisel gelişim, kariyer ve yaşam dengesi üzerine makaleler",
    type: "Makale",
    status: "coming",
    cta: "Yakında",
  },
];

export default function Resources() {
  return (
    <section id="resources" className="py-24 bg-white">
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
            Kaynaklar
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mt-4 mb-6">
            Ücretsiz <span className="text-gradient">İçerikler</span>
          </h2>
          <p className="text-[var(--text-body)] max-w-2xl mx-auto">
            Dönüşüm yolculuğunuza başlamanız için hazırladığım ücretsiz kaynaklar.
            Yeni içerikler yakında eklenecek!
          </p>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-[var(--soft)] rounded-3xl p-6 ${
                resource.status === "coming" ? "opacity-75" : ""
              }`}
            >
              {resource.status === "coming" && (
                <div className="absolute top-4 right-4">
                  <Lock size={16} className="text-[var(--text-muted)]" />
                </div>
              )}

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm">
                <resource.icon size={28} className="text-[var(--indigo)]" />
              </div>

              {/* Type Badge */}
              <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-medium text-[var(--indigo)] mb-3">
                {resource.type}
              </span>

              {/* Content */}
              <h3 className="text-lg font-bold text-[var(--dark)] mb-2">
                {resource.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                {resource.description}
              </p>

              {/* CTA */}
              {resource.status === "free" ? (
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-[var(--indigo)] font-semibold hover:gap-3 transition-all"
                >
                  {resource.cta}
                  <ArrowRight size={16} />
                </a>
              ) : resource.status === "youtube" ? (
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--indigo)] font-semibold hover:gap-3 transition-all"
                >
                  {resource.cta}
                  <ArrowRight size={16} />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 text-[var(--text-muted)] font-medium">
                  {resource.cta}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-[var(--dark)] rounded-3xl p-8 md:p-12 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Yeni İçeriklerden Haberdar Olun
          </h3>
          <p className="text-[var(--lavender)] mb-8 max-w-xl mx-auto">
            E-posta listemize katılın, yeni kaynaklar, blog yazıları ve özel
            tekliflerden ilk siz haberdar olun.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[var(--violet)]"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-[var(--amber)] text-[var(--dark)] rounded-full font-semibold hover:bg-[var(--amber-hover)] transition-colors"
            >
              Abone Ol
            </button>
          </form>
          <p className="text-xs text-[var(--lavender)]/60 mt-4">
            Spam göndermiyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
