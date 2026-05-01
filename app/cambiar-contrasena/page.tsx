"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function checkPassword(p: string) {
  return {
    length:  p.length >= 8,
    upper:   /[A-Z]/.test(p),
    lower:   /[a-z]/.test(p),
    special: /[^A-Za-z0-9]/.test(p),
  };
}

export default function CambiarContrasenaPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const forzado      = searchParams.get("forzado") === "true";

  const [nueva,    setNueva]    = useState("");
  const [confirma, setConfirma] = useState("");
  const [showN,    setShowN]    = useState(false);
  const [showC,    setShowC]    = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const checks   = checkPassword(nueva);
  const allOk    = Object.values(checks).every(Boolean);
  const match    = nueva === confirma && confirma.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allOk)          { setError("La contraseña no cumple los requisitos."); return; }
    if (!match)          { setError("Las contraseñas no coinciden."); return; }

    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/cambiar-contrasena", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ nueva_contrasena: nueva }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Error al cambiar la contraseña."); return; }
      router.push(json.redirect ?? "/login");
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-surface-container-low dark:bg-slate-950 font-public-sans">
      <div className="w-full max-w-[440px]">

        {/* Header */}
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="CBT Núm. 5" className="w-14 h-14 mx-auto mb-3 object-contain" />
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">
            {forzado ? "Crea tu contraseña" : "Cambiar contraseña"}
          </h1>
          {forzado && (
            <p className="font-body-sm text-body-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 mt-3">
              🔐 Por seguridad debes crear una contraseña personal antes de continuar.
            </p>
          )}
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.06)] p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Nueva contraseña */}
            <div className="flex flex-col gap-1">
              <label htmlFor="nueva" className="font-label-bold text-label-bold text-on-surface">
                Nueva contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </div>
                <input
                  id="nueva"
                  type={showN ? "text" : "password"}
                  value={nueva}
                  onChange={(e) => setNueva(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  className={`w-full pl-10 pr-10 py-2 bg-white dark:bg-slate-800 border rounded-lg font-body-base text-body-base text-on-surface focus:outline-none focus:ring-1 transition-colors placeholder:text-outline-variant ${
                    nueva.length > 0 && !allOk
                      ? "border-amber-400 focus:border-amber-500 focus:ring-amber-400"
                      : nueva.length > 0 && allOk
                      ? "border-green-500 focus:border-green-500 focus:ring-green-400"
                      : "border-outline-variant focus:border-primary focus:ring-primary"
                  }`}
                />
                <button type="button" onClick={() => setShowN(v => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    {showN
                      ? <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      : <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    }
                  </svg>
                </button>
              </div>

              {/* Requisitos — aquí SÍ tiene sentido mostrarlos */}
              {nueva.length > 0 && (
                <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low dark:bg-slate-800/50 px-3 py-2.5 mt-1">
                  <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {([
                      [checks.length,  "Mínimo 8 caracteres"],
                      [checks.upper,   "Una mayúscula (A-Z)"],
                      [checks.lower,   "Una minúscula (a-z)"],
                      [checks.special, "Un carácter especial"],
                    ] as [boolean, string][]).map(([ok, label]) => (
                      <li key={label} className={`flex items-center gap-1 text-xs ${ok ? "text-green-700 dark:text-green-400" : "text-on-surface-variant"}`}>
                        {ok
                          ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                          : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0 text-outline-variant"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        }
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="flex flex-col gap-1">
              <label htmlFor="confirma" className="font-label-bold text-label-bold text-on-surface">
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </div>
                <input
                  id="confirma"
                  type={showC ? "text" : "password"}
                  value={confirma}
                  onChange={(e) => setConfirma(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Repite la contraseña"
                  className={`w-full pl-10 pr-10 py-2 bg-white dark:bg-slate-800 border rounded-lg font-body-base text-body-base text-on-surface focus:outline-none focus:ring-1 transition-colors placeholder:text-outline-variant ${
                    confirma.length > 0 && !match
                      ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                      : confirma.length > 0 && match
                      ? "border-green-500 focus:border-green-500 focus:ring-green-400"
                      : "border-outline-variant focus:border-primary focus:ring-primary"
                  }`}
                />
                <button type="button" onClick={() => setShowC(v => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    {showC
                      ? <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      : <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    }
                  </svg>
                </button>
              </div>
              {confirma.length > 0 && !match && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">Las contraseñas no coinciden</p>
              )}
              {confirma.length > 0 && match && (
                <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">✓ Las contraseñas coinciden</p>
              )}
            </div>

            {/* Error global */}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !allOk || !match}
              className="w-full mt-1 bg-primary text-white font-label-bold text-label-bold py-3 px-4 rounded-lg shadow-sm hover:shadow-md hover:bg-on-primary-fixed-variant transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  {forzado ? "Crear contraseña y continuar" : "Actualizar contraseña"}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}
