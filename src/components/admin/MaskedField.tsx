"use client";

import React, { useState } from "react";
import { useField, FieldLabel } from "@payloadcms/ui";

/**
 * Gizli API anahtarları için maskeli giriş alanı.
 * Değer varsayılan olarak nokta (•) ile gizlenir; "Göster" ile açılır.
 * Payload custom field component — admin.components.Field ile bağlanır.
 */
export const MaskedField: React.FC<{ path?: string; field?: { label?: string; admin?: { description?: string } } }> = (props) => {
  const path = props?.path ?? "";
  const { value, setValue } = useField<string>({ path });
  const [show, setShow] = useState(false);
  const label = (props?.field?.label as string) || path;
  const description = props?.field?.admin?.description;

  return (
    <div className="field-type text" style={{ marginBottom: 20 }}>
      <FieldLabel label={label} path={path} />
      <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
        <input
          type={show ? "text" : "password"}
          value={(value as string) || ""}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="••••••••••••"
          style={{ flex: 1 }}
        />
        <button
          type="button"
          className="btn btn--style-secondary btn--size-small"
          onClick={() => setShow((s) => !s)}
          style={{ margin: 0, whiteSpace: "nowrap" }}
        >
          {show ? "Gizle" : "Göster"}
        </button>
      </div>
      {description ? (
        <div className="field-description" style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>{description}</div>
      ) : null}
    </div>
  );
};

export default MaskedField;
