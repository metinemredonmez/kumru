"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
          Gizlilik Politikası
        </h1>

        <div className="prose prose-lg max-w-none text-[var(--text-body)]">
          <p className="text-sm text-[var(--text-muted)] mb-8">
            Son güncelleme: {new Date().toLocaleDateString("tr-TR")}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              1. Giriş
            </h2>
            <p>
              Kumru Köseler ("biz", "bizim" veya "Şirket") olarak, gizliliğinize saygı duyuyor
              ve kişisel verilerinizi korumayı taahhüt ediyoruz. Bu Gizlilik Politikası,
              web sitemizi (kumrukoseler.com) ziyaret ettiğinizde veya hizmetlerimizi
              kullandığınızda kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve
              koruduğumuzu açıklamaktadır.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              2. Topladığımız Bilgiler
            </h2>
            <p className="mb-4">Aşağıdaki türde kişisel bilgileri toplayabiliriz:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Kimlik Bilgileri:</strong> Ad, soyad
              </li>
              <li>
                <strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası
              </li>
              <li>
                <strong>Teknik Bilgiler:</strong> IP adresi, tarayıcı türü, cihaz bilgileri
              </li>
              <li>
                <strong>Kullanım Bilgileri:</strong> Web sitemizi nasıl kullandığınıza dair bilgiler
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              3. Bilgilerin Kullanım Amacı
            </h2>
            <p className="mb-4">Kişisel bilgilerinizi aşağıdaki amaçlarla kullanıyoruz:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Hizmetlerimizi sunmak ve yönetmek</li>
              <li>Sizinle iletişim kurmak ve sorularınızı yanıtlamak</li>
              <li>Randevu ve seans planlaması yapmak</li>
              <li>Hizmetlerimizi geliştirmek</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              4. Bilgilerin Paylaşımı
            </h2>
            <p>
              Kişisel bilgilerinizi üçüncü taraflarla satmıyor veya kiralamıyoruz.
              Bilgilerinizi yalnızca aşağıdaki durumlarda paylaşabiliriz:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Yasal zorunluluk durumlarında</li>
              <li>Açık rızanızla</li>
              <li>Hizmet sağlayıcılarımızla (gizlilik sözleşmesi kapsamında)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              5. Çerezler (Cookies)
            </h2>
            <p>
              Web sitemiz, deneyiminizi iyileştirmek için çerezler kullanmaktadır.
              Çerezler, tarayıcınıza yerleştirilen küçük metin dosyalarıdır. Tarayıcı
              ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bu durumda
              bazı site özellikleri düzgün çalışmayabilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              6. Veri Güvenliği
            </h2>
            <p>
              Kişisel verilerinizi korumak için uygun teknik ve organizasyonel önlemler
              alıyoruz. Ancak, internet üzerinden yapılan hiçbir veri iletiminin %100
              güvenli olmadığını hatırlatmak isteriz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              7. Haklarınız
            </h2>
            <p className="mb-4">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>Kişisel verileriniz hakkında bilgi talep etme</li>
              <li>Kişisel verilerinizin düzeltilmesini isteme</li>
              <li>Kişisel verilerinizin silinmesini talep etme</li>
              <li>Verilerinizin işlenmesine itiraz etme</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              8. Gizlilik Danışmanı İletişim
            </h2>
            <p>
              Kişisel verilerinize yönelik taleplerinizi bildirmek için Kumru Köseler ile
              iletişime geçebilirsiniz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              9. İletişim
            </h2>
            <p>
              Bu Gizlilik Politikası hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
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

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--dark)] mb-4">
              10. Değişiklikler
            </h2>
            <p>
              Bu Gizlilik Politikası'nı zaman zaman güncelleyebiliriz. Değişiklikler
              bu sayfada yayınlandığı anda yürürlüğe girer. Politikayı düzenli olarak
              gözden geçirmenizi öneririz.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
