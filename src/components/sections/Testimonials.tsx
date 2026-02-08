"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Mehri Hemdemova",
    role: "Google Yorumu",
    avatar: "MH",
    rating: 5,
    text: "Mükkemmel deneyim! En iyi yaşam koçlarının arasında. İlk 5'te bence!",
    isGoogle: true,
  },
  {
    name: "Sadiyesmeen Ameen",
    role: "Google Yorumu",
    avatar: "SA",
    rating: 5,
    text: "Gerçekten Kumru Hanım'dan çok memnun kaldım. Bana dedi ki beşinci ayda buradan taşınacaksın, inanmadım ama gerçekten de taşınıyorum! Allah razı olsun.",
    isGoogle: true,
  },
  {
    name: "Nilcan Çimen",
    role: "Google Yorumu",
    avatar: "NC",
    rating: 5,
    text: "Öngörüleri ve hisleri harika! Danışmanlık aldığımdan beri işlerim açıldı, hayatım düzene girdi.",
    isGoogle: true,
  },
  {
    name: "Kurutta Senshi",
    role: "Google Yorumu",
    avatar: "KS",
    rating: 5,
    text: "Güven veren ses tonuyla muhteşem analizleriyle mükemmel bir insan. İyiki yolum kesişmiş, varlığına duacı olduğum ender insanlardan biri.",
    isGoogle: true,
  },
  {
    name: "EFE Gülmez",
    role: "Google Yorumu",
    avatar: "EG",
    rating: 5,
    text: "Hisleri o kadar kuvvetli ki 15 sene önce dediği her şeyi yaşıyorum.",
    isGoogle: true,
  },
  {
    name: "Jasmin",
    role: "Google Yorumu",
    avatar: "J",
    rating: 5,
    text: "Harika insan, harika enerji, harika!",
    isGoogle: true,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 gradient-soft">
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
            Yorumlar
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mt-4 mb-6">
            Danışanlarım <span className="text-gradient">Ne Diyor?</span>
          </h2>
          <p className="text-[var(--text-body)] max-w-2xl mx-auto">
            Google'da 5.0 puan ve 10+ yorum ile danışanlarımın dönüşüm hikayelerinden bazıları.
            Sıradaki başarı hikayesi sizin olabilir.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote size={32} className="text-[var(--lavender)]" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-[var(--amber)] fill-[var(--amber)]"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-[var(--text-body)] leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--soft)] flex items-center justify-center">
                  <span className="text-[var(--indigo)] font-semibold">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--dark)]">
                    {testimonial.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-[var(--text-muted)]">
                      {testimonial.role}
                    </p>
                    {testimonial.isGoogle && (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-white rounded-3xl p-8 shadow-sm"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--indigo)]">
                5.0
              </div>
              <div className="text-[var(--text-muted)] mt-1">Google Puanı</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--indigo)]">
                10+
              </div>
              <div className="text-[var(--text-muted)] mt-1">Google Yorumu</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--indigo)]">
                100%
              </div>
              <div className="text-[var(--text-muted)] mt-1">5 Yıldız</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--indigo)]">
                İstanbul
              </div>
              <div className="text-[var(--text-muted)] mt-1">Akmerkez</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
