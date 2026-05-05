"use client";

import { useEffect, useState } from "react";

interface Aviso {
  id: string;
  titulo: string;
  cuerpo: string;
  tipo: string;
  fotos: string[];
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
  const [selected, setSelected] = useState<Aviso | null>(null);

  useEffect(() => {
    fetch("/api/avisos?limit=6")
      .then((r) => r.json())
      .then((d) => setAvisos(d.avisos ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Cerrar modal con Escape
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selected]);

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {avisos.map((aviso) => (
          <article
            key={aviso.id}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col h-full cursor-pointer group"
            onClick={() => setSelected(aviso)}
          >
            {aviso.fotos.length > 0 && (
              <div className="relative overflow-hidden bg-slate-200 dark:bg-slate-700" style={{ aspectRatio: "16/9" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={aviso.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={aviso.fotos[0]}
                />
                <div className="absolute top-3 left-3">
                  <span className={`${TIPO_COLORS[aviso.tipo] ?? "bg-slate-600"} text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm`}>
                    {TIPO_LABEL[aviso.tipo] ?? aviso.tipo}
                  </span>
                </div>
                {aviso.fotos.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                    +{aviso.fotos.length - 1}
                  </div>
                )}
              </div>
            )}

            <div className={`p-5 flex flex-col flex-grow ${aviso.fotos.length === 0 ? "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" : ""}`}>
              <div className="flex justify-between items-start mb-2 gap-2">
                {aviso.fotos.length === 0 && (
                  <span className={`${TIPO_COLORS[aviso.tipo] ?? "bg-slate-600"} text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm`}>
                    {TIPO_LABEL[aviso.tipo] ?? aviso.tipo}
                  </span>
                )}
                {formatFecha(aviso.fecha_publicacion) && (
                  <div className="flex items-center text-on-surface-variant font-body-sm text-body-sm gap-1 ml-auto text-xs">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    <time dateTime={aviso.fecha_publicacion ?? ""}>{formatFecha(aviso.fecha_publicacion)}</time>
                  </div>
                )}
              </div>
              <h2 className="font-title-sm text-title-sm text-on-background mb-2">{aviso.titulo}</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 flex-grow line-clamp-3">{aviso.cuerpo}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline mt-auto">
                Leer más
                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Modal detalle aviso */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen principal + galeria */}
            {selected.fotos.length > 0 && (
              <div>
                <div className="overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800" style={{ aspectRatio: "16/9" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.fotos[0]} alt={selected.titulo} className="w-full h-full object-cover" />
                </div>
                {selected.fotos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-slate-50 dark:bg-slate-800/60">
                    {selected.fotos.slice(1).map((url, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={url} alt="" className="h-16 w-16 rounded-lg object-cover flex-shrink-0 border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-colors" />
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                <span className={`${TIPO_COLORS[selected.tipo] ?? "bg-slate-600"} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                  {TIPO_LABEL[selected.tipo] ?? selected.tipo}
                </span>
                {formatFecha(selected.fecha_publicacion) && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    {formatFecha(selected.fecha_publicacion)}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{selected.titulo}</h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{selected.cuerpo}</p>
              <button
                onClick={() => setSelected(null)}
                className="mt-6 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
