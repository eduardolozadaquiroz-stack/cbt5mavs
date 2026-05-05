"use client";

import { useEffect, useState } from "react";

interface Aviso {
  id: string;
  titulo: string;
  cuerpo: string;
  tipo: string;
  fotos: string[];
  videos: string[];
  pdfs: string[];
  fecha_publicacion: string | null;
  es_evento: boolean;
  evento_inicio: string | null;
  evento_fin: string | null;
  evento_lugar: string | null;
  evento_vestimenta: string | null;
  evento_enlace: string | null;
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

function formatHora(f: string | null): string {
  if (!f) return "";
  const d = new Date(f);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

function pdfName(url: string): string {
  try { return decodeURIComponent(url.split("/").pop() ?? "documento.pdf"); } catch { return "documento.pdf"; }
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

            {/* card: mostrar badge de video/pdf si existen */}
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
              {/* badges de adjuntos */}
              {(aviso.es_evento || (aviso.videos?.length ?? 0) > 0 || (aviso.pdfs?.length ?? 0) > 0) && (
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {aviso.es_evento && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      🗓️ Evento
                    </span>
                  )}
                  {(aviso.videos?.length ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      🎥 {aviso.videos.length} video{aviso.videos.length > 1 ? "s" : ""}
                    </span>
                  )}
                  {(aviso.pdfs?.length ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      📄 {aviso.pdfs.length} PDF{aviso.pdfs.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              )}
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
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-4">{selected.cuerpo}</p>

              {/* Banner de evento */}
              {selected.es_evento && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 my-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🗓️</span>
                    <h3 className="font-bold text-blue-900 dark:text-blue-200 text-sm">Información del Evento</h3>
                  </div>
                  {selected.evento_inicio && (
                    <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">
                      📅 <strong>Inicio:</strong> {formatFecha(selected.evento_inicio)} · {formatHora(selected.evento_inicio)}
                    </p>
                  )}
                  {selected.evento_fin && (
                    <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">
                      📅 <strong>Fin:</strong> {formatFecha(selected.evento_fin)} · {formatHora(selected.evento_fin)}
                    </p>
                  )}
                  {selected.evento_lugar && (
                    <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">📍 {selected.evento_lugar}</p>
                  )}
                  {selected.evento_vestimenta && (
                    <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">👔 <strong>Vestimenta:</strong> {selected.evento_vestimenta}</p>
                  )}
                  {selected.evento_enlace && (
                    <a href={selected.evento_enlace} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline">
                      🔗 Ver más información
                    </a>
                  )}
                </div>
              )}

              {/* Videos */}
              {(selected.videos?.length ?? 0) > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Videos adjuntos</h4>
                  <div className="flex flex-col gap-3">
                    {selected.videos.map((url, i) => (
                      <video key={i} controls className="w-full rounded-xl bg-black" src={url}>
                        Tu navegador no soporta video HTML5.
                      </video>
                    ))}
                  </div>
                </div>
              )}

              {/* PDFs */}
              {(selected.pdfs?.length ?? 0) > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Documentos</h4>
                  <div className="flex flex-col gap-2">
                    {selected.pdfs.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600 flex-shrink-0">
                          <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
                        </svg>
                        <span className="text-sm font-medium text-red-700 dark:text-red-300 truncate">{pdfName(url)}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500 ml-auto flex-shrink-0">
                          <path d="M5 20h14v-2H5v2zm7-18L5.33 9h4.84v4h3.66V9h4.84L12 2z"/>
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
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
