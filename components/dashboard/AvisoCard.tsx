"use client";

import { useState, useEffect } from "react";
import type { Aviso } from "@/hooks/useRealtimeAvisos";

// ── Configuración por tipo ────────────────────────────────────────────────────
const TIPO: Record<string, { label: string; pill: string; urgente?: true }> = {
  urgente:        { label: "Urgente",        pill: "bg-red-600 text-white",     urgente: true },
  academico:      { label: "Académico",      pill: "bg-blue-600 text-white" },
  administrativo: { label: "Administrativo", pill: "bg-slate-600 text-white" },
  institucional:  { label: "Institucional",  pill: "bg-teal-600 text-white" },
  sistema:        { label: "Sistema",        pill: "bg-purple-600 text-white" },
};

// ── Helpers de formato ────────────────────────────────────────────────────────
function fmt(f: string | null, opts: Intl.DateTimeFormatOptions): string {
  if (!f) return "";
  const d = new Date(f);
  return isNaN(d.getTime()) ? "" : d.toLocaleString("es-MX", opts);
}

function pdfName(url: string): string {
  try {
    return decodeURIComponent(url.split("/").pop() ?? "documento.pdf")
      .replace(/\.[^/.]+$/, "");
  } catch {
    return "Documento PDF";
  }
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function AvisoCard({ aviso }: { aviso: Aviso }) {
  const [exp,   setExp]   = useState(false);
  const [foto,  setFoto]  = useState(0);
  const [lb,    setLb]    = useState<number | null>(null);
  const [modal, setModal] = useState(false);
  // Estado de foto dentro del modal (independiente del card)
  const [mFoto, setMFoto] = useState(0);

  const fotos  = aviso.fotos  ?? [];
  const videos = aviso.videos ?? [];
  const pdfs   = aviso.pdfs   ?? [];

  const tipo     = TIPO[aviso.tipo] ?? TIPO.institucional;
  const urgente  = !!tipo.urgente;

  // Texto largo: más de 5 líneas o 280 chars
  const needsExp = aviso.cuerpo.length > 280 ||
    (aviso.cuerpo.match(/\n/g)?.length ?? 0) >= 4;

  // Cerrar modal con Escape (solo si no está el lightbox abierto)
  useEffect(() => {
    if (!modal || lb !== null) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setModal(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [modal, lb]);

  return (
    <>
      {/* ── Card ── */}
      <article
        className={[
          "bg-white dark:bg-slate-900 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl",
          urgente
            ? "border-2 border-red-300 dark:border-red-700 shadow-md shadow-red-100/60 dark:shadow-red-950/20"
            : "border border-slate-100 dark:border-slate-800 shadow-sm",
        ].join(" ")}
      >
        {/* Banda superior urgente */}
        {urgente && (
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              className="w-4 h-4 text-white animate-pulse flex-shrink-0">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
            <span className="text-white text-xs font-black uppercase tracking-widest">
              ⚠️ Aviso Urgente — Atención inmediata
            </span>
          </div>
        )}

        <div className="p-5 md:p-6 space-y-4">

          {/* ── Cabecera: tipo + fecha ── */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {!urgente && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${tipo.pill}`}>
                {tipo.label}
              </span>
            )}
            {aviso.fecha_publicacion && (
              <time
                dateTime={aviso.fecha_publicacion}
                className={`text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 ${urgente ? "" : "ml-auto"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
                </svg>
                {fmt(aviso.fecha_publicacion, { day: "numeric", month: "short", year: "numeric" })}
              </time>
            )}
          </div>

          {/* ── Título ── */}
          <h2 className={`font-bold text-lg leading-snug ${
            urgente
              ? "text-red-800 dark:text-red-300"
              : "text-slate-900 dark:text-slate-100"
          }`}>
            {aviso.titulo}
          </h2>

          {/* ── Cuerpo con expand/collapse ── */}
          <div>
            <p className={`text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line${needsExp && !exp ? " line-clamp-5" : ""}`}>
              {aviso.cuerpo}
            </p>
            {needsExp && (
              <button
                onClick={() => setExp(v => !v)}
                className="mt-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {exp ? "▲ Ver menos" : "▼ Ver más"}
              </button>
            )}
          </div>

          {/* ── Galería de fotos ── */}
          {fotos.length > 0 && (
            <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
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
                {/* Navegar fotos */}
                {fotos.length > 1 && (
                  <>
                    <button
                      onClick={e => { e.stopPropagation(); setFoto(v => (v - 1 + fotos.length) % fotos.length); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white text-xl flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    >‹</button>
                    <button
                      onClick={e => { e.stopPropagation(); setFoto(v => (v + 1) % fotos.length); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white text-xl flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    >›</button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                      {foto + 1} / {fotos.length}
                    </div>
                  </>
                )}
                {/* Hint ampliar */}
                <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  🔍 Ampliar
                </div>
              </div>

              {/* Tira de miniaturas */}
              {fotos.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 scroll-smooth">
                  {fotos.map((u, i) => (
                    <button
                      key={i}
                      onClick={() => setFoto(i)}
                      className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                        foto === i
                          ? "border-blue-500 scale-105 shadow-md"
                          : "border-transparent opacity-55 hover:opacity-90 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt="" className="h-14 w-14 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Banner de Evento ── */}
          {aviso.es_evento && (
            <div className="rounded-xl overflow-hidden border border-blue-200 dark:border-blue-800">
              {/* Cabecera azul */}
              <div className="bg-blue-600 px-4 py-2.5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white flex-shrink-0">
                  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                </svg>
                <span className="text-white text-xs font-black uppercase tracking-wider">Detalles del Evento</span>
              </div>

              {/* Cuerpo */}
              <div className="bg-blue-50 dark:bg-blue-950/30 px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aviso.evento_inicio && (
                  <div className="flex gap-2.5">
                    <span className="text-base leading-none mt-0.5 flex-shrink-0">📅</span>
                    <div>
                      <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-0.5">Inicio</p>
                      <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                        {fmt(aviso.evento_inicio, { weekday: "long", day: "numeric", month: "long" })}
                      </p>
                      {fmt(aviso.evento_inicio, { hour: "2-digit", minute: "2-digit" }) && (
                        <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                          🕐 {fmt(aviso.evento_inicio, { hour: "2-digit", minute: "2-digit" })} hrs
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {aviso.evento_fin && (
                  <div className="flex gap-2.5">
                    <span className="text-base leading-none mt-0.5 flex-shrink-0">🏁</span>
                    <div>
                      <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-0.5">Fin</p>
                      <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                        {fmt(aviso.evento_fin, { weekday: "long", day: "numeric", month: "long" })}
                      </p>
                      {fmt(aviso.evento_fin, { hour: "2-digit", minute: "2-digit" }) && (
                        <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                          🕐 {fmt(aviso.evento_fin, { hour: "2-digit", minute: "2-digit" })} hrs
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {aviso.evento_lugar && (
                  <div className="flex gap-2.5">
                    <span className="text-base leading-none mt-0.5 flex-shrink-0">📍</span>
                    <div>
                      <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-0.5">Lugar / Sede</p>
                      <p className="text-sm text-blue-900 dark:text-blue-200">{aviso.evento_lugar}</p>
                    </div>
                  </div>
                )}
                {aviso.evento_vestimenta && (
                  <div className="flex gap-2.5">
                    <span className="text-base leading-none mt-0.5 flex-shrink-0">👔</span>
                    <div>
                      <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-0.5">Vestimenta</p>
                      <p className="text-sm text-blue-900 dark:text-blue-200">{aviso.evento_vestimenta}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enlace externo */}
              {aviso.evento_enlace && (
                <div className="bg-blue-50 dark:bg-blue-950/30 px-4 pb-3 border-t border-blue-100 dark:border-blue-900">
                  <a
                    href={aviso.evento_enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                    </svg>
                    Ver más información
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ── Videos ── */}
          {videos.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">🎥 Videos adjuntos</p>
              {videos.map((url, i) => (
                <video
                  key={i}
                  controls
                  preload="metadata"
                  className="w-full rounded-xl bg-slate-950 max-h-80"
                  src={url}
                >
                  Tu navegador no soporta video HTML5.
                </video>
              ))}
            </div>
          )}

          {/* ── PDFs ── */}
          {pdfs.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">📄 Documentos adjuntos</p>
              {pdfs.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 dark:hover:border-red-800 transition-all duration-150"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 dark:group-hover:bg-red-900/60 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-600">
                      <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-red-700 dark:group-hover:text-red-300 truncate transition-colors">
                      {pdfName(url)}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">PDF · Toca para abrir</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-red-400 transition-colors flex-shrink-0">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                  </svg>
                </a>
              ))}
            </div>
          )}

          {/* ── Leer más → abre modal ── */}
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => { setMFoto(0); setModal(true); }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Leer más
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21v-2z" transform="scale(-1,1) translate(-24,0)" />
                <path d="M8 5v2.99H5.01L9 12l-3.99 4.01H8V19l6-7-6-7z"/>
              </svg>
            </button>
          </div>

        </div>
      </article>

      {/* ── Modal de detalle ── */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Cabecera del modal */}
            <div className={`sticky top-0 z-10 flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 ${urgente ? "bg-red-600" : "bg-white dark:bg-slate-900"}`}>
              <div className="flex flex-col gap-1 min-w-0">
                {urgente && (
                  <span className="text-[10px] font-black text-white/90 uppercase tracking-widest flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 animate-pulse">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                    </svg>
                    Aviso Urgente
                  </span>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {!urgente && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${tipo.pill}`}>
                      {tipo.label}
                    </span>
                  )}
                  {aviso.fecha_publicacion && (
                    <time className={`text-xs flex items-center gap-1 ${urgente ? "text-white/80" : "text-slate-400 dark:text-slate-500"}`}>
                      📅 {fmt(aviso.fecha_publicacion, { day: "numeric", month: "long", year: "numeric" })}
                    </time>
                  )}
                </div>
                <h2 className={`font-bold text-xl leading-snug mt-1 ${urgente ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                  {aviso.titulo}
                </h2>
              </div>
              <button
                onClick={() => setModal(false)}
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xl transition-colors ${urgente ? "bg-white/20 hover:bg-white/30 text-white" : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
              >×</button>
            </div>

            {/* Cuerpo del modal */}
            <div className="px-6 py-5 space-y-5 flex-1 overflow-y-auto">

              {/* Galería en modal */}
              {fotos.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                  <div
                    className="relative bg-slate-950 cursor-zoom-in select-none group"
                    style={{ aspectRatio: "16/9" }}
                    onClick={() => setLb(mFoto)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={fotos[mFoto]} alt={aviso.titulo} className="w-full h-full object-contain" />
                    {fotos.length > 1 && (
                      <>
                        <button onClick={e => { e.stopPropagation(); setMFoto(v => (v - 1 + fotos.length) % fotos.length); }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white text-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">‹</button>
                        <button onClick={e => { e.stopPropagation(); setMFoto(v => (v + 1) % fotos.length); }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white text-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">›</button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                          {mFoto + 1} / {fotos.length}
                        </div>
                      </>
                    )}
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">🔍 Ampliar</div>
                  </div>
                  {fotos.length > 1 && (
                    <div className="flex gap-1.5 overflow-x-auto bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5">
                      {fotos.map((u, i) => (
                        <button key={i} onClick={() => setMFoto(i)}
                          className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-150 ${mFoto === i ? "border-blue-500 scale-105" : "border-transparent opacity-55 hover:opacity-90"}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={u} alt="" className="h-14 w-14 object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Texto completo */}
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {aviso.cuerpo}
              </p>

              {/* Banner evento */}
              {aviso.es_evento && (
                <div className="rounded-xl overflow-hidden border border-blue-200 dark:border-blue-800">
                  <div className="bg-blue-600 px-4 py-2.5 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white flex-shrink-0">
                      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                    </svg>
                    <span className="text-white text-xs font-black uppercase tracking-wider">Detalles del Evento</span>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/30 px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {aviso.evento_inicio && (
                      <div className="flex gap-2.5">
                        <span className="text-base leading-none mt-0.5 flex-shrink-0">📅</span>
                        <div>
                          <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-0.5">Inicio</p>
                          <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">{fmt(aviso.evento_inicio, { weekday: "long", day: "numeric", month: "long" })}</p>
                          {fmt(aviso.evento_inicio, { hour: "2-digit", minute: "2-digit" }) && (
                            <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">🕐 {fmt(aviso.evento_inicio, { hour: "2-digit", minute: "2-digit" })} hrs</p>
                          )}
                        </div>
                      </div>
                    )}
                    {aviso.evento_fin && (
                      <div className="flex gap-2.5">
                        <span className="text-base leading-none mt-0.5 flex-shrink-0">🏁</span>
                        <div>
                          <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-0.5">Fin</p>
                          <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">{fmt(aviso.evento_fin, { weekday: "long", day: "numeric", month: "long" })}</p>
                          {fmt(aviso.evento_fin, { hour: "2-digit", minute: "2-digit" }) && (
                            <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">🕐 {fmt(aviso.evento_fin, { hour: "2-digit", minute: "2-digit" })} hrs</p>
                          )}
                        </div>
                      </div>
                    )}
                    {aviso.evento_lugar && (
                      <div className="flex gap-2.5">
                        <span className="text-base leading-none mt-0.5 flex-shrink-0">📍</span>
                        <div>
                          <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-0.5">Lugar / Sede</p>
                          <p className="text-sm text-blue-900 dark:text-blue-200">{aviso.evento_lugar}</p>
                        </div>
                      </div>
                    )}
                    {aviso.evento_vestimenta && (
                      <div className="flex gap-2.5">
                        <span className="text-base leading-none mt-0.5 flex-shrink-0">👔</span>
                        <div>
                          <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-0.5">Vestimenta</p>
                          <p className="text-sm text-blue-900 dark:text-blue-200">{aviso.evento_vestimenta}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {aviso.evento_enlace && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 px-4 pb-3 border-t border-blue-100 dark:border-blue-900">
                      <a href={aviso.evento_enlace} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
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
                <div className="space-y-2.5">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">🎥 Videos adjuntos</p>
                  {videos.map((url, i) => (
                    <video key={i} controls preload="metadata" className="w-full rounded-xl bg-slate-950 max-h-72" src={url}>
                      Tu navegador no soporta video HTML5.
                    </video>
                  ))}
                </div>
              )}

              {/* PDFs */}
              {pdfs.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">📄 Documentos adjuntos</p>
                  {pdfs.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 dark:hover:border-red-800 transition-all duration-150">
                      <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/50 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-600">
                          <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-red-700 dark:group-hover:text-red-300 truncate transition-colors">{pdfName(url)}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">PDF · Toca para abrir</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-red-400 transition-colors flex-shrink-0">
                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                      </svg>
                    </a>
                  ))}
                </div>
              )}

            </div>

            {/* Pie del modal */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lb !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLb(null)}
        >
          <div
            className="relative max-w-5xl w-full flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fotos[lb]}
              alt={aviso.titulo}
              className="max-h-[85vh] max-w-full object-contain rounded-xl select-none"
            />
            {/* Cerrar */}
            <button
              onClick={() => setLb(null)}
              className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white text-xl flex items-center justify-center transition-colors"
            >×</button>

            {/* Navegar en lightbox */}
            {fotos.length > 1 && (
              <>
                <button
                  onClick={() => setLb(prev => ((prev ?? 0) - 1 + fotos.length) % fotos.length)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center transition-colors"
                >‹</button>
                <button
                  onClick={() => setLb(prev => ((prev ?? 0) + 1) % fotos.length)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center transition-colors"
                >›</button>
                <div className="mt-4 bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {lb + 1} / {fotos.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
