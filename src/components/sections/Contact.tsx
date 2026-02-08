"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Calendar, Clock } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be added
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[var(--indigo)] font-semibold tracking-wider uppercase text-sm">
              İletişim
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mt-4 mb-6">
              Dönüşümünüz İçin{" "}
              <span className="text-gradient">İlk Adımı Atın</span>
            </h2>
            <p className="text-[var(--text-body)] leading-relaxed mb-8">
              Ücretsiz 30 dakikalık keşif görüşmesi için hemen iletişime geçin.
              Hedeflerinizi konuşalım ve size en uygun programı birlikte belirleyelim.
            </p>

            {/* Contact Info */}
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--soft)] flex items-center justify-center flex-shrink-0">
                  <Mail size={22} className="text-[var(--indigo)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--dark)] mb-1">E-posta</h4>
                  <a
                    href="mailto:kumrukoseler@gmail.com"
                    className="text-[var(--text-body)] hover:text-[var(--indigo)] transition-colors"
                  >
                    kumrukoseler@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--soft)] flex items-center justify-center flex-shrink-0">
                  <Phone size={22} className="text-[var(--indigo)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--dark)] mb-1">Telefon</h4>
                  <a
                    href="tel:+1234567890"
                    className="text-[var(--text-body)] hover:text-[var(--indigo)] transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--soft)] flex items-center justify-center flex-shrink-0">
                  <MapPin size={22} className="text-[var(--indigo)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--dark)] mb-1">Konum</h4>
                  <p className="text-[var(--text-body)]">
                    Akmerkez Residens, Kültür,<br />
                    Nisbetiye Cd, 34100<br />
                    Beşiktaş/İstanbul
                  </p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-[var(--soft)] rounded-2xl p-6">
              <h4 className="font-semibold text-[var(--dark)] mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-[var(--indigo)]" />
                Müsaitlik
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-body)]">Pazartesi - Cuma</span>
                  <span className="text-[var(--dark)] font-medium">09:00 - 18:00 (EST)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-body)]">Cumartesi</span>
                  <span className="text-[var(--dark)] font-medium">10:00 - 14:00 (EST)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-body)]">Pazar</span>
                  <span className="text-[var(--text-muted)]">Kapalı</span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-4 flex items-center gap-2">
                <Clock size={14} />
                Türkiye saati ile akşam seansları mevcuttur
              </p>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-[var(--soft)] rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-[var(--dark)] mb-2">
                Ücretsiz Keşif Görüşmesi
              </h3>
              <p className="text-[var(--text-muted)] mb-8">
                Formu doldurun, 24 saat içinde size dönüş yapalım.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[var(--dark)] mb-2"
                    >
                      Adınız Soyadınız *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-white focus:border-[var(--indigo)] focus:outline-none transition-colors"
                      placeholder="Ad Soyad"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[var(--dark)] mb-2"
                    >
                      E-posta *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-white focus:border-[var(--indigo)] focus:outline-none transition-colors"
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-[var(--dark)] mb-2"
                    >
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-white focus:border-[var(--indigo)] focus:outline-none transition-colors"
                      placeholder="+90 555 123 4567"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-[var(--dark)] mb-2"
                    >
                      İlgilendiğiniz Alan *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-white focus:border-[var(--indigo)] focus:outline-none transition-colors"
                    >
                      <option value="">Seçiniz</option>
                      <option value="kariyer">Kariyer Koçluğu</option>
                      <option value="kisisel">Kişisel Gelişim</option>
                      <option value="iliski">İlişki Koçluğu</option>
                      <option value="stres">Stres Yönetimi</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[var(--dark)] mb-2"
                  >
                    Mesajınız *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-white focus:border-[var(--indigo)] focus:outline-none transition-colors resize-none"
                    placeholder="Hedefleriniz ve beklentileriniz hakkında kısaca bilgi veriniz..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all hover:shadow-lg hover:shadow-[var(--indigo)]/30"
                >
                  <Send size={20} />
                  Görüşme Talep Et
                </button>

                <p className="text-xs text-[var(--text-muted)] text-center">
                  Bilgileriniz gizli tutulacak ve sadece iletişim amacıyla kullanılacaktır.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
