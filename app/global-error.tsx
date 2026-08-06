"use client";

/** Last-resort boundary for failures in the root layout itself. It replaces
 *  the whole document, so it has to supply its own <html> and <body> — and it
 *  cannot rely on the app's fonts or CSS having loaded. Styles are inline for
 *  that reason. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#0c1410",
          color: "#f4f1e6",
          fontFamily: "system-ui, sans-serif",
          padding: "1.25rem",
        }}
      >
        <main style={{ maxWidth: "26rem", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: 400,
              fontSize: "1.75rem",
              margin: 0,
            }}
          >
            Something wilted
          </h1>
          <p style={{ color: "#a3bdac", lineHeight: 1.6, fontSize: ".9rem" }}>
            Leafora failed to start. Reloading usually clears it.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: ".75rem 1.5rem",
              borderRadius: "999px",
              border: "none",
              background: "#f4f1e6",
              color: "#131f19",
              fontSize: ".875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: "1.5rem", fontSize: ".7rem", color: "#7e9c88" }}>
              Reference: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
