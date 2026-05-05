"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {avisos.map((aviso) => (
          <article
            key={aviso.id}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col h-full cursor-pointer group"
            onClick={() => router.push(`/avisos/${aviso.id}`)}
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
    </>
  );
}
