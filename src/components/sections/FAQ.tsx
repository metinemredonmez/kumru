"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Yaşam koçluğu nedir ve bana nasıl yardımcı olabilir?",
    answer:
      "Yaşam koçluğu, hedeflerinize ulaşmanızda, engellerinizi aşmanızda ve potansiyelinizi ortaya çıkarmanızda size rehberlik eden profesyonel bir destektir. Kariyer, ilişkiler, kişisel gelişim gibi alanlarda somut sonuçlar elde etmenize yardımcı olurum.",
  },
  {
    question: "Seanslar nasıl gerçekleşiyor?",
    answer:
      "Seanslar online olarak Zoom üzerinden gerçekleşir. Her seans 60 dakika sürer ve tamamen size özeldir. Kanada'dan Türkiye saatine uygun akşam seansları da mevcuttur.",
  },
  {
    question: "İlk görüşme ücretsiz mi?",
    answer:
      "Evet! 30 dakikalık ücretsiz keşif görüşmesi ile tanışıyoruz. Bu görüşmede hedeflerinizi konuşuyor ve size en uygun programı birlikte belirliyoruz. Hiçbir taahhüt gerektirmez.",
  },
  {
    question: "Hangi konularda koçluk alabiliyorum?",
    answer:
      "Kariyer değişikliği, iş-yaşam dengesi, stres yönetimi, özgüven geliştirme, ilişki sorunları, hedef belirleme, motivasyon ve kişisel dönüşüm gibi birçok alanda destek sunuyorum.",
  },
  {
    question: "Ne kadar sürede sonuç alabilirim?",
    answer:
      "Her birey farklıdır, ancak çoğu danışanım 4-6 seans içinde somut değişimler fark etmeye başlıyor. Kalıcı dönüşüm için 12 haftalık program öneriyorum.",
  },
  {
    question: "Ödeme seçenekleri nelerdir?",
    answer:
      "Kredi kartı, banka havalesi ve taksit imkanı sunuyorum. Tüm ödemeler güvenli şekilde işlenir. Program başlamadan önce ödeme detaylarını netleştiriyoruz.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 gradient-soft">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[var(--indigo)] font-semibold tracking-wider uppercase text-sm">
            Sıkça Sorulan Sorular
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mt-4 mb-6">
            Merak <span className="text-gradient">Ettikleriniz</span>
          </h2>
          <p className="text-[var(--text-body)] max-w-2xl mx-auto">
            Koçluk süreci hakkında en çok sorulan sorular ve cevapları.
            Başka sorularınız varsa iletişime geçmekten çekinmeyin.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--soft)]/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--soft)] flex items-center justify-center flex-shrink-0">
                    <HelpCircle size={20} className="text-[var(--indigo)]" />
                  </div>
                  <span className="font-semibold text-[var(--dark)] pr-4">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-[var(--indigo)] transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-6 text-[var(--text-body)] leading-relaxed pl-20">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-[var(--text-muted)] mb-4">
            Sorunuzun cevabını bulamadınız mı?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--indigo)] text-white rounded-full font-semibold hover:bg-[var(--purple)] transition-colors"
          >
            Bana Ulaşın
          </a>
        </motion.div>
      </div>
    </section>
  );
}
