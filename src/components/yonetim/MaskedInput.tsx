"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { cn } from "@/lib/utils";

type MaskedInputProps = {
  id?: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
};

/**
 * Gizli anahtar girişi: varsayılan olarak type=password (maskeli),
 * "Göster / Gizle" düğmesiyle geçici olarak açığa çıkarılabilir.
 */
export default function MaskedInput({
  id,
  name,
  defaultValue,
  placeholder,
  autoComplete = "off",
  className,
}: MaskedInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Lock className="size-4" />
      </span>
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        spellCheck={false}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-24 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {visible ? (
          <>
            <EyeOff className="size-3.5" /> Gizle
          </>
        ) : (
          <>
            <Eye className="size-3.5" /> Göster
          </>
        )}
      </button>
    </div>
  );
}
