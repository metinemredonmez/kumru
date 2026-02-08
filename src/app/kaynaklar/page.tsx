"use client";

import { motion } from "framer-motion";
import {
  BookOpen, Video, FileText, Download, ArrowRight,
  Headphones, Lightbulb, Heart, Target, Brain
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ResourcesPage() {
  const { t, language } = useLanguage();

  const resources = language === 'tr' ? [
    {
      icon: FileText,
      title: "Hedef Belirleme Rehberi",
      description: "SMART hedefler oluşturma ve takip etme üzerine kapsamlı rehber.",
      type: "PDF",
      category: "Rehber",
    },
    {
      icon: Video,
      title: "Sabah Rutini Oluşturma",
      description: "Güne enerjik başlamanızı sağlayacak sabah rutini videosu.",
      type: "Video",
      category: "Video",
    },
    {
      icon: Headphones,
      title: "5 Dakikalık Meditasyon",
      description: "Günlük stresi azaltmak için kısa ve etkili meditasyon.",
      type: "Ses",
      category: "Meditasyon",
    },
    {
      icon: FileText,
      title: "Öz Değerlendirme Testi",
      description: "Güçlü yönlerinizi ve gelişim alanlarınızı keşfedin.",
      type: "PDF",
      category: "Test",
    },
    {
      icon: BookOpen,
      title: "Günlük Tutma Şablonu",
      description: "Düşüncelerinizi ve duygularınızı organize etmek için şablon.",
      type: "PDF",
      category: "Şablon",
    },
    {
      icon: Video,
      title: "Nefes Teknikleri",
      description: "Kaygı anlarında kullanabileceğiniz nefes egzersizleri.",
      type: "Video",
      category: "Video",
    },
  ] : [
    {
      icon: FileText,
      title: "Goal Setting Guide",
      description: "Comprehensive guide on creating and tracking SMART goals.",
      type: "PDF",
      category: "Guide",
    },
    {
      icon: Video,
      title: "Morning Routine Creation",
      description: "Morning routine video to help you start your day with energy.",
      type: "Video",
      category: "Video",
    },
    {
      icon: Headphones,
      title: "5-Minute Meditation",
      description: "Short and effective meditation to reduce daily stress.",
      type: "Audio",
      category: "Meditation",
    },
    {
      icon: FileText,
      title: "Self-Assessment Test",
      description: "Discover your strengths and areas for development.",
      type: "PDF",
      category: "Test",
    },
    {
      icon: BookOpen,
      title: "Journal Template",
      description: "Template for organizing your thoughts and emotions.",
      type: "PDF",
      category: "Template",
    },
    {
      icon: Video,
      title: "Breathing Techniques",
      description: "Breathing exercises you can use during anxiety moments.",
      type: "Video",
      category: "Video",
    },
  ];

  const blogPosts = language === 'tr' ? [
    {
      title: "Hayatınızı Değiştirmek İçin 5 Adım",
      excerpt: "Gerçek değişim küçük adımlarla başlar. İşte başlamanız için 5 pratik öneri...",
      category: "Kişisel Gelişim",
      readTime: "5 dk",
    },
    {
      title: "Stres Yönetiminde Mindfulness",
      excerpt: "Farkındalık pratiği ile stresi nasıl yönetebileceğinizi keşfedin...",
      category: "Mindfulness",
      readTime: "4 dk",
    },
    {
      title: "Hedeflerinize Ulaşmanın Sırları",
      excerpt: "Başarılı insanların ortak özelliği: Net hedefler ve kararlılık...",
      category: "Hedef Belirleme",
      readTime: "6 dk",
    },
    {
      title: "İlişkilerde İletişimin Gücü",
      excerpt: "Sağlıklı ilişkilerin temelinde etkili iletişim yatıyor...",
      category: "İlişkiler",
      readTime: "5 dk",
    },
  ] : [
    {
      title: "5 Steps to Change Your Life",
      excerpt: "Real change starts with small steps. Here are 5 practical tips to get started...",
      category: "Personal Development",
      readTime: "5 min",
    },
    {
      title: "Mindfulness in Stress Management",
      excerpt: "Discover how you can manage stress with mindfulness practice...",
      category: "Mindfulness",
      readTime: "4 min",
    },
    {
      title: "Secrets to Reaching Your Goals",
      excerpt: "Common trait of successful people: Clear goals and determination...",
      category: "Goal Setting",
      readTime: "6 min",
    },
    {
      title: "The Power of Communication in Relationships",
      excerpt: "Effective communication lies at the foundation of healthy relationships...",
      category: "Relationships",
      readTime: "5 min",
    },
  ];

  const tips = language === 'tr' ? [
    {
      icon: Brain,
      title: "Zihin Temizliği",
      tip: "Her gün 10 dakika sessizlikle geçirin. Düşüncelerinizi gözlemleyin, yargılamayın.",
    },
    {
      icon: Heart,
      title: "Minnettarlık",
      tip: "Her akşam 3 şey için minnettar olduğunuzu yazın. Pozitif bakış açısı geliştirin.",
    },
    {
      icon: Target,
      title: "Küçük Adımlar",
      tip: "Büyük hedefleri küçük, yapılabilir adımlara bölün. Her gün bir adım atın.",
    },
    {
      icon: Lightbulb,
      title: "Öğrenme",
      tip: "Her gün yeni bir şey öğrenin. Beyin plastisitesini koruyun ve geliştirin.",
    },
  ] : [
    {
      icon: Brain,
      title: "Mind Cleansing",
      tip: "Spend 10 minutes in silence every day. Observe your thoughts, don't judge.",
    },
    {
      icon: Heart,
      title: "Gratitude",
      tip: "Write down 3 things you're grateful for each evening. Develop a positive perspective.",
    },
    {
      icon: Target,
      title: "Small Steps",
      tip: "Break big goals into small, achievable steps. Take one step every day.",
    },
    {
      icon: Lightbulb,
      title: "Learning",
      tip: "Learn something new every day. Maintain and enhance brain plasticity.",
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-32 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/kaynaklar-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[var(--amber)] font-semibold tracking-wider uppercase text-sm">
                {t.resources.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                {t.resources.title} <span className="text-[var(--amber)]">{t.resources.titleHighlight}</span>
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                {t.resources.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Daily Tips */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tips.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[var(--soft)] p-6 rounded-2xl"
                >
                  <div className="w-12 h-12 mb-4 rounded-xl bg-[var(--lavender)] flex items-center justify-center">
                    <item.icon size={24} className="text-[var(--indigo)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--dark)] mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text-body)]">{item.tip}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Free Resources */}
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
                {t.resources.downloadFree}
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                {t.resources.description}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--lavender)] flex items-center justify-center flex-shrink-0">
                      <resource.icon size={24} className="text-[var(--indigo)]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-1 bg-[var(--soft)] rounded-full text-[var(--indigo)]">
                          {resource.type}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[var(--dark)] mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-[var(--text-body)] mb-4">
                        {resource.description}
                      </p>
                      <button className="inline-flex items-center gap-2 text-[var(--indigo)] font-medium text-sm hover:gap-3 transition-all">
                        <Download size={16} /> {t.resources.downloadFree}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts */}
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
                {t.resources.blogTitle}
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                {t.resources.blogDescription}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[var(--soft)] p-6 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-medium px-3 py-1 bg-[var(--indigo)]/10 rounded-full text-[var(--indigo)]">
                      {post.category}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {post.readTime} {t.resources.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--dark)] mb-3">
                    {post.title}
                  </h3>
                  <p className="text-[var(--text-body)] mb-4">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[var(--indigo)] font-medium">
                    {t.resources.readMore} <ArrowRight size={16} />
                  </span>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 gradient-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                {t.resources.newsletterTitle}
              </h2>
              <p className="text-[var(--lavender)] mb-8 max-w-2xl mx-auto">
                {t.resources.newsletterDescription}
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={t.resources.emailPlaceholder}
                  className="flex-1 px-6 py-4 rounded-full text-[var(--dark)] focus:outline-none focus:ring-2 focus:ring-[var(--violet)]"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-[var(--violet)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-colors"
                >
                  {t.resources.subscribe}
                </button>
              </form>
              <p className="text-sm text-[var(--lavender)]/70 mt-4">
                {language === 'tr' ? 'Spam göndermiyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.' : 'No spam. Unsubscribe anytime.'}
              </p>
            </motion.div>
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
                {t.resources.ctaTitle}
              </h2>
              <p className="text-[var(--text-body)] mb-8">
                {t.resources.ctaDescription}
              </p>
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all hover:shadow-lg"
              >
                {t.resources.ctaButton}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
