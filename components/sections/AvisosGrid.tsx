"use client";

import { useEffect, useState } from "react";

interface Aviso {
  id: string;
  titulo: string;
  cuerpo: string;
  tipo: string;
  imagen_url: string | null;
  fecha_publicacion: string | null;
}

const TIPO_COLORS: Record<string, string> = {
  urgente:        "bg-red-600 dark:bg-red-700",
  academico:      "bg-blue-700 dark:bg-blue-800",
  administrativo: "bg-slate-600 dark:bg-slate-700",
  institucional:  "bg-teal-600 dark:bg-teal-700",
  sistema:        "bg-purple-600 dark:bg-purple-700",
};

const TIPO_LABEL: Record<string, string> = {
  urgente:        "Urgente",
  academico:      "Académico",
  administrativo: "Administrativo",
  institucional:  "Institucional",
  sistema:        "Sistema",
};

function formatFecha(f: string | null): string {
  if (!f) return "";
  const d = new Date(f);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" });
}

export default function AvisosGrid() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/avisos?limit=6")
      .then((r) => r.json())
      .then((d) => setAvisos(d.avisos ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-lg bg-surface-container animate-pulse" />
        ))}
      </div>
    );
  }

  if (avisos.length === 0) {
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
      {avisos.map((aviso) => (
        <article
          key={aviso.id}
          className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow duration-200 overflow-hidden flex flex-col h-full"
        >
          {aviso.imagen_url && (
            <div className="h-48 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={aviso.titulo}
                className="w-full h-full object-cover"
                src={aviso.imagen_url}
              />
              <div className="absolute top-4 left-4">
                <span className={`${TIPO_COLORS[aviso.tipo] ?? "bg-slate-600"} text-white px-3 py-1 rounded-full font-label-bold text-label-bold flex items-center gap-1 shadow-sm text-xs`}>
                  {TIPO_LABEL[aviso.tipo] ?? aviso.tipo}
                </span>
              </div>
            </div>
          )}

          <div className={`p-6 flex flex-col flex-grow ${!aviso.imagen_url ? "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" : ""}`}>
            <div className="flex justify-between items-start mb-3">
              {!aviso.imagen_url && (
                <span className={`${TIPO_COLORS[aviso.tipo] ?? "bg-slate-600"} text-white px-3 py-1 rounded-full font-label-bold text-label-bold flex items-center gap-1 shadow-sm text-xs`}>
                  {TIPO_LABEL[aviso.tipo] ?? aviso.tipo}
                </span>
              )}
              {formatFecha(aviso.fecha_publicacion) && (
                <div className="flex items-center text-on-surface-variant font-body-sm text-body-sm gap-2 ml-auto">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  <time dateTime={aviso.fecha_publicacion ?? ""}>{formatFecha(aviso.fecha_publicacion)}</time>
                </div>
              )}
            </div>
            <h2 className="font-title-sm text-title-sm text-on-background mb-3">{aviso.titulo}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 flex-grow line-clamp-3">{aviso.cuerpo}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
