"use client";

import { motion } from "framer-motion";
import { Play, ExternalLink, Calendar, Newspaper, Video, Award, BookOpen } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function MediaPage() {
  const { t, language } = useLanguage();

  const mediaAppearances = [
    {
      type: "magazine",
      title: t.media.mediaItems.magazine.title,
      subtitle: t.media.mediaItems.magazine.subtitle,
      date: t.media.mediaItems.magazine.date,
      description: t.media.mediaItems.magazine.description,
      image: "/magazine-cover.jpg",
      link: null,
    },
    {
      type: "video",
      title: t.media.mediaItems.award.title,
      subtitle: t.media.mediaItems.award.subtitle,
      date: t.media.mediaItems.award.date,
      description: t.media.mediaItems.award.description,
      image: "/odul-toreni.jpg",
      link: "https://www.instagram.com/reel/DJq0jUptijh/",
    },
  ];

  const instagramPosts = language === 'tr' ? [
    {
      image: "/instagram/post1.jpg",
      title: "Hayatındaki İlişkiler",
      description: "Birbirine karışıyorsa, sınırlarını çizme zamanı...",
    },
    {
      image: "/instagram/post2.jpg",
      title: "Farkındalık",
      description: "İç sesin dinle, cevaplar sende...",
    },
    {
      image: "/instagram/post3.jpg",
      title: "Dönüşüm",
      description: "Değişim cesaret ister, sen hazırsın...",
    },
    {
      image: "/instagram/post4.jpg",
      title: "Öz Sevgi",
      description: "Kendine sevgiyle bakmayı öğren...",
    },
    {
      image: "/instagram/post5.jpg",
      title: "Hedefler",
      description: "Hayallerini gerçeğe dönüştür...",
    },
    {
      image: "/instagram/post6.jpg",
      title: "Bilinçli Yaşam",
      description: "Her an farkında ol, şimdi ile bağlan...",
    },
  ] : [
    {
      image: "/instagram/post1.jpg",
      title: "Relationships in Life",
      description: "If they're getting mixed up, it's time to set boundaries...",
    },
    {
      image: "/instagram/post2.jpg",
      title: "Awareness",
      description: "Listen to your inner voice, answers are within you...",
    },
    {
      image: "/instagram/post3.jpg",
      title: "Transformation",
      description: "Change requires courage, you are ready...",
    },
    {
      image: "/instagram/post4.jpg",
      title: "Self Love",
      description: "Learn to look at yourself with love...",
    },
    {
      image: "/instagram/post5.jpg",
      title: "Goals",
      description: "Turn your dreams into reality...",
    },
    {
      image: "/instagram/post6.jpg",
      title: "Conscious Living",
      description: "Be aware of every moment, connect with now...",
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-28">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/medya-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-white/80 font-semibold tracking-wider uppercase text-sm">
                {t.media.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                {t.media.title} <span className="text-[var(--amber)]">{t.media.titleHighlight}</span>
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                {t.media.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Media */}
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
                {t.media.featuredTitle}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {mediaAppearances.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[var(--soft)] rounded-2xl overflow-hidden"
                >
                  {item.image && (
                    <a
                      href={item.link || "#"}
                      target={item.link ? "_blank" : undefined}
                      rel={item.link ? "noopener noreferrer" : undefined}
                      className="aspect-video relative overflow-hidden block group"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play size={28} className="text-[var(--indigo)] ml-1" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        {item.type === "magazine" ? (
                          <Newspaper size={20} className="text-white" />
                        ) : (
                          <Video size={20} className="text-white" />
                        )}
                        <span className="text-white text-sm font-medium">{item.subtitle}</span>
                      </div>
                    </a>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2">
                      <Calendar size={14} />
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--dark)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[var(--text-body)] mb-4">
                      {item.description}
                    </p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[var(--indigo)] font-medium"
                      >
                        {language === 'tr' ? 'İzle' : 'Watch'} <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Press Quotes */}
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
                {t.media.quotesTitle}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {t.media.quotes.map((item: { quote: string; source: string }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl"
                >
                  <BookOpen size={24} className="text-[var(--indigo)] mb-4" />
                  <p className="text-[var(--text-body)] italic mb-4">
                    "{item.quote}"
                  </p>
                  <p className="text-sm text-[var(--text-muted)] font-medium">
                    — {item.source}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards */}
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
                {t.media.awardsTitle}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {t.media.awards.map((award: { title: string; organization: string; year: string }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[var(--soft)] p-6 rounded-2xl text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--amber)]/20 flex items-center justify-center">
                    <Award size={28} className="text-[var(--amber)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--dark)] mb-1">{award.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{award.organization}</p>
                  <p className="text-sm text-[var(--indigo)] font-medium mt-2">{award.year}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram Posts */}
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
                {t.media.instagramTitle}
              </h2>
              <p className="text-[var(--text-body)]">
                {t.media.instagramDescription}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {instagramPosts.map((post, index) => (
                <motion.a
                  key={index}
                  href="https://www.instagram.com/kumrukoseler/"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative aspect-square rounded-xl overflow-hidden"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <p className="font-semibold mb-1">{post.title}</p>
                      <p className="text-sm text-white/80">{post.description}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="py-20 gradient-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                {t.contact.social.title}
              </h2>
              <p className="text-[var(--lavender)] mb-8">
                {t.contact.social.followMe}
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://www.instagram.com/kumrukoseler/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://www.youtube.com/@kumrukoseler9055"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  YouTube
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Press Contact */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[var(--dark)] mb-6">
                {t.media.ctaTitle}
              </h2>
              <p className="text-[var(--text-body)] mb-8">
                {t.media.ctaDescription}
              </p>
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all"
              >
                {t.media.ctaButton}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
