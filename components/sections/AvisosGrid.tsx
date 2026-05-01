"use client";

import { useAdminConfig } from "@/app/context/AdminConfigContext";

const TIPO_COLORS: Record<string, string> = {
  Urgente:        "bg-red-600 dark:bg-red-700",
  Académico:      "bg-blue-700 dark:bg-blue-800",
  Administrativo: "bg-slate-600 dark:bg-slate-700",
  Institucional:  "bg-teal-600 dark:bg-teal-700",
  Sistema:        "bg-purple-600 dark:bg-purple-700",
};

export default function AvisosGrid() {
  const { getPublicadosAvisos } = useAdminConfig();
  const avisosPublicados = getPublicadosAvisos().slice(0, 6);

  if (avisosPublicados.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-on-surface-variant font-body-base text-body-base">
          No hay avisos publicados en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {avisosPublicados.map((aviso) => (
        <article
          key={aviso.id}
          className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow duration-200 overflow-hidden flex flex-col h-full"
        >
          {aviso.fotos.length > 0 ? (
            <div className="h-48 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={aviso.titulo}
                className="w-full h-full object-cover"
                src={aviso.fotos[0]}
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`${TIPO_COLORS[aviso.tipo]} text-white px-3 py-1 rounded-full font-label-bold text-label-bold flex items-center gap-1 shadow-sm`}
                >
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  {aviso.tipo}
                </span>
              </div>
            </div>
          ) : null}

          <div className={aviso.fotos.length === 0 ? "p-6 flex flex-col flex-grow bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" : "p-6 flex flex-col flex-grow"}>
            <div className="flex justify-between items-start mb-3">
              <span
                className={`${TIPO_COLORS[aviso.tipo]} text-white px-3 py-1 rounded-full font-label-bold text-label-bold flex items-center gap-1 shadow-sm ${aviso.fotos.length > 0 ? "hidden" : ""}`}
              >
                <span className="material-symbols-outlined text-[14px]">info</span>
                {aviso.tipo}
              </span>
              <div className="flex items-center text-on-surface-variant font-body-sm text-body-sm gap-2">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                <time dateTime={aviso.fecha}>
                  {new Date(aviso.fecha).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
            <h2 className="font-title-sm text-title-sm text-on-background mb-3">
              {aviso.titulo}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 flex-grow line-clamp-3">
              {aviso.contenido}
            </p>
            <a
              className="inline-flex items-center gap-1 font-label-bold text-label-bold text-primary hover:text-secondary transition-colors mt-auto group"
              href="#"
            >
              Leer mas
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
