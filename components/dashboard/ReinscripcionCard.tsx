"use client";

import Link from "next/link";
import { useAdminConfig } from "@/app/context/AdminConfigContext";

interface ReinscripcionCardProps {
  className?: string;
  /** "alumno" o "padres" — añade botón "Ir a mi trámite" */
  role?: "alumno" | "padres";
}

export default function ReinscripcionCard({ className = "", role }: ReinscripcionCardProps) {
  const { config } = useAdminConfig();
  const r = config.reinscripcion;

  if (!r.habilitada) return null;

  const fechaInicio = r.fechaInicio ? new Date(r.fechaInicio + "T00:00:00") : null;
  const fechaCierre = r.fechaCierre ? new Date(r.fechaCierre + "T00:00:00") : null;
  const docs = r.documentosRequeridos
    ? r.documentosRequeridos.split(",").map((d) => d.trim()).filter(Boolean)
    : [];

  return (
    <div className={`mb-lg ${className}`}>
      <div className="relative overflow-hidden rounded-xl border-2 border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
        {/* Franja decorativa superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Ícono */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-200 dark:bg-amber-800/60 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-700 dark:text-amber-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
            </svg>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 bg-amber-200 dark:bg-amber-800/60 text-amber-900 dark:text-amber-100 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse" />
                Reinscripción {r.cicloEscolar}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Proceso de Reinscripción abierto
            </h3>

            {/* Fechas y costo */}
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-700 dark:text-slate-300 mb-3">
              {fechaInicio && (
                <span>
                  <strong>Inicio:</strong>{" "}
                  {fechaInicio.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
              {fechaCierre && (
                <span>
                  <strong>Cierre:</strong>{" "}
                  {fechaCierre.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
              {r.costoReinscripcion > 0 && (
                <span>
                  <strong>Costo:</strong> ${r.costoReinscripcion} MXN
                </span>
              )}
            </div>

            {/* Aviso importante */}
            {r.avisoImportante && (
              <p className="text-xs text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 rounded-lg px-3 py-2 mb-3">
                ⚠️ {r.avisoImportante}
              </p>
            )}

            {/* Documentos */}
            {docs.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Documentos requeridos
                </p>
                <div className="flex flex-wrap gap-2">
                  {docs.map((doc, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full">
                      <svg className="w-3 h-3 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA + imagen de pago */}
          <div className="flex-shrink-0 self-start sm:self-center flex flex-col items-start sm:items-end gap-2">
            {r.linkFormatos && (
              <a
                href={r.linkFormatos}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                Ver trámites
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {r.imagenPago && (
              <a
                href={r.imagenPago}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-200 text-sm font-medium rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Referencia de pago
              </a>
            )}
            {role && (
              <Link
                href={role === "alumno" ? "/dashboard/alumno/reinscripcion" : "/dashboard/padres/reinscripcion"}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {role === "alumno" ? "Mi trámite" : "Ver estado"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
