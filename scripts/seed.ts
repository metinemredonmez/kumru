/**
 * Seed script: mevcut i18n JSON içeriğini Payload CMS'e aktarır.
 *
 * Çalıştırma: npx tsx scripts/seed.ts
 *
 * İdempotenttir: dolu koleksiyonlar / dolu global alanlar atlanır.
 * Lokalizasyon deseni: önce { locale: "tr" } ile create, sonra aynı id'ye
 * { locale: "en" } ile sadece localized alanların EN değerleri yazılır.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";
import config from "../src/payload.config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const tr = JSON.parse(
  fs.readFileSync(path.resolve(dirname, "../src/i18n/locales/tr.json"), "utf-8"),
);
const en = JSON.parse(
  fs.readFileSync(path.resolve(dirname, "../src/i18n/locales/en.json"), "utf-8"),
);

/** public/api/chat.php içindeki $systemPrompt değişkeninin içeriği (PHP sınırlayıcıları temizlenmiş hali). */
const CHATBOT_SYSTEM_PROMPT = `🌐 CRITICAL LANGUAGE RULE:
You MUST detect the language of each user message and respond in THE SAME LANGUAGE.
- If the user writes in English → respond in English
- If the user writes in Turkish → respond in Turkish
- Always match the user's language, regardless of site settings.

═══════════════════════════════════════
ABOUT YOU / SEN KİMSİN
═══════════════════════════════════════
You are the professional digital assistant on Kumru Köseler's website. Your name is 'Kumru Assistant'. Use a warm, friendly but professional tone.

Sen Kumru Köseler'in web sitesindeki profesyonel dijital asistansın. Adın 'Kumru Asistan'. Sıcak, samimi ama profesyonel bir dil kullan.

═══════════════════════════════════════
ABOUT KUMRU KÖSELER / KUMRU KÖSELER HAKKINDA
═══════════════════════════════════════
- Professional Life Coach / Profesyonel Yaşam Koçu
- 10+ years experience, international certifications / 10+ yıl deneyim, uluslararası sertifikalar
- ICF (International Coach Federation) accredited / ICF akredite
- Specializations: Personal transformation, relationship coaching, career coaching, goal setting, stress management
- Uzmanlık: Kişisel dönüşüm, ilişki koçluğu, kariyer koçluğu, hedef belirleme, stres yönetimi
- Also a spiritual guide: energy work, healing sessions, spiritual counseling / Ayrıca spiritüel rehber: enerji çalışmaları, şifa seansları, spiritüel danışmanlık
- Location / Lokasyon: Akmerkez Residens, Beşiktaş, Istanbul, Turkey

═══════════════════════════════════════
SERVICES / HİZMETLER
═══════════════════════════════════════
1. ONE-ON-ONE COACHING / BİREBİR KOÇLUK - 60-minute private sessions
2. ONLINE COACHING / ONLİNE KOÇLUK - Via Zoom/Google Meet
3. MESSAGING SUPPORT / MESAJLAŞMA DESTEĞİ - WhatsApp follow-up
4. CORPORATE TRAINING / KURUMSAL EĞİTİMLER - Custom programs for companies
5. GROUP SESSIONS / GRUP SEANSLARI - Small group work

═══════════════════════════════════════
SPIRITUAL SERVICES / SPİRİTÜEL SEANSLAR (listed prices / liste fiyatları)
═══════════════════════════════════════
1-hour sessions, 300 CAD each / 1 saatlik seanslar, her biri 300 CAD:
- Regression Therapy / Regresyon Terapisi
- Blockage Removal / Blokaj Kaldırma Çalışması
- Frequency Raising / Frekans Yükseltme Çalışması
- Ancestral Karma Healing / Ata Karma Şifası
- Mother Womb Healing / Anne Rahim Şifası
- Intention Energy / Niyet Enerjisi
- Fortune Blockage / Kısmet Blokajı
- Emotional Weight / Duygusal Kilo
- Yildizname (Star Chart Reading) / Yıldızname
- Spiritual Counseling / Spiritüel Danışmanlık

Other sessions / Diğer seanslar:
- Initial Consultation / İlk Görüşme: 15 min, 100 CAD
- Online Spiritual Counseling / Online Spiritüel Danışmanlık: 45 min, 300 CAD
- Energy Cleansing / Enerji Arındırma: 1 hour, 400 CAD
- Seal Work / Mühür Çalışması: 1 hour, 500 CAD
- Spiritual Counseling 8-Session Package / 8 Seans Paketi: 8 x 45 min, 1,500 CAD

═══════════════════════════════════════
PROGRAMS / PROGRAMLAR
═══════════════════════════════════════
1. ONE-ON-ONE COACHING PROGRAM / BİREBİR KOÇLUK PROGRAMI - Personalized, flexible duration
2. TRANSFORMATION RETREAT / DÖNÜŞÜM RETREATİ - 3 days, accommodation included
3. VIP RETREAT - 4 days, luxury accommodation, intensive one-on-one

═══════════════════════════════════════
IMPORTANT RULES / ÖNEMLİ KURALLAR (MUST FOLLOW)
═══════════════════════════════════════

🚫 PRICING QUESTIONS / FİYAT SORUSU:
For SPIRITUAL SESSIONS you may share the listed prices above (they are public on the website), then direct to WhatsApp for booking.
Spiritüel seanslar için yukarıdaki liste fiyatlarını paylaşabilirsin (web sitesinde açıkça yayınlanıyor), ardından randevu için WhatsApp'a yönlendir.

For COACHING PROGRAMS AND RETREATS never give prices! Always respond:
EN: 'Our coaching program prices are determined based on personalized program content. We can schedule a free 30-minute discovery session for a custom offer. Book via WhatsApp: +90 534 367 56 69'
TR: 'Koçluk programı fiyatlarımız kişiye özel program içeriğine göre belirleniyor. Size özel bir teklif için ücretsiz 30 dakikalık keşif görüşmesi yapabiliriz. WhatsApp'tan hemen randevu alabilirsiniz: +90 534 367 56 69'

🚫 APPOINTMENT REQUESTS / RANDEVU TALEBİ:
EN: 'For appointments, please contact us via WhatsApp: +90 534 367 56 69. We will find the best time together!'
TR: 'Randevu için WhatsApp üzerinden bize ulaşabilirsiniz: +90 534 367 56 69. Size en uygun saati birlikte belirleyelim!'

🚫 MEDICAL/PSYCHOLOGICAL ADVICE / TIBBİ TAVSİYE:
Never give medical or psychological diagnosis/treatment.
EN: 'I can offer coaching support on this, but I recommend consulting a specialist for medical/psychological evaluation.'
TR: 'Bu konuda size koçluk desteği sunabilirim, ancak tıbbi/psikolojik değerlendirme için uzman bir profesyonele danışmanızı öneririm.'

🚫 UNKNOWN TOPICS / BİLİNMEYEN KONULAR:
EN: 'For the most accurate information on this, I recommend speaking with Kumru directly. WhatsApp: +90 534 367 56 69'
TR: 'Bu konuda size en doğru bilgiyi vermek için Kumru Hanım ile görüşmenizi öneririm. WhatsApp: +90 534 367 56 69'

═══════════════════════════════════════
CONTACT INFORMATION / İLETİŞİM BİLGİLERİ
═══════════════════════════════════════
📧 Email: kumrukoseler@gmail.com
📱 Phone/WhatsApp: +90 534 367 56 69
📍 Address / Adres: Akmerkez Residens, Beşiktaş, Istanbul
🕐 Working Hours / Çalışma Saatleri: Monday-Saturday / Pazartesi-Cumartesi 09:00-19:00
🌐 Instagram: @kumrukoseler

═══════════════════════════════════════
RESPONSE FORMAT / YANIT FORMATI
═══════════════════════════════════════
- Be short and concise (max 3-4 sentences) / Kısa ve öz ol
- Friendly but professional / Samimi ama profesyonel
- Always try to be helpful / Her zaman yardımcı ol
- Direct to WhatsApp when needed / Gerektiğinde WhatsApp'a yönlendir
- You can use emojis but don't overdo it / Emoji kullanabilirsin ama abartma

REMEMBER: Always respond in the SAME language as the user's message!`;

/**
 * src/components/sections/Testimonials.tsx içindeki `testimonialsTR` / `testimonialsEN`
 * dizilerinin seed için gerekli alanları (name, rating, text).
 * TR ve EN aynı sırada ve aynı `name` ile eşleşir; `text` lokalize alandır.
 * (seed.ts bir React client bileşenini import edemediği için diziler buraya kopyalandı.)
 */
const TESTIMONIALS_TR = [
  {
    name: "Mehri Hemdemova",
    rating: 5,
    text: "Mükkemmel deneyim! En iyi yaşam koçlarının arasında. İlk 5'te bence!",
  },
  {
    name: "Sadiyesmeen Ameen",
    rating: 5,
    text: "Gerçekten Kumru Hanım'dan çok memnun kaldım. Bana dedi ki beşinci ayda buradan taşınacaksın, inanmadım ama gerçekten de taşınıyorum! Allah razı olsun.",
  },
  {
    name: "Nilcan Çimen",
    rating: 5,
    text: "Öngörüleri ve hisleri harika! Danışmanlık aldığımdan beri işlerim açıldı, hayatım düzene girdi.",
  },
  {
    name: "Kurutta Senshi",
    rating: 5,
    text: "Güven veren ses tonuyla muhteşem analizleriyle mükemmel bir insan. İyiki yolum kesişmiş, varlığına duacı olduğum ender insanlardan biri.",
  },
  {
    name: "EFE Gülmez",
    rating: 5,
    text: "Hisleri o kadar kuvvetli ki 15 sene önce dediği her şeyi yaşıyorum.",
  },
  {
    name: "Jasmin",
    rating: 5,
    text: "Harika insan, harika enerji, harika!",
  },
];

const TESTIMONIALS_EN = [
  {
    name: "Mehri Hemdemova",
    rating: 5,
    text: "Excellent experience! Among the best life coaches. In my top 5!",
  },
  {
    name: "Sadiyesmeen Ameen",
    rating: 5,
    text: "I'm really satisfied with Kumru. She told me I would move in the fifth month, I didn't believe it but I really am moving! Thank you so much.",
  },
  {
    name: "Nilcan Çimen",
    rating: 5,
    text: "Her insights and feelings are amazing! Since I started consulting, my work has improved, my life is in order.",
  },
  {
    name: "Kurutta Senshi",
    rating: 5,
    text: "A wonderful person with a reassuring voice and amazing analysis. I'm so glad our paths crossed, one of the rare people I'm grateful for.",
  },
  {
    name: "EFE Gülmez",
    rating: 5,
    text: "Her feelings are so strong that I'm living everything she said 15 years ago.",
  },
  {
    name: "Jasmin",
    rating: 5,
    text: "Amazing person, amazing energy, amazing!",
  },
];

/**
 * src/app/(frontend)/kaynaklar/page.tsx içindeki `resources` dizisinin seed için
 * gerekli alanları. TR ve EN aynı sırada. icon alanı atlandı.
 * title/description/category lokalize; type lokalize DEĞİL (TR değeri saklanır).
 * (seed.ts bir React client bileşenini import edemediği için diziler buraya kopyalandı.)
 */
const RESOURCES_TR = [
  { title: "Hedef Belirleme Rehberi", description: "SMART hedefler oluşturma ve takip etme üzerine kapsamlı rehber.", type: "PDF", category: "Rehber" },
  { title: "Sabah Rutini Oluşturma", description: "Güne enerjik başlamanızı sağlayacak sabah rutini videosu.", type: "Video", category: "Video" },
  { title: "5 Dakikalık Meditasyon", description: "Günlük stresi azaltmak için kısa ve etkili meditasyon.", type: "Ses", category: "Meditasyon" },
  { title: "Öz Değerlendirme Testi", description: "Güçlü yönlerinizi ve gelişim alanlarınızı keşfedin.", type: "PDF", category: "Test" },
  { title: "Günlük Tutma Şablonu", description: "Düşüncelerinizi ve duygularınızı organize etmek için şablon.", type: "PDF", category: "Şablon" },
  { title: "Nefes Teknikleri", description: "Kaygı anlarında kullanabileceğiniz nefes egzersizleri.", type: "Video", category: "Video" },
];

const RESOURCES_EN = [
  { title: "Goal Setting Guide", description: "Comprehensive guide on creating and tracking SMART goals.", type: "PDF", category: "Guide" },
  { title: "Morning Routine Creation", description: "Morning routine video to help you start your day with energy.", type: "Video", category: "Video" },
  { title: "5-Minute Meditation", description: "Short and effective meditation to reduce daily stress.", type: "Audio", category: "Meditation" },
  { title: "Self-Assessment Test", description: "Discover your strengths and areas for development.", type: "PDF", category: "Test" },
  { title: "Journal Template", description: "Template for organizing your thoughts and emotions.", type: "PDF", category: "Template" },
  { title: "Breathing Techniques", description: "Breathing exercises you can use during anxiety moments.", type: "Video", category: "Video" },
];

/**
 * src/app/(frontend)/kaynaklar/page.tsx içindeki `blogPosts` dizisi.
 * TR ve EN aynı sırada. Tüm alanlar (title/excerpt/category/readTime) lokalize.
 */
const BLOG_POSTS_TR = [
  { title: "Hayatınızı Değiştirmek İçin 5 Adım", excerpt: "Gerçek değişim küçük adımlarla başlar. İşte başlamanız için 5 pratik öneri...", category: "Kişisel Gelişim", readTime: "5 dk" },
  { title: "Stres Yönetiminde Mindfulness", excerpt: "Farkındalık pratiği ile stresi nasıl yönetebileceğinizi keşfedin...", category: "Mindfulness", readTime: "4 dk" },
  { title: "Hedeflerinize Ulaşmanın Sırları", excerpt: "Başarılı insanların ortak özelliği: Net hedefler ve kararlılık...", category: "Hedef Belirleme", readTime: "6 dk" },
  { title: "İlişkilerde İletişimin Gücü", excerpt: "Sağlıklı ilişkilerin temelinde etkili iletişim yatıyor...", category: "İlişkiler", readTime: "5 dk" },
];

const BLOG_POSTS_EN = [
  { title: "5 Steps to Change Your Life", excerpt: "Real change starts with small steps. Here are 5 practical tips to get started...", category: "Personal Development", readTime: "5 min" },
  { title: "Mindfulness in Stress Management", excerpt: "Discover how you can manage stress with mindfulness practice...", category: "Mindfulness", readTime: "4 min" },
  { title: "Secrets to Reaching Your Goals", excerpt: "Common trait of successful people: Clear goals and determination...", category: "Goal Setting", readTime: "6 min" },
  { title: "The Power of Communication in Relationships", excerpt: "Effective communication lies at the foundation of healthy relationships...", category: "Relationships", readTime: "5 min" },
];

/**
 * src/app/(frontend)/kaynaklar/page.tsx içindeki `tips` dizisi.
 * TR ve EN aynı sırada. title/tip lokalize; icon atlandı.
 */
const TIPS_TR = [
  { title: "Zihin Temizliği", tip: "Her gün 10 dakika sessizlikle geçirin. Düşüncelerinizi gözlemleyin, yargılamayın." },
  { title: "Minnettarlık", tip: "Her akşam 3 şey için minnettar olduğunuzu yazın. Pozitif bakış açısı geliştirin." },
  { title: "Küçük Adımlar", tip: "Büyük hedefleri küçük, yapılabilir adımlara bölün. Her gün bir adım atın." },
  { title: "Öğrenme", tip: "Her gün yeni bir şey öğrenin. Beyin plastisitesini koruyun ve geliştirin." },
];

const TIPS_EN = [
  { title: "Mind Cleansing", tip: "Spend 10 minutes in silence every day. Observe your thoughts, don't judge." },
  { title: "Gratitude", tip: "Write down 3 things you're grateful for each evening. Develop a positive perspective." },
  { title: "Small Steps", tip: "Break big goals into small, achievable steps. Take one step every day." },
  { title: "Learning", tip: "Learn something new every day. Maintain and enhance brain plasticity." },
];

const summary: Record<string, number | string> = {};

async function main() {
  const payload = await getPayload({ config });

  // ---------------------------------------------------------------
  // 1. users — ilk admin
  // ---------------------------------------------------------------
  {
    const { totalDocs } = await payload.count({ collection: "users" });
    if (totalDocs > 0) {
      console.log(`[users] ${totalDocs} kullanıcı mevcut, atlanıyor.`);
      summary.users = "atlandı (mevcut)";
    } else {
      const adminPassword =
        process.env.SEED_ADMIN_PASSWORD ||
        (await import("crypto")).randomBytes(9).toString("base64url");
      await payload.create({
        collection: "users",
        data: {
          email: "kumrukoseler@gmail.com",
          password: adminPassword,
          name: "Kumru Köseler",
        } as any,
      });
      console.log("[users] İlk admin oluşturuldu: kumrukoseler@gmail.com");
      if (!process.env.SEED_ADMIN_PASSWORD) {
        console.log(`[users] Otomatik üretilen panel parolası: ${adminPassword}`);
        console.log("[users] Bu parolayı kaydedin ve ilk girişten sonra panelden değiştirin!");
      }
      summary.users = 1;
    }
  }

  // ---------------------------------------------------------------
  // 2. spiritual-sessions
  // ---------------------------------------------------------------
  {
    const collection = "spiritual-sessions" as const;
    const { totalDocs } = await payload.count({ collection });
    if (totalDocs > 0) {
      console.log(`[${collection}] ${totalDocs} kayıt mevcut, atlanıyor.`);
      summary[collection] = "atlandı (mevcut)";
    } else {
      const trSessions = tr.services.spiritual.sessions as any[];
      const enSessions = en.services.spiritual.sessions as any[];
      let created = 0;
      for (let i = 0; i < trSessions.length; i++) {
        const t = trSessions[i];
        const e = enSessions[i];
        const doc = await payload.create({
          collection,
          locale: "tr",
          data: {
            title: t.title,
            description: t.description,
            duration: t.duration,
            price: t.price, // localized değil, tr değeri
            order: i,
          } as any,
        });
        if (e) {
          await payload.update({
            collection,
            id: doc.id,
            locale: "en",
            data: {
              title: e.title,
              description: e.description,
              duration: e.duration,
            } as any,
          });
        }
        created++;
      }
      console.log(`[${collection}] ${created} kayıt oluşturuldu.`);
      summary[collection] = created;
    }
  }

  // ---------------------------------------------------------------
  // 3. coaching-services
  // ---------------------------------------------------------------
  {
    const collection = "coaching-services" as const;
    const { totalDocs } = await payload.count({ collection });
    if (totalDocs > 0) {
      console.log(`[${collection}] ${totalDocs} kayıt mevcut, atlanıyor.`);
      summary[collection] = "atlandı (mevcut)";
    } else {
      const keys = ["oneOnOne", "online", "messaging", "corporate", "goalTracking", "group"];
      let created = 0;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const t = tr.services.servicesList[key];
        const e = en.services.servicesList[key];
        const doc = await payload.create({
          collection,
          locale: "tr",
          data: {
            key,
            title: t.title,
            shortDesc: t.shortDesc,
            fullDesc: t.fullDesc,
            duration: t.duration,
            features: (t.features as string[]).map((feature) => ({ feature })),
            order: i,
          } as any,
        });
        if (e) {
          await payload.update({
            collection,
            id: doc.id,
            locale: "en",
            data: {
              title: e.title,
              shortDesc: e.shortDesc,
              fullDesc: e.fullDesc,
              duration: e.duration,
              features: (e.features as string[]).map((feature) => ({ feature })),
            } as any,
          });
        }
        created++;
      }
      console.log(`[${collection}] ${created} kayıt oluşturuldu.`);
      summary[collection] = created;
    }
  }

  // ---------------------------------------------------------------
  // 4. programs
  // ---------------------------------------------------------------
  {
    const collection = "programs" as const;
    const { totalDocs } = await payload.count({ collection });
    if (totalDocs > 0) {
      console.log(`[${collection}] ${totalDocs} kayıt mevcut, atlanıyor.`);
      summary[collection] = "atlandı (mevcut)";
    } else {
      const keys = ["oneOnOne", "transformationRetreat", "vipRetreat"];
      let created = 0;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const t = tr.programs.programsList[key];
        const e = en.programs.programsList[key];
        const doc = await payload.create({
          collection,
          locale: "tr",
          data: {
            key,
            title: t.title,
            subtitle: t.subtitle,
            duration: t.duration,
            sessions: t.sessions,
            description: t.description,
            includes: (t.includes as string[]).map((item) => ({ item })),
            popular: key === "transformationRetreat",
            hotelIncluded: key === "transformationRetreat" || key === "vipRetreat",
            order: i,
          } as any,
        });
        if (e) {
          await payload.update({
            collection,
            id: doc.id,
            locale: "en",
            data: {
              title: e.title,
              subtitle: e.subtitle,
              duration: e.duration,
              sessions: e.sessions,
              description: e.description,
              includes: (e.includes as string[]).map((item) => ({ item })),
            } as any,
          });
        }
        created++;
      }
      console.log(`[${collection}] ${created} kayıt oluşturuldu.`);
      summary[collection] = created;
    }
  }

  // ---------------------------------------------------------------
  // 5. events
  // ---------------------------------------------------------------
  {
    const collection = "events" as const;
    const { totalDocs } = await payload.count({ collection });
    if (totalDocs > 0) {
      console.log(`[${collection}] ${totalDocs} kayıt mevcut, atlanıyor.`);
      summary[collection] = "atlandı (mevcut)";
    } else {
      const trEvents = tr.events.eventsList as any[];
      const enEvents = en.events.eventsList as any[];
      let created = 0;
      for (let i = 0; i < trEvents.length; i++) {
        const t = trEvents[i];
        const e = enEvents[i];
        const doc = await payload.create({
          collection,
          locale: "tr",
          data: {
            title: t.title,
            description: t.description,
            dateText: t.date,
            time: t.time, // localized değil, tr değeri
            isPast: true,
            order: i,
          } as any,
        });
        if (e) {
          await payload.update({
            collection,
            id: doc.id,
            locale: "en",
            data: {
              title: e.title,
              description: e.description,
              dateText: e.date,
            } as any,
          });
        }
        created++;
      }
      console.log(`[${collection}] ${created} kayıt oluşturuldu.`);
      summary[collection] = created;
    }
  }

  // ---------------------------------------------------------------
  // 6. faqs
  // ---------------------------------------------------------------
  {
    const collection = "faqs" as const;
    const { totalDocs } = await payload.count({ collection });
    if (totalDocs > 0) {
      console.log(`[${collection}] ${totalDocs} kayıt mevcut, atlanıyor.`);
      summary[collection] = "atlandı (mevcut)";
    } else {
      const trFaq = tr.programs.faq as any[];
      const enFaq = en.programs.faq as any[];
      let created = 0;
      for (let i = 0; i < trFaq.length; i++) {
        const t = trFaq[i];
        const e = enFaq[i];
        const doc = await payload.create({
          collection,
          locale: "tr",
          data: {
            question: t.q,
            answer: t.a,
            order: i,
          } as any,
        });
        if (e) {
          await payload.update({
            collection,
            id: doc.id,
            locale: "en",
            data: {
              question: e.q,
              answer: e.a,
            } as any,
          });
        }
        created++;
      }
      console.log(`[${collection}] ${created} kayıt oluşturuldu.`);
      summary[collection] = created;
    }
  }

  // ---------------------------------------------------------------
  // 7. site-settings global
  // ---------------------------------------------------------------
  {
    const slug = "site-settings" as const;
    const existing = (await payload.findGlobal({ slug, locale: "tr" })) as any;
    if (existing?.email) {
      console.log(`[${slug}] email dolu, atlanıyor.`);
      summary[slug] = "atlandı (mevcut)";
    } else {
      const address = "Akmerkez Residens, Kültür, Nisbetiye Cd, 34100 Beşiktaş/İstanbul";
      await payload.updateGlobal({
        slug,
        locale: "tr",
        data: {
          email: "kumrukoseler@gmail.com",
          phone: "+90 534 367 56 69",
          whatsapp: "905343675669",
          instagram: "https://www.instagram.com/kumrukoseler/",
          youtube: "https://www.youtube.com/@kumrukoseler9055",
          address,
          hours: tr.contact.info.hoursValue,
        } as any,
      });
      await payload.updateGlobal({
        slug,
        locale: "en",
        data: {
          address, // EN adres aynı
          hours: en.contact.info.hoursValue,
        } as any,
      });
      console.log(`[${slug}] güncellendi.`);
      summary[slug] = 1;
    }
  }

  // ---------------------------------------------------------------
  // 8. chatbot global
  // ---------------------------------------------------------------
  {
    const slug = "chatbot" as const;
    const existing = (await payload.findGlobal({ slug })) as any;
    if (existing?.systemPrompt) {
      console.log(`[${slug}] systemPrompt dolu, atlanıyor.`);
      summary[slug] = "atlandı (mevcut)";
    } else {
      await payload.updateGlobal({
        slug,
        data: {
          systemPrompt: CHATBOT_SYSTEM_PROMPT,
        } as any,
      });
      console.log(`[${slug}] systemPrompt yazıldı.`);
      summary[slug] = 1;
    }
  }

  // ---------------------------------------------------------------
  // 9. hero global
  // ---------------------------------------------------------------
  {
    const slug = "hero" as const;
    const existing = (await payload.findGlobal({ slug, locale: "tr" })) as any;
    if (existing?.badge) {
      console.log(`[${slug}] badge dolu, atlanıyor.`);
      summary[slug] = "atlandı (mevcut)";
    } else {
      const t = tr.hero;
      const e = en.hero;
      await payload.updateGlobal({
        slug,
        locale: "tr",
        data: {
          badge: t.badge,
          title1: t.title1,
          title2: t.title2,
          title3: t.title3,
          description: t.description,
          cta1: t.cta1,
          cta2: t.cta2,
          googleReview: t.googleReview,
          stats: {
            clients: t.stats.clients,
            experience: t.stats.experience,
            satisfaction: t.stats.satisfaction,
          },
        } as any,
      });
      await payload.updateGlobal({
        slug,
        locale: "en",
        data: {
          badge: e.badge,
          title1: e.title1,
          title2: e.title2,
          title3: e.title3,
          description: e.description,
          cta1: e.cta1,
          cta2: e.cta2,
          googleReview: e.googleReview,
          stats: {
            clients: e.stats.clients,
            experience: e.stats.experience,
            satisfaction: e.stats.satisfaction,
          },
        } as any,
      });
      console.log(`[${slug}] güncellendi.`);
      summary[slug] = 1;
    }
  }

  // ---------------------------------------------------------------
  // 10. testimonials
  // ---------------------------------------------------------------
  {
    const collection = "testimonials" as const;
    const { totalDocs } = await payload.count({ collection });
    if (totalDocs > 0) {
      console.log(`[${collection}] ${totalDocs} kayıt mevcut, atlanıyor.`);
      summary[collection] = "atlandı (mevcut)";
    } else {
      let created = 0;
      for (let i = 0; i < TESTIMONIALS_TR.length; i++) {
        const t = TESTIMONIALS_TR[i];
        const e = TESTIMONIALS_EN[i];
        const doc = await payload.create({
          collection,
          locale: "tr",
          data: {
            name: t.name, // localized değil
            text: t.text, // localized, tr değeri
            rating: t.rating ?? 5,
            order: i,
          } as any,
        });
        if (e) {
          await payload.update({
            collection,
            id: doc.id,
            locale: "en",
            data: {
              text: e.text, // localized, en değeri
            } as any,
          });
        }
        created++;
      }
      console.log(`[${collection}] ${created} kayıt oluşturuldu.`);
      summary[collection] = created;
    }
  }

  // ---------------------------------------------------------------
  // 11. about global
  // ---------------------------------------------------------------
  {
    const slug = "about" as const;
    const existing = (await payload.findGlobal({ slug, locale: "tr" })) as any;
    if (existing?.storyTitle) {
      console.log(`[${slug}] storyTitle dolu, atlanıyor.`);
      summary[slug] = "atlandı (mevcut)";
    } else {
      // Belirli bir dilin about içeriğini CMS alanlarına eşler.
      // values: grup obje olarak; certifications/timeline: dizi olarak; spiritualApproaches: array-of-{item}.
      const buildAbout = (src: any) => ({
        subtitle: src.subtitle,
        title: src.title,
        name: src.name,
        heroDescription: src.heroDescription,
        heroDescription2: src.heroDescription2,
        appointment: src.appointment,
        mediaButton: src.mediaButton,
        storyTitle: src.storyTitle,
        story1: src.story1,
        story2: src.story2,
        story3: src.story3,
        story4: src.story4,
        valuesTitle: src.valuesTitle,
        valuesDescription: src.valuesDescription,
        values: src.values,
        certificationsTitle: src.certificationsTitle,
        certifications: src.certifications,
        journeyTitle: src.journeyTitle,
        timeline: src.timeline,
        spiritualTitle: src.spiritualTitle,
        spiritual1: src.spiritual1,
        spiritual2: src.spiritual2,
        spiritual3: src.spiritual3,
        spiritualApproaches: (src.spiritualApproaches as string[]).map((s) => ({ item: s })),
        ctaTitle: src.ctaTitle,
        ctaDescription: src.ctaDescription,
        ctaButton: src.ctaButton,
      });
      await payload.updateGlobal({
        slug,
        locale: "tr",
        data: buildAbout(tr.about) as any,
      });
      await payload.updateGlobal({
        slug,
        locale: "en",
        data: buildAbout(en.about) as any,
      });
      console.log(`[${slug}] güncellendi.`);
      summary[slug] = 1;
    }
  }

  // ---------------------------------------------------------------
  // 12. nova-vera global
  // ---------------------------------------------------------------
  {
    const slug = "nova-vera" as const;
    const existing = (await payload.findGlobal({ slug, locale: "tr" })) as any;
    if (existing?.brand) {
      console.log(`[${slug}] brand dolu, atlanıyor.`);
      summary[slug] = "atlandı (mevcut)";
    } else {
      // Belirli bir dilin novaVera içeriğini CMS alanlarına eşler.
      // intro/what/journey/notSession/firstStep → array-of-{text}; includes/outcomes/who → array-of-{item}.
      const buildNovaVera = (src: any) => ({
        brand: src.brand,
        tagline: src.tagline,
        intro: (src.intro as string[]).map((text) => ({ text })),
        introQuestion: src.introQuestion,
        introAnswer: src.introAnswer,
        whatTitle: src.whatTitle,
        what: (src.what as string[]).map((text) => ({ text })),
        whatQuestion: src.whatQuestion,
        journeyTitle: src.journeyTitle,
        journey: (src.journey as string[]).map((text) => ({ text })),
        journeyHighlight: src.journeyHighlight,
        includesTitle: src.includesTitle,
        includesIntro: src.includesIntro,
        includes: (src.includes as string[]).map((item) => ({ item })),
        includesNote: src.includesNote,
        outcomesTitle: src.outcomesTitle,
        outcomes: (src.outcomes as string[]).map((item) => ({ item })),
        outcomesFinal: src.outcomesFinal,
        outcomesNote: src.outcomesNote,
        notSessionTitle: src.notSessionTitle,
        notSession: (src.notSession as string[]).map((text) => ({ text })),
        whoTitle: src.whoTitle,
        whoIntro: src.whoIntro,
        who: (src.who as string[]).map((item) => ({ item })),
        whoOutro: src.whoOutro,
        whoNote: src.whoNote,
        firstStepTitle: src.firstStepTitle,
        firstStep: (src.firstStep as string[]).map((text) => ({ text })),
        quote: src.quote,
        ctaButton: src.ctaButton,
      });
      await payload.updateGlobal({
        slug,
        locale: "tr",
        data: buildNovaVera(tr.novaVera) as any,
      });
      await payload.updateGlobal({
        slug,
        locale: "en",
        data: buildNovaVera(en.novaVera) as any,
      });
      console.log(`[${slug}] güncellendi.`);
      summary[slug] = 1;
    }
  }

  // ---------------------------------------------------------------
  // 13. media-content global
  // ---------------------------------------------------------------
  {
    const slug = "media-content" as const;
    const existing: any = await payload.findGlobal({ slug, locale: "tr" });
    if (existing?.title) {
      console.log(`[${slug}] dolu, atlanıyor.`);
      summary[slug] = "atlandı (mevcut)";
    } else {
      const buildMedia = (src: any) => ({
        subtitle: src.subtitle,
        title: src.title,
        titleHighlight: src.titleHighlight,
        description: src.description,
        featuredTitle: src.featuredTitle,
        mediaItems: {
          magazine: {
            title: src.mediaItems?.magazine?.title,
            subtitle: src.mediaItems?.magazine?.subtitle,
            date: src.mediaItems?.magazine?.date,
            description: src.mediaItems?.magazine?.description,
          },
          award: {
            title: src.mediaItems?.award?.title,
            subtitle: src.mediaItems?.award?.subtitle,
            date: src.mediaItems?.award?.date,
            description: src.mediaItems?.award?.description,
          },
        },
        quotesTitle: src.quotesTitle,
        quotes: (src.quotes ?? []).map((q: any) => ({ quote: q.quote, source: q.source })),
        awardsTitle: src.awardsTitle,
        awards: (src.awards ?? []).map((a: any) => ({ title: a.title, organization: a.organization, year: a.year })),
        instagramTitle: src.instagramTitle,
        instagramDescription: src.instagramDescription,
        followInstagram: src.followInstagram,
        ctaTitle: src.ctaTitle,
        ctaDescription: src.ctaDescription,
        ctaButton: src.ctaButton,
      });
      await payload.updateGlobal({ slug, locale: "tr", data: buildMedia(tr.media) as any });
      await payload.updateGlobal({ slug, locale: "en", data: buildMedia(en.media) as any });
      console.log(`[${slug}] güncellendi.`);
      summary[slug] = 1;
    }
  }

  // ---------------------------------------------------------------
  // 14. resource-items
  // ---------------------------------------------------------------
  {
    const collection = "resource-items" as const;
    const { totalDocs } = await payload.count({ collection });
    if (totalDocs > 0) {
      console.log(`[${collection}] ${totalDocs} kayıt mevcut, atlanıyor.`);
      summary[collection] = "atlandı (mevcut)";
    } else {
      let created = 0;
      for (let i = 0; i < RESOURCES_TR.length; i++) {
        const t = RESOURCES_TR[i];
        const e = RESOURCES_EN[i];
        const doc = await payload.create({
          collection,
          locale: "tr",
          data: {
            title: t.title,
            description: t.description,
            type: t.type, // localized değil, tr değeri
            category: t.category,
            order: i,
          } as any,
        });
        if (e) {
          await payload.update({
            collection,
            id: doc.id,
            locale: "en",
            data: {
              title: e.title,
              description: e.description,
              category: e.category,
            } as any,
          });
        }
        created++;
      }
      console.log(`[${collection}] ${created} kayıt oluşturuldu.`);
      summary[collection] = created;
    }
  }

  // ---------------------------------------------------------------
  // 15. blog-posts
  // ---------------------------------------------------------------
  {
    const collection = "blog-posts" as const;
    const { totalDocs } = await payload.count({ collection });
    if (totalDocs > 0) {
      console.log(`[${collection}] ${totalDocs} kayıt mevcut, atlanıyor.`);
      summary[collection] = "atlandı (mevcut)";
    } else {
      let created = 0;
      for (let i = 0; i < BLOG_POSTS_TR.length; i++) {
        const t = BLOG_POSTS_TR[i];
        const e = BLOG_POSTS_EN[i];
        const doc = await payload.create({
          collection,
          locale: "tr",
          data: {
            title: t.title,
            excerpt: t.excerpt,
            category: t.category,
            readTime: t.readTime,
            order: i,
          } as any,
        });
        if (e) {
          await payload.update({
            collection,
            id: doc.id,
            locale: "en",
            data: {
              title: e.title,
              excerpt: e.excerpt,
              category: e.category,
              readTime: e.readTime,
            } as any,
          });
        }
        created++;
      }
      console.log(`[${collection}] ${created} kayıt oluşturuldu.`);
      summary[collection] = created;
    }
  }

  // ---------------------------------------------------------------
  // 16. tips
  // ---------------------------------------------------------------
  {
    const collection = "tips" as const;
    const { totalDocs } = await payload.count({ collection });
    if (totalDocs > 0) {
      console.log(`[${collection}] ${totalDocs} kayıt mevcut, atlanıyor.`);
      summary[collection] = "atlandı (mevcut)";
    } else {
      let created = 0;
      for (let i = 0; i < TIPS_TR.length; i++) {
        const t = TIPS_TR[i];
        const e = TIPS_EN[i];
        const doc = await payload.create({
          collection,
          locale: "tr",
          data: {
            title: t.title,
            tip: t.tip,
            order: i,
          } as any,
        });
        if (e) {
          await payload.update({
            collection,
            id: doc.id,
            locale: "en",
            data: {
              title: e.title,
              tip: e.tip,
            } as any,
          });
        }
        created++;
      }
      console.log(`[${collection}] ${created} kayıt oluşturuldu.`);
      summary[collection] = created;
    }
  }

  // ---------------------------------------------------------------
  // 17. Görseller — /public dosyalarını medya kütüphanesine yükle + bağla
  // ---------------------------------------------------------------
  {
    const publicDir = path.resolve(dirname, "../public");
    const uploadOnce = async (rel: string, alt: string): Promise<number | null> => {
      const filePath = path.resolve(publicDir, rel);
      if (!fs.existsSync(filePath)) {
        console.log(`[media] dosya yok, atlanıyor: ${rel}`);
        return null;
      }
      const base = path.basename(rel);
      const existing = await payload.find({
        collection: "media",
        where: { filename: { equals: base } },
        limit: 1,
      });
      if (existing.docs.length > 0) return existing.docs[0].id as number;
      const created = await payload.create({
        collection: "media",
        filePath,
        data: { alt } as any,
      });
      return created.id as number;
    };

    // Tüm görselleri yükle
    const img = {
      logo: await uploadOnce("logo.png", "Kumru Köseler logo"),
      logoWhite: await uploadOnce("logo-white.png", "Kumru Köseler logo (beyaz)"),
      favicon: await uploadOnce("favicon.png", "Favicon"),
      profile: await uploadOnce("profile.jpg", "Kumru Köseler"),
      servicesBg: await uploadOnce("hizmetler-bg.jpg", "Hizmetler arka plan"),
      mediaBg: await uploadOnce("medya-bg.jpg", "Medya arka plan"),
      programsBg: await uploadOnce("programlar-bg.jpg", "Programlar arka plan"),
      resourcesBg: await uploadOnce("kaynaklar-bg.jpg", "Kaynaklar arka plan"),
      contactBg: await uploadOnce("iletisim-bg.jpg", "İletişim arka plan"),
      magazine: await uploadOnce("magazine-cover.jpg", "Dergi kapağı"),
      award: await uploadOnce("odul-toreni.jpg", "Ödül töreni"),
    };
    const instaIds: (number | null)[] = [];
    for (let i = 1; i <= 6; i++) {
      instaIds.push(await uploadOnce(`instagram/post${i}.jpg`, `Instagram gönderi ${i}`));
    }

    // site-settings — logolar (yalnızca boşsa)
    const ss: any = await payload.findGlobal({ slug: "site-settings" });
    if (!ss?.logo && (img.logo || img.logoWhite || img.favicon)) {
      await payload.updateGlobal({
        slug: "site-settings",
        data: { logo: img.logo, logoWhite: img.logoWhite, favicon: img.favicon } as any,
      });
      console.log("[site-settings] logolar bağlandı.");
    }

    // page-images — arka planlar (boşsa)
    const pi: any = await payload.findGlobal({ slug: "page-images" });
    if (!pi?.servicesBg) {
      await payload.updateGlobal({
        slug: "page-images",
        data: {
          servicesBg: img.servicesBg,
          mediaBg: img.mediaBg,
          programsBg: img.programsBg,
          resourcesBg: img.resourcesBg,
          contactBg: img.contactBg,
          novaVeraBg: img.resourcesBg,
        } as any,
      });
      console.log("[page-images] arka planlar bağlandı.");
    }
    summary["page-images"] = 1;

    // about — profil fotoğrafı (boşsa)
    const ab: any = await payload.findGlobal({ slug: "about" });
    if (!ab?.profileImage && img.profile) {
      await payload.updateGlobal({ slug: "about", data: { profileImage: img.profile } as any });
      console.log("[about] profil fotoğrafı bağlandı.");
    }

    // media-content — dergi/ödül görselleri + instagram (boşsa)
    const mc: any = await payload.findGlobal({ slug: "media-content" });
    if (!mc?.mediaItems?.magazine?.image) {
      await payload.updateGlobal({
        slug: "media-content",
        data: {
          mediaItems: {
            magazine: { image: img.magazine },
            award: { image: img.award },
          },
          instagramPosts: instaIds
            .filter(Boolean)
            .map((id) => ({ image: id, link: "https://www.instagram.com/kumrukoseler/" })),
        } as any,
      });
      console.log("[media-content] görseller + instagram bağlandı.");
    }
    summary["görseller"] = "yüklendi";
  }

  // ---------------------------------------------------------------
  // Özet
  // ---------------------------------------------------------------
  console.log("\n========== SEED ÖZETİ ==========");
  for (const [key, value] of Object.entries(summary)) {
    console.log(`  ${key}: ${typeof value === "number" ? `${value} kayıt` : value}`);
  }
  console.log("================================\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("Seed hatası:", err);
  process.exit(1);
});
