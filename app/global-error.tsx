"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error global capturado:", error);
  }, [error]);

  return (
    <html lang="es">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-on-background mb-2">
              Error del servidor
            </h1>
            <p className="text-on-surface-variant mb-6">
              Ha ocurrido un error crítico. Por favor, recarga la página.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary/90 transition-colors"
              aria-label="Recargar página"
            >
              Recargar página
            </button>
            {process.env.NODE_ENV === "development" && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-on-surface-variant">
                  Detalles del error (desarrollo)
                </summary>
                <pre className="mt-2 p-3 bg-surface-container rounded-lg text-xs text-error overflow-auto">
                  {error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
