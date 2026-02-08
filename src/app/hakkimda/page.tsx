"use client";

import { motion } from "framer-motion";
import { CheckCircle, Award, Heart, Sparkles, GraduationCap, Star, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const certifications = [
  {
    title: "ICF Sertifikalı Koç",
    organization: "International Coach Federation",
    year: "2018",
  },
  {
    title: "NLP Practitioner",
    organization: "NLP Academy",
    year: "2016",
  },
  {
    title: "Davranış Bilimleri Uzmanı",
    organization: "York Üniversitesi, Kanada",
    year: "2015",
  },
  {
    title: "Yaşam Koçluğu Sertifikası",
    organization: "Kingsley State, İngiltere",
    year: "2014",
  },
];

const timeline = [
  {
    year: "2014",
    title: "Koçluk Yolculuğunun Başlangıcı",
    description: "İngiltere'de yaşam koçluğu eğitimimi tamamladım.",
  },
  {
    year: "2016",
    title: "NLP Uzmanlığı",
    description: "NLP teknikleriyle koçluk metodolojimi zenginleştirdim.",
  },
  {
    year: "2018",
    title: "ICF Akreditasyonu",
    description: "Uluslararası Koçluk Federasyonu sertifikasını aldım.",
  },
  {
    year: "2020",
    title: "Online Koçluk",
    description: "Pandemi döneminde online koçluk programlarını başlattım.",
  },
  {
    year: "2023",
    title: "Retreat Programları",
    description: "Otel konaklamalı grup retreat programlarını hayata geçirdim.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Empati",
    description: "Her danışanı benzersiz bir birey olarak görür, hikayesini dinlerim.",
  },
  {
    icon: Star,
    title: "Dürüstlük",
    description: "Açık ve şeffaf iletişim, güven ilişkisinin temelidir.",
  },
  {
    icon: Sparkles,
    title: "Dönüşüm",
    description: "Gerçek ve kalıcı değişim için birlikte çalışırız.",
  },
  {
    icon: Award,
    title: "Mükemmellik",
    description: "Sürekli öğrenme ve gelişim ile en iyi hizmeti sunarım.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 gradient-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[var(--indigo)] font-semibold tracking-wider uppercase text-sm">
                  Hakkımda
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mt-4 mb-6">
                  Merhaba, Ben{" "}
                  <span className="text-gradient">Kumru Köseler</span>
                </h1>
                <p className="text-lg text-[var(--text-body)] leading-relaxed mb-6">
                  "Dünyadaki bütün çocuklar benim" diyen bir anne, İngiltere ve Kanada'da
                  davranış bilimleri eğitimi alan, spiritüel bir rehber ve davranış bilimleri uzmanıyım.
                </p>
                <p className="text-[var(--text-body)] leading-relaxed mb-8">
                  Tüm dikkatimi gerçek olabileceğinize inandığım, sevgiyle kendi iç
                  neşenizi de ekleyebileceğim "Sihirli Dilek Defteri" adlı kitabıma, yeni yılla
                  da güzellikleri olacak olan Kumru Köseler'i Akmerkez'deki ofisinde ziyaret ettik.
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/iletisim"
                    className="inline-flex items-center justify-center px-6 py-3 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all"
                  >
                    Randevu Al
                  </Link>
                  <Link
                    href="/medya"
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-[var(--indigo)] text-[var(--indigo)] rounded-full font-semibold hover:bg-[var(--indigo)] hover:text-white transition-all"
                  >
                    Medyada Ben
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/profile.jpg"
                    alt="Kumru Köseler"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[var(--indigo)] text-white p-6 rounded-2xl shadow-xl">
                  <div className="text-4xl font-bold">10+</div>
                  <div className="text-sm opacity-80">Yıl Deneyim</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[var(--dark)] mb-6">
                Hikayem
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg max-w-none text-[var(--text-body)]"
            >
              <p className="mb-6">
                Çok genç yaşta içimdeki mistik güçü keşfettim. Eğitimimi de bu yönde almak
                amacı ile Kingsley State (İngiltere) ile Kanada York Üniversitesi yönetim ve
                davranış bilimlerini seçtim ve mezun oldum.
              </p>
              <p className="mb-6">
                Ayrıca branşımla ilgili kendimi daha da geliştirebilmek adına, sertifika
                programlarına katılarak sertifikalar aldım. Bir rehber ve davranış bilimleri
                uzmanı olarak yaptığım çalışmalarla mistik bilincimi en üst seviyeye taşımaya
                devam ediyorum.
              </p>
              <p className="mb-6">
                Bugün ne düşünürsen kendine çekebilirsin, niyet enerjisini kullanabilirsin.
                Hissettiğini yaşarsın, karşındaki insanları gözlemden sadece düşünce yolu
                ile içinde bulunduğum durumların hislerideğer ve sayısız danışana harika
                işlere imza atan, pozitif yönde hayatından değişimine vesile olabilecek spiritüel
                bir rehber ve davranış bilimleri uzmanıyım.
              </p>
              <p>
                Bu mesleği seçmemdeki en önemli sebeplerden biri, bilincin küçük yaşta
                şekillenmesi ve bunun tüm hayatımıza olan etkisi. Amacım, bilincimizin
                sağlıklı ve sevgiyle oluşmasını sağlamak, çocuklarımızın gelecekte
                yaşayabilmeleri için çok daha mutlu bireyler olarak hayatlarına devam
                edebilmelerine vesile olmak.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
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
                Değerlerim
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                Her danışanımla kurduğum ilişkinin temelini oluşturan değerler
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--lavender)] flex items-center justify-center">
                    <value.icon size={28} className="text-[var(--indigo)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--dark)] mb-2">{value.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
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
                Sertifikalar & Eğitimler
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[var(--soft)] p-6 rounded-2xl"
                >
                  <div className="w-12 h-12 mb-4 rounded-xl bg-[var(--indigo)] flex items-center justify-center">
                    <GraduationCap size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-[var(--dark)] mb-1">{cert.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-2">{cert.organization}</p>
                  <span className="text-xs text-[var(--indigo)] font-medium">{cert.year}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 gradient-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Yolculuğum</h2>
            </motion.div>

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-20 text-right">
                    <span className="text-[var(--amber)] font-bold">{item.year}</span>
                  </div>
                  <div className="w-3 h-3 mt-2 rounded-full bg-[var(--violet)] flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-[var(--lavender)] text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[var(--dark)] mb-6">
                Birlikte Çalışalım
              </h2>
              <p className="text-[var(--text-body)] mb-8 max-w-2xl mx-auto">
                Hayatınızda pozitif bir değişim yaratmak için ilk adımı atın.
                Ücretsiz keşif görüşmesi ile tanışalım.
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
