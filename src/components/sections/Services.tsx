"use client";

import { motion } from "framer-motion";
import { Users, Video, BookOpen, MessageCircle, Calendar, Target } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Birebir Koçluk",
    description:
      "Kişiye özel, yoğun ve dönüştürücü koçluk seansları. Hedeflerinize odaklı, size özel bir yol haritası.",
    features: ["Haftalık seanslar", "Kişisel eylem planı", "7/24 destek"],
    popular: true,
  },
  {
    icon: Video,
    title: "Online Seanslar",
    description:
      "Dünyanın her yerinden video görüşme ile profesyonel koçluk desteği alın.",
    features: ["Esnek zamanlama", "Kayıt imkanı", "Mobil uyumlu"],
    popular: false,
  },
  {
    icon: BookOpen,
    title: "Grup Programları",
    description:
      "Benzer hedeflere sahip kişilerle birlikte öğrenin ve büyüyün. Topluluk gücünden faydalanın.",
    features: ["Haftalık buluşmalar", "Akran desteği", "Ortak hedefler"],
    popular: false,
  },
  {
    icon: MessageCircle,
    title: "Anlık Mesajlaşma",
    description:
      "Seanslar arası destek için anlık mesajlaşma imkanı. Sorularınıza hızlı yanıtlar.",
    features: ["Günlük check-in", "Hızlı geri bildirim", "Motivasyon desteği"],
    popular: false,
  },
  {
    icon: Calendar,
    title: "Kurumsal Koçluk",
    description:
      "Şirketler için özel tasarlanmış liderlik ve ekip koçluğu programları.",
    features: ["Liderlik gelişimi", "Ekip uyumu", "Performans artışı"],
    popular: false,
  },
  {
    icon: Target,
    title: "Hedef Takip Sistemi",
    description:
      "Dijital araçlarla hedeflerinizi takip edin, ilerlemenizi ölçün ve başarıyı kutlayın.",
    features: ["Günlük takip", "İlerleme raporları", "Başarı rozetleri"],
    popular: false,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 gradient-soft">
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
            Hizmetler
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mt-4 mb-6">
            Size Nasıl <span className="text-gradient">Yardımcı Olabilirim?</span>
          </h2>
          <p className="text-[var(--text-body)] max-w-2xl mx-auto">
            İhtiyaçlarınıza uygun farklı koçluk formatları ile hedeflerinize
            ulaşmanızda size eşlik ediyorum.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group ${
                service.popular ? "ring-2 ring-[var(--indigo)]" : ""
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--indigo)] text-white text-sm font-semibold rounded-full">
                  En Popüler
                </div>
              )}

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[var(--soft)] flex items-center justify-center mb-6 group-hover:bg-[var(--indigo)] transition-colors">
                <service.icon
                  size={28}
                  className="text-[var(--indigo)] group-hover:text-white transition-colors"
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-[var(--dark)] mb-3">
                {service.title}
              </h3>
              <p className="text-[var(--text-body)] mb-6">{service.description}</p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--emerald)]" />
                    <span className="text-[var(--text-muted)]">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
