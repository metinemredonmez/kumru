"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Basit istemci taraflı CSV indirme butonu.
 * Sayfadaki özet verilerden (satır dizileri) bir CSV üretip Blob ile indirir.
 */
export default function CsvExportButton({
  filename = "rapor.csv",
  rows,
  label = "CSV indir",
}: {
  filename?: string;
  /** Her satır bir hücre dizisi. İlk satır başlık olabilir. */
  rows: (string | number | null | undefined)[][];
  label?: string;
}) {
  const handleDownload = () => {
    const escapeCell = (cell: string | number | null | undefined) => {
      const s = cell == null ? "" : String(cell);
      // Çift tırnak, virgül, satır sonu içeren hücreleri tırnakla
      if (/[",\n\r]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const csv = rows.map((r) => r.map(escapeCell).join(",")).join("\r\n");
    // UTF-8 BOM: Excel'de Türkçe karakterler doğru görünsün
    const blob = new Blob(["﻿" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleDownload}>
      <Download />
      {label}
    </Button>
  );
}
