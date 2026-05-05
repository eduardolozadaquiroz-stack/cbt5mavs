"use client";

import { useAdminConfig } from "@/app/context/AdminConfigContext";

export default function ReinscripcionBanner() {
  const { config } = useAdminConfig();
  const r = config.reinscripcion;

  if (!r.habilitada) return null;

  const fechaInicio = r.fechaInicio ? new Date(r.fechaInicio + "T00:00:00") : null;
  const fechaCierre = r.fechaCierre ? new Date(r.fechaCierre + "T00:00:00") : null;
  const docs = r.documentosRequeridos
    ? r.documentosRequeridos.split(",").map((d) => d.trim()).filter(Boolean)
    : [];

  return (
    <section className="w-full bg-amber-50 dark:bg-amber-900/20 border-y border-amber-200 dark:border-amber-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* Icono + título */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-amber-200 dark:bg-amber-800/50 text-amber-900 dark:text-amber-100 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Reinscripción {r.cicloEscolar}
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">
            Proceso de Reinscripción abierto
          </h2>

          {(fechaInicio || fechaCierre) && (
            <div className="flex flex-wrap gap-4 mb-3 text-sm">
              {fechaInicio && (
                <span className="text-slate-700 dark:text-slate-300">
                  <strong>Inicio:</strong>{" "}
                  {fechaInicio.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
              {fechaCierre && (
                <span className="text-slate-700 dark:text-slate-300">
                  <strong>Cierre:</strong>{" "}
                  {fechaCierre.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
              {r.costoReinscripcion > 0 && (
                <span className="text-slate-700 dark:text-slate-300">
                  <strong>Costo:</strong> ${r.costoReinscripcion} MXN
                </span>
              )}
            </div>
          )}

          {r.avisoImportante && (
            <p className="text-sm text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 rounded-lg px-3 py-2 mt-2 max-w-xl">
              ⚠️ {r.avisoImportante}
            </p>
          )}
        </div>

        {/* Documentos + CTA */}
        <div className="flex-shrink-0 flex flex-col gap-4 min-w-[220px]">
          {docs.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                Documentos requeridos
              </p>
              <ul className="space-y-1">
                {docs.map((doc, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {r.linkFormatos && (
            <a
              href={r.linkFormatos}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition-colors"
            >
              Ver formatos y trámites
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
