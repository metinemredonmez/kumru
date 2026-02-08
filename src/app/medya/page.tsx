"use client";

import { motion } from "framer-motion";
import { Play, ExternalLink, Calendar, Newspaper, Video, Award, BookOpen } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const mediaAppearances = [
  {
    type: "magazine",
    title: "Quality of Magazine",
    subtitle: "Röportaj",
    date: "Kasım 2023",
    description: "\"Bizi biz yapan her şey ailede başlar\" başlıklı kapak röportajı. Davranış bilimleri ve aile dinamikleri üzerine derinlemesine söyleşi.",
    image: "/kumrukoseler1.jpg",
    link: null,
  },
  {
    type: "video",
    title: "Ödül Töreni",
    subtitle: "Instagram Reel",
    date: "2024",
    description: "Yılın Spiritüel Yaşam Koçu ve Davranış Bilimleri Uzmanı ödülü töreni.",
    image: "/odul-toreni.jpg",
    link: "https://www.instagram.com/reel/DJq0jUptijh/",
  },
];

const pressQuotes = [
  {
    quote: "İnsanların hayatlarının pozitif yönde değişimine vesile olabilen spiritüel bir rehber ve davranış bilimleri uzmanıyım.",
    source: "Quality of Magazine",
  },
  {
    quote: "Bugün ne düşünürsen kendine çekebilirsin, niyet enerjisini kullanabilirsin. Hissettiğini yaşarsın.",
    source: "Röportaj",
  },
  {
    quote: "Bu mesleği seçmemdeki en önemli sebeplerden biri, bilincin küçük yaşta şekillenmesi ve bunun tüm hayatımıza olan etkisi.",
    source: "Quality of Magazine",
  },
];

const awards = [
  {
    title: "Yılın Yaşam Koçu",
    organization: "Türkiye Koçluk Derneği",
    year: "2024",
  },
  {
    title: "En İyi Online Koçluk Programı",
    organization: "Digital Coaching Awards",
    year: "2023",
  },
];

const instagramPosts = [
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
];

export default function MediaPage() {
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
                Medya
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mt-4 mb-6">
                Basında <span className="text-gradient">Kumru Köseler</span>
              </h1>
              <p className="text-lg text-[var(--text-body)] max-w-2xl mx-auto">
                Röportajlar, medya çıkışları ve ödüller
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
                Öne Çıkan Medya
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

                  {!item.image && item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-video relative flex items-center justify-center bg-[var(--indigo)]"
                    >
                      <div className="text-center text-white">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                          <Play size={32} className="text-white ml-1" />
                        </div>
                        <p className="font-medium">Videoyu İzle</p>
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
                        İzle <ExternalLink size={16} />
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
                Basından Alıntılar
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {pressQuotes.map((item, index) => (
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
                Ödüller
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {awards.map((award, index) => (
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
                Instagram Paylaşımları
              </h2>
              <p className="text-[var(--text-body)]">
                @kumrukoseler'dan güncel içerikler
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
                Sosyal Medyada Takip Edin
              </h2>
              <p className="text-[var(--lavender)] mb-8">
                Günlük motivasyon, ipuçları ve daha fazlası için beni sosyal medyada takip edin.
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
                Basın İletişim
              </h2>
              <p className="text-[var(--text-body)] mb-8">
                Röportaj, işbirliği veya basın talepleri için iletişime geçebilirsiniz.
              </p>
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all"
              >
                İletişime Geç
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
