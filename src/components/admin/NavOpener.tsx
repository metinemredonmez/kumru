"use client";

import { useEffect } from "react";
import { useNav } from "@payloadcms/ui";

/**
 * Geniş ekranlarda sol menüyü Payload'ın kendi durumu üzerinden açık başlatır.
 * Yalnızca ilk yüklemede açar; kullanıcı sonra kapatabilir. Header action.
 */
export const NavOpener = () => {
  const nav = useNav();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;
    if (nav && typeof nav.setNavOpen === "function" && !nav.navOpen) {
      nav.setNavOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default NavOpener;
