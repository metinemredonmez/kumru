import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // iyzipay, çalışma zamanında dinamik require ile alt modüllerini yükler.
  // Turbopack bunu paketleyemiyor; harici (external) CommonJS paketi olarak bırak.
  serverExternalPackages: ["iyzipay"],
  // /admin (eski Payload paneli anasayfası) → yeni modern panel /yonetim'e yönlendir.
  // Sadece TAM "/admin" eşleşir; /admin/login, /admin/logout, /admin/collections/* (yedek) çalışır.
  async redirects() {
    return [
      { source: "/admin", destination: "/yonetim", permanent: false },
    ];
  },
};

export default withPayload(nextConfig);
