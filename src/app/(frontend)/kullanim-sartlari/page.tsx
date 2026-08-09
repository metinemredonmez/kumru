"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--indigo)] hover:text-[var(--purple)] mb-8"
        >
          <ArrowLeft size={20} />
          Ana Sayfaya Dön
        </Link>

        <h1 className="text-4xl font-bold text-[var(--dark)] mb-8">
          Kullanım Şartları
        </h1>

        <div className="prose prose-lg max-w-none text-[var(--text-body)]">
          <p className="text-sm text-[var(--text-muted)] mb-8">
            Son güncelleme: {new Date().toLocaleDateString("tr-TR")}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              1. Kabul ve Onay
            </h2>
            <p>
              Bu web sitesini (kumrukoseler.com) kullanarak, bu Kullanım Şartları'nı
              okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz.
              Bu şartları kabul etmiyorsanız, lütfen sitemizi kullanmayınız.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              2. Hizmet Tanımı
            </h2>
            <p>
              Kumru Köseler, profesyonel yaşam koçluğu hizmetleri sunmaktadır.
              Hizmetlerimiz şunları içerir:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Birebir koçluk seansları</li>
              <li>Kişisel gelişim programları</li>
              <li>Online ve yüz yüze danışmanlık</li>
              <li>Grup çalışmaları ve atölyeler</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              3. Hizmet Koşulları
            </h2>
            <h3 className="text-xl font-semibold text-[var(--dark)] mb-2 mt-4">
              3.1 Randevu ve İptal
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Randevular önceden belirlenen zamanlarda gerçekleştirilir.</li>
              <li>
                İptal veya erteleme talepleri en az 24 saat öncesinden bildirilmelidir.
              </li>
              <li>
                24 saatten kısa sürede yapılan iptallerde seans ücreti iade edilmez.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[var(--dark)] mb-2 mt-4">
              3.2 Ödeme
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ödemeler seans öncesinde veya paket satın alımında yapılır.</li>
              <li>Kabul edilen ödeme yöntemleri ayrıca bildirilir.</li>
              <li>Fiyatlar önceden haber verilmeksizin değiştirilebilir.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              4. Gizlilik ve Sır Saklama
            </h2>
            <p>
              Koçluk seanslarında paylaşılan tüm bilgiler gizlidir. Danışan bilgileri,
              yasal zorunluluk halleri dışında üçüncü kişilerle paylaşılmaz. Danışanın
              kendisine veya başkalarına zarar verme riski olduğu durumlarda gizlilik
              ilkesi uygulanmayabilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              5. Sorumluluk Sınırı
            </h2>
            <p className="mb-4">
              Yaşam koçluğu hizmetleri, psikoterapi veya psikolojik tedavi değildir.
              Koçluk, kişisel gelişim ve hedef odaklı bir süreçtir.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Koçluk seansları tıbbi, psikolojik veya psikiyatrik tedavi yerine geçmez.
              </li>
              <li>
                Danışanlar, kendi kararlarından ve eylemlerinden sorumludur.
              </li>
              <li>
                Sonuçlar kişiden kişiye değişebilir ve garanti edilemez.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              6. Fikri Mülkiyet
            </h2>
            <p>
              Bu web sitesindeki tüm içerikler (metinler, görseller, logolar, videolar)
              Kumru Köseler'in fikri mülkiyetidir. İzinsiz kopyalama, dağıtma veya
              kullanma yasaktır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              7. Kullanıcı Yükümlülükleri
            </h2>
            <p className="mb-4">Web sitemizi kullanırken aşağıdaki kurallara uymanız gerekmektedir:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Doğru ve güncel bilgi sağlamak</li>
              <li>Başkalarının haklarına saygı göstermek</li>
              <li>Yasalara aykırı faaliyetlerde bulunmamak</li>
              <li>Siteye zarar verebilecek eylemlerden kaçınmak</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              8. Değişiklikler
            </h2>
            <p>
              Bu Kullanım Şartları'nı herhangi bir zamanda değiştirme hakkını saklı
              tutarız. Değişiklikler bu sayfada yayınlandığı anda yürürlüğe girer.
              Siteyi kullanmaya devam etmeniz, güncellenmiş şartları kabul ettiğiniz
              anlamına gelir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              9. Uygulanacak Hukuk
            </h2>
            <p>
              Bu Kullanım Şartları, Türkiye Cumhuriyeti yasalarına tabidir. Herhangi
              bir uyuşmazlık durumunda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              10. İletişim
            </h2>
            <p>
              Bu Kullanım Şartları hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
            </p>
            <ul className="list-none mt-4 space-y-2">
              <li>
                <strong>E-posta:</strong> kumrukoseler@gmail.com
              </li>
              <li>
                <strong>Adres:</strong> Akmerkez Residens, Kültür, Nisbetiye Cd, 34100 Beşiktaş/İstanbul
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
