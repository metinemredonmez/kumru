"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState } from "react";

const contactInfo = [
  {
    icon: Mail,
    title: "E-posta",
    value: "kumrukoseler@gmail.com",
    link: "mailto:kumrukoseler@gmail.com",
  },
  {
    icon: Phone,
    title: "Telefon",
    value: "+90 534 367 56 69",
    link: "tel:+905343675669",
  },
  {
    icon: MapPin,
    title: "Adres",
    value: "Akmerkez Residens, Kültür, Nisbetiye Cd, 34100 Beşiktaş/İstanbul",
    link: "https://maps.google.com/?q=Akmerkez+Residens+Beşiktaş+İstanbul",
  },
  {
    icon: Clock,
    title: "Çalışma Saatleri",
    value: "Pazartesi - Cumartesi: 09:00 - 19:00",
    link: null,
  },
];

const faqItems = [
  {
    q: "İlk görüşme ücretsiz mi?",
    a: "Evet, 30 dakikalık keşif görüşmesi tamamen ücretsizdir. Bu görüşmede tanışır, ihtiyaçlarınızı değerlendirir ve size uygun programı belirleriz.",
  },
  {
    q: "Online seans yapıyor musunuz?",
    a: "Evet, Zoom veya Google Meet üzerinden online seanslar yapıyorum. Dünyanın her yerinden katılabilirsiniz.",
  },
  {
    q: "Seans süresi ne kadar?",
    a: "Birebir koçluk seansları genellikle 60 dakikadır. Grup seansları ve retreatlar için süre değişkenlik gösterir.",
  },
  {
    q: "Ödeme seçenekleri neler?",
    a: "Nakit, havale/EFT ve kredi kartı ile ödeme yapabilirsiniz. Taksit imkanı mevcuttur.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    console.log(formData);
    alert("Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.");
  };

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
                İletişim
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mt-4 mb-6">
                Benimle <span className="text-gradient">İletişime Geçin</span>
              </h1>
              <p className="text-lg text-[var(--text-body)] max-w-2xl mx-auto">
                Sorularınız mı var? Ücretsiz keşif görüşmesi ayarlamak mı istiyorsunuz?
                Hemen iletişime geçin!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-[var(--dark)] mb-6">
                  Mesaj Gönderin
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--dark)] mb-2">
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--lavender)] focus:outline-none focus:ring-2 focus:ring-[var(--indigo)] transition-all"
                        placeholder="Adınız Soyadınız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--dark)] mb-2">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--lavender)] focus:outline-none focus:ring-2 focus:ring-[var(--indigo)] transition-all"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--dark)] mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--lavender)] focus:outline-none focus:ring-2 focus:ring-[var(--indigo)] transition-all"
                        placeholder="+90 5XX XXX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--dark)] mb-2">
                        Konu *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--lavender)] focus:outline-none focus:ring-2 focus:ring-[var(--indigo)] transition-all bg-white"
                      >
                        <option value="">Seçiniz</option>
                        <option value="kesif">Ücretsiz Keşif Görüşmesi</option>
                        <option value="birebir">Birebir Koçluk</option>
                        <option value="retreat">Retreat Programları</option>
                        <option value="kurumsal">Kurumsal Koçluk</option>
                        <option value="diger">Diğer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--dark)] mb-2">
                      Mesajınız *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--lavender)] focus:outline-none focus:ring-2 focus:ring-[var(--indigo)] transition-all resize-none"
                      placeholder="Mesajınızı yazın..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-all hover:shadow-lg w-full md:w-auto"
                  >
                    <Send size={18} />
                    Mesaj Gönder
                  </button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-[var(--dark)] mb-6">
                  İletişim Bilgileri
                </h2>

                <div className="space-y-6 mb-8">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--soft)] flex items-center justify-center flex-shrink-0">
                        <info.icon size={24} className="text-[var(--indigo)]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[var(--dark)] mb-1">
                          {info.title}
                        </h4>
                        {info.link ? (
                          <a
                            href={info.link}
                            target={info.link.startsWith("http") ? "_blank" : undefined}
                            rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-[var(--text-body)] hover:text-[var(--indigo)] transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-[var(--text-body)]">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                <div className="bg-[var(--soft)] p-6 rounded-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center">
                      <MessageCircle size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--dark)]">
                        WhatsApp ile Ulaşın
                      </h4>
                      <p className="text-sm text-[var(--text-muted)]">
                        Hızlı yanıt için WhatsApp'tan yazın
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/905343675669"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#25D366] text-white rounded-full font-semibold hover:bg-[#128C7E] transition-colors"
                  >
                    <MessageCircle size={18} />
                    WhatsApp'tan Yaz
                  </a>
                </div>

                {/* Map */}
                <div className="mt-8 rounded-2xl overflow-hidden h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.5738881881597!2d29.02323!3d41.0785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab63f8f0f3c41%3A0x4c15c76d5a4a26f2!2sAkmerkez!5e0!3m2!1str!2str!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-[var(--soft)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[var(--dark)] mb-4">
                Sık Sorulan Sorular
              </h2>
            </motion.div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl"
                >
                  <h3 className="font-semibold text-[var(--dark)] mb-2">{item.q}</h3>
                  <p className="text-[var(--text-body)]">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 gradient-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                Dönüşüm Yolculuğunuz Burada Başlıyor
              </h2>
              <p className="text-[var(--lavender)] mb-8">
                Ücretsiz 30 dakikalık keşif görüşmesi ile tanışalım ve
                size en uygun programı birlikte belirleyelim.
              </p>
              <a
                href="https://wa.me/905343675669?text=Merhaba,%20ücretsiz%20keşif%20görüşmesi%20için%20randevu%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--dark)] rounded-full font-semibold hover:bg-[var(--lavender)] transition-all"
              >
                Hemen Randevu Al
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
