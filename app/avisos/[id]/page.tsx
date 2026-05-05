"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import AvisosFooter from "@/components/layout/AvisosFooter";

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

const TIPO: Record<string, { label: string; pill: string }> = {
  urgente:        { label: "Urgente",        pill: "bg-red-600 text-white" },
  academico:      { label: "Académico",      pill: "bg-blue-600 text-white" },
  administrativo: { label: "Administrativo", pill: "bg-slate-600 text-white" },
  institucional:  { label: "Institucional",  pill: "bg-teal-600 text-white" },
  sistema:        { label: "Sistema",        pill: "bg-purple-600 text-white" },
};

function fmt(f: string | null, opts: Intl.DateTimeFormatOptions): string {
  if (!f) return "";
  const d = new Date(f);
  return isNaN(d.getTime()) ? "" : d.toLocaleString("es-MX", opts);
}

function pdfName(url: string): string {
  try {
    return decodeURIComponent(url.split("/").pop() ?? "documento.pdf").replace(/\.[^/.]+$/, "");
  } catch {
    return "Documento PDF";
  }
}

function Skeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 space-y-5 animate-pulse">
      <div className="h-6 w-28 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="h-10 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-700" />
      <div className="aspect-video rounded-2xl bg-slate-200 dark:bg-slate-700" />
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-3 border border-slate-100 dark:border-slate-800">
        <div className="h-3 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}

export default function AvisoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [aviso, setAviso]     = useState<Aviso | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [foto, setFoto]       = useState(0);
  const [lb, setLb]           = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/avisos/${id}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        if (!r.ok) throw new Error("Error");
        return r.json();
      })
      .then(data => {
        if (!data) return;
        setAviso({
          ...data,
          fotos:  data.fotos  ?? [],
          videos: data.videos ?? [],
          pdfs:   data.pdfs   ?? [],
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // Cerrar lightbox con Escape
  useEffect(() => {
    if (lb === null) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setLb(null); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [lb]);

  const fotos  = aviso?.fotos  ?? [];
  const videos = aviso?.videos ?? [];
  const pdfs   = aviso?.pdfs   ?? [];
  const tipo   = aviso ? (TIPO[aviso.tipo] ?? TIPO.institucional) : null;
  const urgente = aviso?.tipo === "urgente";

  return (
    <>
      <Navbar activePage="avisos" />

      <main className="flex-grow bg-slate-50 dark:bg-slate-950 pt-24 pb-16 min-h-screen">
        {/* Breadcrumb / Back */}
        <div className="max-w-3xl mx-auto px-4 mb-6">
          <Link
            href="/avisos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Avisos y Comunicados
          </Link>
        </div>

        {loading && <Skeleton />}

        {notFound && !loading && (
          <div className="max-w-3xl mx-auto px-4 text-center py-24">
            <div className="text-7xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">Aviso no encontrado</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">El aviso que buscas no existe o ya no está disponible.</p>
            <Link
              href="/avisos"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Ver todos los avisos
            </Link>
          </div>
        )}

        {aviso && !loading && (
          <div className="max-w-3xl mx-auto px-4 space-y-6">

            {/* Banda urgente */}
            {urgente && (
              <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl px-5 py-3 flex items-center gap-2.5 shadow-md shadow-red-200/50 dark:shadow-red-950/30">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  className="w-5 h-5 text-white animate-pulse flex-shrink-0">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
                <span className="text-white text-sm font-black uppercase tracking-widest">
                  ⚠️ Aviso Urgente — Atención inmediata
                </span>
              </div>
            )}

            {/* Cabecera: badge + fecha */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              {tipo && (
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${tipo.pill}`}>
                  {tipo.label}
                </span>
              )}
              {aviso.fecha_publicacion && (
                <time
                  dateTime={aviso.fecha_publicacion}
                  className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5"
                >
                  📅 {fmt(aviso.fecha_publicacion, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </time>
              )}
            </div>

            {/* Título */}
            <h1 className={`text-3xl md:text-4xl font-black leading-tight ${
              urgente ? "text-red-800 dark:text-red-300" : "text-slate-900 dark:text-slate-100"
            }`}>
              {aviso.titulo}
            </h1>

            {/* Galería de imágenes */}
            {fotos.length > 0 && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
                {/* Imagen activa */}
                <div
                  className="relative bg-slate-950 cursor-zoom-in select-none group"
                  style={{ aspectRatio: "16/9" }}
                  onClick={() => setLb(foto)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotos[foto]}
                    alt={aviso.titulo}
                    className="w-full h-full object-contain"
                  />
                  {fotos.length > 1 && (
                    <>
                      <button
                        onClick={e => { e.stopPropagation(); setFoto(v => (v - 1 + fotos.length) % fotos.length); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white text-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >‹</button>
                      <button
                        onClick={e => { e.stopPropagation(); setFoto(v => (v + 1) % fotos.length); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white text-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >›</button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                        {foto + 1} / {fotos.length}
                      </div>
                    </>
                  )}
                  <div className="absolute top-3 right-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    🔍 Ampliar
                  </div>
                </div>

                {/* Tira de miniaturas */}
                {fotos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto bg-slate-900 px-3 py-2.5 scroll-smooth">
                    {fotos.map((u, i) => (
                      <button
                        key={i}
                        onClick={() => setFoto(i)}
                        className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                          foto === i
                            ? "border-blue-500 scale-105 shadow-lg"
                            : "border-transparent opacity-50 hover:opacity-90 hover:border-slate-600"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={u} alt="" className="h-16 w-16 object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cuerpo del aviso */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {aviso.cuerpo}
              </p>
            </div>

            {/* Banner de Evento */}
            {aviso.es_evento && (
              <div className="rounded-2xl overflow-hidden border border-blue-200 dark:border-blue-800 shadow-sm">
                <div className="bg-blue-600 px-5 py-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white flex-shrink-0">
                    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                  </svg>
                  <span className="text-white text-sm font-black uppercase tracking-wider">Detalles del Evento</span>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {aviso.evento_inicio && (
                    <div className="flex gap-3">
                      <span className="text-xl leading-none mt-0.5 flex-shrink-0">📅</span>
                      <div>
                        <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-0.5">Inicio</p>
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                          {fmt(aviso.evento_inicio, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        {fmt(aviso.evento_inicio, { hour: "2-digit", minute: "2-digit" }) && (
                          <p className="text-xs text-blue-700 dark:text-blue-300 font-bold">
                            🕐 {fmt(aviso.evento_inicio, { hour: "2-digit", minute: "2-digit" })} hrs
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {aviso.evento_fin && (
                    <div className="flex gap-3">
                      <span className="text-xl leading-none mt-0.5 flex-shrink-0">🏁</span>
                      <div>
                        <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-0.5">Fin</p>
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                          {fmt(aviso.evento_fin, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        {fmt(aviso.evento_fin, { hour: "2-digit", minute: "2-digit" }) && (
                          <p className="text-xs text-blue-700 dark:text-blue-300 font-bold">
                            🕐 {fmt(aviso.evento_fin, { hour: "2-digit", minute: "2-digit" })} hrs
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {aviso.evento_lugar && (
                    <div className="flex gap-3">
                      <span className="text-xl leading-none mt-0.5 flex-shrink-0">📍</span>
                      <div>
                        <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-0.5">Lugar / Sede</p>
                        <p className="text-sm text-blue-900 dark:text-blue-200">{aviso.evento_lugar}</p>
                      </div>
                    </div>
                  )}
                  {aviso.evento_vestimenta && (
                    <div className="flex gap-3">
                      <span className="text-xl leading-none mt-0.5 flex-shrink-0">👔</span>
                      <div>
                        <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-0.5">Vestimenta</p>
                        <p className="text-sm text-blue-900 dark:text-blue-200">{aviso.evento_vestimenta}</p>
                      </div>
                    </div>
                  )}
                </div>

                {aviso.evento_enlace && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 px-5 pb-4 border-t border-blue-100 dark:border-blue-900">
                    <a
                      href={aviso.evento_enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                      </svg>
                      Ver más información
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
                  🎥 Videos adjuntos
                </h2>
                {videos.map((url, i) => (
                  <video
                    key={i}
                    controls
                    preload="metadata"
                    className="w-full rounded-2xl bg-black shadow-md"
                    src={url}
                  >
                    Tu navegador no soporta video HTML5.
                  </video>
                ))}
              </div>
            )}

            {/* PDFs */}
            {pdfs.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
                  📄 Documentos adjuntos
                </h2>
                {pdfs.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 dark:hover:border-red-800 transition-all shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 dark:group-hover:bg-red-900/60 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600">
                        <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors truncate">
                        {pdfName(url)}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">PDF · Haz clic para abrir</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-red-400 transition-colors flex-shrink-0">
                      <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                    </svg>
                  </a>
                ))}
              </div>
            )}

            {/* Volver */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/avisos"
                className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Volver a todos los avisos
              </Link>
            </div>
          </div>
        )}
      </main>

      <AvisosFooter />

      {/* Lightbox */}
      {lb !== null && fotos.length > 0 && (
        <div
          className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLb(null)}
        >
          <div
            className="relative max-w-5xl w-full flex flex-col items-center gap-4"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setLb(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors"
            >×</button>

            {fotos.length > 1 && (
              <>
                <button
                  onClick={() => setLb(prev => ((prev ?? 0) - 1 + fotos.length) % fotos.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition-colors"
                >‹</button>
                <button
                  onClick={() => setLb(prev => ((prev ?? 0) + 1) % fotos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition-colors"
                >›</button>
              </>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fotos[lb]}
              alt={aviso?.titulo ?? ""}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            />

            {fotos.length > 1 && (
              <p className="text-white/60 text-sm font-semibold">
                {(lb ?? 0) + 1} / {fotos.length}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
