"use client";

import { motion } from "framer-motion";
import {
  Users, Video, MessageCircle, Calendar, Target, Brain,
  Heart, Briefcase, ArrowRight, CheckCircle, Clock
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const services = [
  {
    icon: Users,
    title: "Birebir Koçluk",
    shortDesc: "Kişiye özel, yoğun ve dönüştürücü koçluk seansları.",
    fullDesc: "Online veya yüz yüze gerçekleştirilen birebir koçluk seanslarında, tamamen size özel bir program oluşturuyoruz. Hedeflerinizi netleştirip, adım adım ilerlemenizi sağlıyoruz.",
    features: [
      "60 dakikalık yoğun seanslar",
      "Kişisel eylem planı",
      "7/24 WhatsApp desteği",
      "Haftalık ilerleme takibi",
      "Ödev ve egzersizler",
    ],
    duration: "4-12 Hafta",
    color: "var(--indigo)",
  },
  {
    icon: Video,
    title: "Online Seanslar",
    shortDesc: "Dünyanın her yerinden video görüşme ile koçluk.",
    fullDesc: "Zoom veya Google Meet üzerinden gerçekleştirilen online seanslarla, nerede olursanız olun profesyonel koçluk desteği alabilirsiniz. Esnek zamanlama imkanı.",
    features: [
      "Esnek saat seçenekleri",
      "Kayıt imkanı",
      "Mobil uyumlu",
      "Teknik destek",
      "Güvenli bağlantı",
    ],
    duration: "45-60 Dakika",
    color: "var(--purple)",
  },
  {
    icon: MessageCircle,
    title: "Anlık Mesajlaşma Desteği",
    shortDesc: "Seanslar arası sürekli destek ve rehberlik.",
    fullDesc: "Koçluk paketlerinize dahil olan WhatsApp destek hattı ile seanslar arasında da yanınızdayım. Sorularınızı yanıtlıyor, motivasyonunuzu yüksek tutuyorum.",
    features: [
      "Günlük check-in",
      "Hızlı geri bildirim",
      "Motivasyon desteği",
      "Kriz anlarında destek",
      "Kaynak paylaşımı",
    ],
    duration: "Sürekli",
    color: "var(--violet)",
  },
  {
    icon: Calendar,
    title: "Kurumsal Koçluk",
    shortDesc: "Şirketler için özel tasarlanmış programlar.",
    fullDesc: "Kurumsal müşteriler için liderlik gelişimi, ekip koçluğu ve performans artırma programları sunuyorum. Şirket kültürünüze özel çözümler.",
    features: [
      "Liderlik gelişimi",
      "Ekip uyumu",
      "Performans artışı",
      "Stres yönetimi",
      "İletişim becerileri",
    ],
    duration: "Özel Program",
    color: "var(--indigo)",
  },
  {
    icon: Target,
    title: "Hedef Takip Sistemi",
    shortDesc: "Dijital araçlarla hedef belirleme ve takip.",
    fullDesc: "Özel geliştirilen takip sistemi ile hedeflerinizi belirliyor, ilerlemenizi ölçüyor ve başarılarınızı kutluyoruz. Görsel raporlarla motivasyonunuzu artırın.",
    features: [
      "Günlük takip",
      "İlerleme raporları",
      "Başarı rozetleri",
      "Hatırlatıcılar",
      "Görsel grafikler",
    ],
    duration: "Sürekli",
    color: "var(--purple)",
  },
  {
    icon: Users,
    title: "Grup Programları",
    shortDesc: "Benzer hedeflere sahip kişilerle birlikte öğrenin.",
    fullDesc: "Küçük gruplarla gerçekleştirilen programlarda, topluluk gücünden faydalanın. Akran desteği ile motivasyonunuzu yüksek tutun.",
    features: [
      "Haftalık buluşmalar",
      "Akran desteği",
      "Ortak hedefler",
      "Grup dinamiği",
      "Uygun fiyat",
    ],
    duration: "8 Hafta",
    color: "var(--violet)",
  },
];

const specializations = [
  {
    icon: Brain,
    title: "Kişisel Gelişim",
    description: "Öz farkındalık, özgüven ve kişisel dönüşüm",
  },
  {
    icon: Heart,
    title: "İlişki Koçluğu",
    description: "Sağlıklı ilişkiler kurma ve iletişim becerileri",
  },
  {
    icon: Briefcase,
    title: "Kariyer Koçluğu",
    description: "Kariyer planlama, iş-yaşam dengesi",
  },
  {
    icon: Target,
    title: "Hedef Odaklı Koçluk",
    description: "Net hedefler belirleme ve gerçekleştirme",
  },
];

export default function ServicesPage() {
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
                Hizmetler
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mt-4 mb-6">
                Size Nasıl <span className="text-gradient">Yardımcı Olabilirim?</span>
              </h1>
              <p className="text-lg text-[var(--text-body)] max-w-2xl mx-auto">
                İhtiyaçlarınıza uygun farklı koçluk formatları ile hedeflerinize
                ulaşmanızda size eşlik ediyorum.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Specializations */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {specializations.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--lavender)] flex items-center justify-center">
                    <spec.icon size={28} className="text-[var(--indigo)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--dark)] mb-2">{spec.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{spec.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
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
                Hizmet Seçenekleri
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                Her ihtiyaca uygun farklı koçluk formatları
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${service.color}15` }}
                  >
                    <service.icon size={28} style={{ color: service.color }} />
                  </div>

                  <h3 className="text-xl font-semibold text-[var(--dark)] mb-2">
                    {service.title}
                  </h3>

                  <p className="text-[var(--text-body)] mb-4">
                    {service.fullDesc}
                  </p>

                  <div className="flex items-center gap-2 mb-4 text-sm text-[var(--text-muted)]">
                    <Clock size={16} />
                    <span>{service.duration}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm text-[var(--text-body)]">
                        <CheckCircle size={16} className="text-[var(--emerald)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/iletisim"
                    className="inline-flex items-center gap-2 text-[var(--indigo)] font-medium hover:gap-3 transition-all"
                  >
                    Detaylı Bilgi <ArrowRight size={16} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
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
                Nasıl Çalışıyoruz?
              </h2>
              <p className="text-[var(--text-body)] max-w-2xl mx-auto">
                Koçluk sürecimiz 4 basit adımda ilerliyor
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Keşif Görüşmesi", desc: "Ücretsiz 30 dakikalık tanışma" },
                { step: "02", title: "Program Seçimi", desc: "Size uygun programı belirleriz" },
                { step: "03", title: "Koçluk Süreci", desc: "Düzenli seanslarla ilerleme" },
                { step: "04", title: "Dönüşüm", desc: "Hedeflerinize ulaşın" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold text-[var(--lavender)] mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-[var(--dark)] mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                Hangi Hizmet Size Uygun?
              </h2>
              <p className="text-[var(--lavender)] mb-8 max-w-2xl mx-auto">
                Ücretsiz keşif görüşmesinde ihtiyaçlarınızı değerlendirelim ve
                size en uygun programı birlikte belirleyelim.
              </p>
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--dark)] rounded-full font-semibold hover:bg-[var(--lavender)] transition-all"
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
