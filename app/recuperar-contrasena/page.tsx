"use client";

import { useState } from "react";
import Link from "next/link";

type Step = "identificacion" | "enviado";

// Indicador de progreso
const steps = ["Identificación", "Listo"];

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < current
                  ? "bg-primary text-white"
                  : i === current
                  ? "bg-primary text-white ring-4 ring-primary/20"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {i < current ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span className={`text-[10px] font-bold tracking-wide whitespace-nowrap ${i === current ? "text-primary" : "text-on-surface-variant"}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-4 transition-colors ${i < current ? "bg-primary" : "bg-outline-variant"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function RecuperarContrasenaPage() {
  const [step, setStep] = useState<Step>("identificacion");
  const [identificador, setIdentificador] = useState("");
  const [tipoId, setTipoId] = useState<"matricula" | "correo">("matricula");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const stepIndex = step === "identificacion" ? 0 : 1;

  async function handleIdentificacion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identificador.trim() }),
      });
      // Siempre mostrar "enviado" — nunca revelar si el email/matrícula existe (OWASP A07)
      setStep("enviado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-surface-container-low font-public-sans">

      {/* Brand header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo CBT Núm. 5" className="w-16 h-16 object-contain" />
        </div>
        <h2 className="font-title-sm text-title-sm text-primary tracking-tight">CBT Núm. 5 Chalco</h2>
      </div>

      {/* Card */}
      <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-10 pt-10 pb-0">
          <ProgressBar current={stepIndex} />
        </div>

        {/* ── PASO 1: Identificación ── */}
        {step === "identificacion" && (
          <>
            <div className="px-10 pb-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Recuperar contraseña</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Ingresa tu matrícula o correo electrónico registrado.
              </p>
            </div>

            <div className="px-10 pb-10">
              <form onSubmit={handleIdentificacion} className="flex flex-col gap-4">

                {/* Toggle matrícula / correo */}
                <div className="bg-surface-container rounded-lg p-1 flex gap-1 border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setTipoId("matricula")}
                    className={`flex-1 py-1.5 rounded text-xs font-bold tracking-wide transition-all ${
                      tipoId === "matricula"
                        ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-outline-variant/50"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Matrícula
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoId("correo")}
                    className={`flex-1 py-1.5 rounded text-xs font-bold tracking-wide transition-all ${
                      tipoId === "correo"
                        ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-outline-variant/50"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Correo electrónico
                  </button>
                </div>

                {/* Input dinámico */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="identificador" className="font-label-bold text-label-bold text-on-surface">
                    {tipoId === "matricula" ? "Matrícula" : "Correo electrónico"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                      {tipoId === "matricula" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25S9.75 10.24 9.75 9 10.76 6.75 12 6.75zM17 17H7v-.75c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V17z"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                      )}
                    </div>
                    <input
                      id="identificador"
                      name="identificador"
                      type={tipoId === "correo" ? "email" : "text"}
                      required
                      autoComplete={tipoId === "correo" ? "email" : "username"}
                      placeholder={tipoId === "matricula" ? "Ej. 192039402" : "Ej. nombre@correo.com"}
                      value={identificador}
                      onChange={(e) => setIdentificador(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-outline-variant rounded-lg font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline-variant"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  <p className="font-body-sm text-body-sm text-blue-700 dark:text-blue-300">
                    Si no recuerdas tu matrícula ni tienes correo registrado, acude a Control Escolar.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 bg-primary text-white font-label-bold text-label-bold py-3 px-4 rounded-lg shadow-sm hover:shadow-md hover:bg-on-primary-fixed-variant disabled:opacity-50 transition-all flex justify-center items-center gap-2 group"
                >
                  {loading ? "Enviando..." : "Continuar"}
                  {!loading && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </>
        )}

        {/* ── PASO 2: Enviado ── */}
        {step === "enviado" && (
          <div className="px-10 py-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-950/40 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-600 dark:text-green-400">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Identidad confirmada</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Hemos enviado las instrucciones para restablecer tu contraseña a tu correo registrado.
              </p>
            </div>
            <div className="w-full bg-surface-container rounded-lg px-4 py-3 text-left">
              <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wide mb-1.5">¿No llegó el correo?</p>
              <ul className="font-body-sm text-body-sm text-on-surface-variant space-y-1 list-disc pl-4">
                <li>Revisa tu carpeta de spam o no deseado</li>
                <li>Espera unos minutos antes de reintentar</li>
                <li>Si el problema persiste, acude a Control Escolar</li>
              </ul>
            </div>
            <button
              onClick={() => { setStep("identificacion"); setIdentificador(""); }}
              className="font-body-sm text-body-sm text-primary hover:underline transition-colors"
            >
              Intentar con otra cuenta
            </button>
          </div>
        )}

        {/* Footer del card */}
        <div className="bg-surface-container-low px-10 py-4 border-t border-outline-variant/50 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            ¿Sigues sin acceso?{" "}
            <Link href="/contacto" className="text-primary font-medium hover:underline">
              Contactar a soporte
            </Link>
          </p>
        </div>
      </div>

      {/* Link regresar */}
      <div className="mt-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-surface-container"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Regresar al Login
        </Link>
      </div>

    </main>
  );
}
