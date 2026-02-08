import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="gradient-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <img
                src="/logo-footer.png"
                alt="Kumru Köseler - Grow Bold, Every Day"
                className="h-20 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-[var(--lavender)] leading-relaxed">
              Profesyonel yaşam koçluğu ile hayatınızı dönüştürün.
              Birlikte hedeflerinize ulaşalım.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Hızlı Bağlantılar</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/hakkimda" className="text-[var(--lavender)] hover:text-white transition-colors">
                  Hakkımda
                </Link>
              </li>
              <li>
                <Link href="/hizmetler" className="text-[var(--lavender)] hover:text-white transition-colors">
                  Hizmetler
                </Link>
              </li>
              <li>
                <Link href="/programlar" className="text-[var(--lavender)] hover:text-white transition-colors">
                  Programlar
                </Link>
              </li>
              <li>
                <Link href="/medya" className="text-[var(--lavender)] hover:text-white transition-colors">
                  Medya
                </Link>
              </li>
              <li>
                <Link href="/kaynaklar" className="text-[var(--lavender)] hover:text-white transition-colors">
                  Kaynaklar
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-[var(--lavender)] hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">İletişim</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[var(--violet)]" />
                <a href="mailto:kumrukoseler@gmail.com" className="text-[var(--lavender)] hover:text-white transition-colors">
                  kumrukoseler@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[var(--violet)]" />
                <a href="tel:+905343675669" className="text-[var(--lavender)] hover:text-white transition-colors">
                  +90 534 367 56 69
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[var(--violet)] mt-1" />
                <span className="text-[var(--lavender)]">
                  Akmerkez Residens, Kültür,<br />
                  Nisbetiye Cd, 34100<br />
                  Beşiktaş/İstanbul
                </span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Sosyal Medya</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/kumrukoseler/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--indigo)] transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.youtube.com/@kumrukoseler9055"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--indigo)] transition-colors"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--lavender)] text-sm">
            © {new Date().getFullYear()} Kumru Köseler. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/gizlilik" className="text-[var(--lavender)] hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/kullanim-sartlari" className="text-[var(--lavender)] hover:text-white transition-colors">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
