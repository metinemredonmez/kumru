"use client";

import { useEffect } from "react";
import { useNav } from "@payloadcms/ui";

/**
 * Geniş ekranlarda sol menüyü HER ZAMAN açık tutar.
 * Payload'ın kendi durumu (setNavOpen) üzerinden çalışır — bu yüzden
 * tıklama bozulmaz. Menü herhangi bir sebeple kapanırsa tekrar açar.
 * Kapatma butonu ayrıca CSS ile masaüstünde gizlenir.
 */
export const NavOpener = () => {
  const nav = useNav();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // innerWidth 0/bilinmiyorsa masaüstü varsay; yalnızca gerçek dar ekranda açma
    if (window.innerWidth && window.innerWidth < 768) return;
    if (nav && typeof nav.setNavOpen === "function" && !nav.navOpen) {
      nav.setNavOpen(true);
    }
  }, [nav, nav?.hydrated, nav?.navOpen]);

  return null;
};

export default NavOpener;
