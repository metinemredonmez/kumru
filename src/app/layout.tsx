import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kumru Köseler | Yaşam Koçu - Kişisel Dönüşüm & Gelişim",
  description: "Profesyonel yaşam koçluğu ile hayatınızı dönüştürün. Birebir seanslar, kişisel gelişim programları ve online eğitimlerle hedeflerinize ulaşın.",
  keywords: ["yaşam koçu", "life coach", "kişisel gelişim", "koçluk", "wellness", "Kumru Köseler"],
  authors: [{ name: "Kumru Köseler" }],
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Kumru Köseler | Yaşam Koçu",
    description: "Profesyonel yaşam koçluğu ile hayatınızı dönüştürün.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body
        className={`${plusJakarta.variable} ${caveat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
