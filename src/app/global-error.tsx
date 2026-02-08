"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          padding: "20px",
          textAlign: "center"
        }}>
          <h2 style={{ marginBottom: "20px", color: "#333" }}>
            Bir hata oluştu
          </h2>
          <button
            onClick={() => reset()}
            style={{
              padding: "12px 24px",
              backgroundColor: "#5b21b6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  );
}
