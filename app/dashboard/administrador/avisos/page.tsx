"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

// ── Emoji Picker ─────────────────────────────────────────────────────────────
const EMOJI_GROUPS = [
  { label: "Frecuentes",  emojis: ["😊","👍","📢","⚠️","✅","❌","📌","🔔","📅","🏫","📝","🎓","📣","💡","⭐"] },
  { label: "Caras",       emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔"] },
  { label: "Símbolos",    emojis: ["✨","🌟","💫","⚡","🔥","❄️","🌈","💥","🎉","🎊","🏆","🥇","🎯","💯","🚀","⏰","📆","🗓️","🔑","🔒","💼","📊","📈","📉","📋","📄","📜","📬","📧","🔗"] },
  { label: "Gestos",      emojis: ["👋","🤚","✋","🖐️","👌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","🤲","🤝","🙏","💪","🦾","🖊️"] },
];

function EmojiPicker({ onSelect, onClose }: { onSelect: (e: string) => void; onClose: () => void }) {
  const [tab, setTab] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(ev: MouseEvent) {
      if (ref.current && !ref.current.contains(ev.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute z-50 bottom-full mb-1 left-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl w-72">
      <div className="flex border-b border-slate-100 dark:border-slate-700 overflow-x-auto">
        {EMOJI_GROUPS.map((g, i) => (
          <button key={g.label} onClick={() => setTab(i)}
            className={`px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors ${tab === i ? "border-b-2 border-blue-600 text-blue-700" : "text-slate-500 hover:text-slate-700"}`}>
            {g.label}
          </button>
        ))}
      </div>
      <div className="p-2 grid grid-cols-8 gap-0.5 max-h-40 overflow-y-auto">
        {EMOJI_GROUPS[tab].emojis.map((em) => (
          <button key={em} onClick={() => onSelect(em)}
            className="text-xl hover:bg-slate-100 dark:hover:bg-slate-800 rounded p-1 transition-colors leading-none">
            {em}
          </button>
        ))}
      </div>
    </div>
  );
}

type Tipo = "urgente" | "academico" | "administrativo" | "institucional" | "sistema";

const TIPO_LABEL: Record<Tipo, string> = {
  urgente:        "Urgente",
  academico:      "Académico",
  administrativo: "Administrativo",
  institucional:  "Institucional",
  sistema:        "Sistema",
};

interface Aviso {
  id: string;
  titulo: string;
  cuerpo: string;
  tipo: Tipo;
  firmado: string | null;
  fecha_publicacion: string | null;
  activo: boolean;
  fotos: string[];
  videos: string[];
  pdfs: string[];
  destinatario: string;
  es_evento: boolean;
  evento_inicio: string | null;
  evento_fin: string | null;
  evento_lugar: string | null;
  evento_vestimenta: string | null;
  evento_enlace: string | null;
}

const TIPO_COLORS: Record<Tipo, string> = {
  urgente:        "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  academico:      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  administrativo: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  institucional:  "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  sistema:        "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

const TIPOS: Tipo[] = ["urgente", "academico", "administrativo", "institucional", "sistema"];

async function uploadFoto(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("bucket", "avisos");
  fd.append("file", file);
  const r = await fetch("/api/storage/upload", { method: "POST", body: fd });
  const d = await r.json();
  if (!d.ok) throw new Error(d.error ?? "Error al subir el archivo");
  return d.url as string;
}
// Reutilizamos la misma función para videos y PDFs (mismo bucket, misma API)
const uploadVideo = uploadFoto;
const uploadPdf   = uploadFoto;

// ── Modal crear / editar aviso ────────────────────────────────────────────────
function ModalAviso({
  aviso,
  onClose,
  onSaved,
}: {
  aviso: Partial<Aviso> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!aviso?.id;
  const [form, setForm] = useState({
    titulo:             aviso?.titulo             ?? "",
    cuerpo:             aviso?.cuerpo             ?? "",
    tipo:               aviso?.tipo               ?? ("institucional" as Tipo),
    firmado:            aviso?.firmado            ?? "",
    activo:             aviso?.activo             ?? true,
    fotos:              aviso?.fotos              ?? ([] as string[]),
    videos:             aviso?.videos             ?? ([] as string[]),
    pdfs:               aviso?.pdfs               ?? ([] as string[]),
    destinatario:       aviso?.destinatario       ?? "Todos",
    es_evento:          aviso?.es_evento          ?? false,
    evento_inicio:      aviso?.evento_inicio      ?? "",
    evento_fin:         aviso?.evento_fin         ?? "",
    evento_lugar:       aviso?.evento_lugar       ?? "",
    evento_vestimenta:  aviso?.evento_vestimenta  ?? "",
    evento_enlace:      aviso?.evento_enlace      ?? "",
  });
  const [uploading, setUploading] = useState<"foto" | "video" | "pdf" | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [emojiTarget, setEmojiTarget] = useState<"titulo" | "cuerpo" | null>(null);
  const fileRef      = useRef<HTMLInputElement>(null);
  const videoRef     = useRef<HTMLInputElement>(null);
  const pdfRef       = useRef<HTMLInputElement>(null);
  const tituloRef    = useRef<HTMLInputElement>(null);
  const cuerpoRef    = useRef<HTMLTextAreaElement>(null);

  function insertEmoji(em: string) {
    if (!emojiTarget) return;
    if (emojiTarget === "titulo") {
      const el = tituloRef.current;
      if (!el) { set("titulo", form.titulo + em); return; }
      const start = el.selectionStart ?? form.titulo.length;
      const end = el.selectionEnd ?? form.titulo.length;
      const next = form.titulo.slice(0, start) + em + form.titulo.slice(end);
      set("titulo", next);
      setTimeout(() => { el.focus(); el.setSelectionRange(start + em.length, start + em.length); }, 0);
    } else {
      const el = cuerpoRef.current;
      if (!el) { set("cuerpo", form.cuerpo + em); return; }
      const start = el.selectionStart ?? form.cuerpo.length;
      const end = el.selectionEnd ?? form.cuerpo.length;
      const next = form.cuerpo.slice(0, start) + em + form.cuerpo.slice(end);
      set("cuerpo", next);
      setTimeout(() => { el.focus(); el.setSelectionRange(start + em.length, start + em.length); }, 0);
    }
  }

  function set(k: string, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
    setErr("");
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const remaining = 5 - form.fotos.length;
    if (remaining <= 0) return;
    setUploading("foto");
    setErr("");
    try {
      const toUpload = Array.from(files).slice(0, remaining);
      const urls: string[] = [];
      for (const file of toUpload) {
        const url = await uploadFoto(file);
        urls.push(url);
      }
      setForm((f) => ({ ...f, fotos: [...f.fotos, ...urls] }));
    } catch (uploadErr) {
      setErr(uploadErr instanceof Error ? uploadErr.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  }

  async function handleVideoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (form.videos.length >= 3) return;
    setUploading("video");
    setErr("");
    try {
      const url = await uploadVideo(files[0]);
      setForm((f) => ({ ...f, videos: [...f.videos, url].slice(0, 3) }));
    } catch (uploadErr) {
      setErr(uploadErr instanceof Error ? uploadErr.message : "No se pudo subir el video.");
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  }

  async function handlePdfFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (form.pdfs.length >= 5) return;
    setUploading("pdf");
    setErr("");
    try {
      const toUpload = Array.from(files).slice(0, 5 - form.pdfs.length);
      const urls: string[] = [];
      for (const file of toUpload) {
        const url = await uploadPdf(file);
        urls.push(url);
      }
      setForm((f) => ({ ...f, pdfs: [...f.pdfs, ...urls].slice(0, 5) }));
    } catch (uploadErr) {
      setErr(uploadErr instanceof Error ? uploadErr.message : "No se pudo subir el PDF.");
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  }

  function removePhoto(idx: number) {
    setForm((f) => ({ ...f, fotos: f.fotos.filter((_, i) => i !== idx) }));
  }

  async function handleSave() {
    if (!form.titulo.trim() || !form.cuerpo.trim()) {
      setErr("El título y el contenido son obligatorios.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      const body = {
        titulo:             form.titulo.trim(),
        cuerpo:             form.cuerpo.trim(),
        tipo:               form.tipo,
        firmado:            form.firmado.trim() || null,
        activo:             form.activo,
        fotos:              form.fotos,
        videos:             form.videos,
        pdfs:               form.pdfs,
        destinatario:       form.destinatario,
        es_evento:          form.es_evento,
        evento_inicio:      form.es_evento && form.evento_inicio ? form.evento_inicio : null,
        evento_fin:         form.es_evento && form.evento_fin    ? form.evento_fin    : null,
        evento_lugar:       form.es_evento ? form.evento_lugar.trim()       || null : null,
        evento_vestimenta:  form.es_evento ? form.evento_vestimenta.trim()  || null : null,
        evento_enlace:      form.es_evento ? form.evento_enlace.trim()      || null : null,
      };
      const url  = isEdit ? `/api/avisos/${aviso!.id}` : "/api/avisos";
      const method = isEdit ? "PATCH" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "Error al guardar");
      onSaved();
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  const inputBase = "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-colors";
  const labelBase = "text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
            {isEdit ? "Editar aviso" : "Nuevo aviso"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3.5">
          {/* Título */}
          <div>
            <label className={labelBase}>Título *</label>
            <div className="relative">
              <input
                ref={tituloRef}
                value={form.titulo}
                onChange={(e) => set("titulo", e.target.value)}
                placeholder="Título del aviso..."
                className={`${inputBase} pr-10`}
              />
              <button type="button" onClick={() => setEmojiTarget(v => v === "titulo" ? null : "titulo")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-lg hover:scale-110 transition-transform" title="Insertar emoji">
                😊
              </button>
              {emojiTarget === "titulo" && (
                <EmojiPicker onSelect={(em) => { insertEmoji(em); }} onClose={() => setEmojiTarget(null)} />
              )}
            </div>
          </div>

          {/* Tipo + Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelBase}>Tipo</label>
              <select value={form.tipo} onChange={(e) => set("tipo", e.target.value)} className={inputBase}>
                {TIPOS.map((t) => <option key={t} value={t}>{TIPO_LABEL[t]}</option>)}
              </select>
            </div>
            <div>
              <label className={labelBase}>Estado</label>
              <select
                value={form.activo ? "publicado" : "archivado"}
                onChange={(e) => set("activo", e.target.value === "publicado")}
                className={inputBase}
              >
                <option value="publicado">Publicado</option>
                <option value="archivado">Archivado</option>
              </select>
            </div>
          </div>

          {/* Destinatario */}
          <div>
            <label className={labelBase}>Destinatario</label>
            <select value={form.destinatario} onChange={(e) => set("destinatario", e.target.value)} className={inputBase}>
              <option value="Todos">Todos (público general)</option>
              <option value="Alumnos">Solo Alumnos</option>
              <option value="Maestros">Solo Maestros</option>
              <option value="Padres">Solo Padres</option>
            </select>
          </div>

          {/* Firmado */}
          <div>
            <label className={labelBase}>Firmado por (opcional)</label>
            <input
              value={form.firmado}
              onChange={(e) => set("firmado", e.target.value)}
              placeholder="Ej. Dirección General"
              className={inputBase}
            />
          </div>

          {/* Contenido */}
          <div>
            <label className={labelBase}>Contenido *</label>
            <div className="relative">
              <textarea
                ref={cuerpoRef}
                value={form.cuerpo}
                onChange={(e) => set("cuerpo", e.target.value)}
                placeholder="Escribe el contenido del aviso..."
                rows={5}
                className={`${inputBase} resize-y pr-10`}
              />
              <button type="button" onClick={() => setEmojiTarget(v => v === "cuerpo" ? null : "cuerpo")}
                className="absolute right-2 top-2 text-lg hover:scale-110 transition-transform" title="Insertar emoji">
                😊
              </button>
              {emojiTarget === "cuerpo" && (
                <EmojiPicker onSelect={(em) => { insertEmoji(em); }} onClose={() => setEmojiTarget(null)} />
              )}
            </div>
          </div>

          {/* Imágenes (máx. 5) */}
          <div>
            <label className={labelBase}>
              Imágenes{" "}
              <span className="normal-case font-normal text-slate-400">(opcional · máx. 5)</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {form.fotos.map((url, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800" style={{ aspectRatio: "1/1" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow transition-colors"
                  >×</button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded leading-tight">Portada</span>
                  )}
                </div>
              ))}
              {form.fotos.length < 5 && (
                <button
                  type="button"
                  disabled={uploading !== null}
                  onClick={() => fileRef.current?.click()}
                  className="rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 transition-colors disabled:opacity-50"
                  style={{ aspectRatio: "1/1" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                  </svg>
                  <span className="text-[10px] font-medium">
                    {uploading === "foto" ? "⏳" : `${form.fotos.length}/5`}
                  </span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
          </div>

          {/* Videos (máx. 3) */}
          <div>
            <label className={labelBase}>
              Videos{" "}
              <span className="normal-case font-normal text-slate-400">(opcional · máx. 3 · MP4/WebM)</span>
            </label>
            {form.videos.map((url, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 flex items-center gap-2 min-w-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-600 flex-shrink-0">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                  <span className="text-xs text-slate-500 truncate">Video {i + 1}</span>
                </div>
                <button type="button" onClick={() => setForm((f) => ({ ...f, videos: f.videos.filter((_, j) => j !== i) }))}
                  className="w-6 h-6 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 text-xs flex items-center justify-center hover:bg-red-100 transition-colors">×</button>
              </div>
            ))}
            {form.videos.length < 3 && (
              <button type="button" disabled={uploading !== null} onClick={() => videoRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
                {uploading === "video" ? "Subiendo video..." : `Agregar video (${form.videos.length}/3)`}
              </button>
            )}
            <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleVideoFile} />
          </div>

          {/* PDFs (máx. 5) */}
          <div>
            <label className={labelBase}>
              Documentos PDF{" "}
              <span className="normal-case font-normal text-slate-400">(opcional · máx. 5 · hasta 50 MB)</span>
            </label>
            {form.pdfs.map((url, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 flex items-center gap-2 min-w-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-600 flex-shrink-0">
                    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
                  </svg>
                  <span className="text-xs text-slate-500 truncate">PDF {i + 1}</span>
                </div>
                <button type="button" onClick={() => setForm((f) => ({ ...f, pdfs: f.pdfs.filter((_, j) => j !== i) }))}
                  className="w-6 h-6 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 text-xs flex items-center justify-center hover:bg-red-100 transition-colors">×</button>
              </div>
            ))}
            {form.pdfs.length < 5 && (
              <button type="button" disabled={uploading !== null} onClick={() => pdfRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-500 hover:border-red-400 hover:text-red-600 transition-colors disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
                </svg>
                {uploading === "pdf" ? "Subiendo PDF..." : `Agregar PDF (${form.pdfs.length}/5)`}
              </button>
            )}
            <input ref={pdfRef} type="file" accept="application/pdf" multiple className="hidden" onChange={handlePdfFile} />
          </div>

          {/* 📅 Evento / Convocatoria */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, es_evento: !f.es_evento }))}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors ${
                form.es_evento
                  ? "bg-blue-600 text-white"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                </svg>
                Es un evento / convocatoria
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                form.es_evento ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}>{form.es_evento ? "ON" : "OFF"}</span>
            </button>

            {form.es_evento && (
              <div className="px-4 py-3 flex flex-col gap-3">
                {/* Fechas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelBase}>Fecha/hora inicio</label>
                    <input type="datetime-local" value={form.evento_inicio}
                      onChange={(e) => setForm((f) => ({ ...f, evento_inicio: e.target.value }))}
                      className={inputBase} />
                  </div>
                  <div>
                    <label className={labelBase}>Fecha/hora fin <span className="normal-case font-normal text-slate-400">(opcional)</span></label>
                    <input type="datetime-local" value={form.evento_fin}
                      onChange={(e) => setForm((f) => ({ ...f, evento_fin: e.target.value }))}
                      className={inputBase} />
                  </div>
                </div>
                {/* Lugar */}
                <div>
                  <label className={labelBase}>Lugar / sede</label>
                  <input type="text" value={form.evento_lugar}
                    onChange={(e) => setForm((f) => ({ ...f, evento_lugar: e.target.value }))}
                    placeholder="Ej. Explanada de la institución"
                    className={inputBase} />
                </div>
                {/* Vestimenta */}
                <div>
                  <label className={labelBase}>Vestimenta <span className="normal-case font-normal text-slate-400">(opcional)</span></label>
                  <input type="text" value={form.evento_vestimenta}
                    onChange={(e) => setForm((f) => ({ ...f, evento_vestimenta: e.target.value }))}
                    placeholder="Ej. Formal o uniforme escolar"
                    className={inputBase} />
                </div>
                {/* Enlace externo */}
                <div>
                  <label className={labelBase}>Enlace externo <span className="normal-case font-normal text-slate-400">(Google Drive, Forms, etc.)</span></label>
                  <input type="url" value={form.evento_enlace}
                    onChange={(e) => setForm((f) => ({ ...f, evento_enlace: e.target.value }))}
                    placeholder="https://drive.google.com/..."
                    className={inputBase} />
                </div>
              </div>
            )}
          </div>

          {err && <p className="text-xs text-red-600 dark:text-red-400">{err}</p>}

          {/* Acciones */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear aviso"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal de confirmación para eliminar ──────────────────────────────────────
function ModalEliminar({
  titulo,
  esArchivado,
  onClose,
  onConfirm,
}: {
  titulo: string;
  esArchivado: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm p-5">
        {esArchivado ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-600 text-2xl">🗑️</span>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">¿Eliminar permanentemente?</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              El aviso <span className="font-medium text-slate-700 dark:text-slate-200">&quot;{titulo}&quot;</span> ya está archivado.
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4 font-medium">
              ⚠️ Esta acción es irreversible. El aviso se borrará definitivamente.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-500 text-2xl">📦</span>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">¿Archivar aviso?</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              El aviso <span className="font-medium text-slate-700 dark:text-slate-200">&quot;{titulo}&quot;</span> se ocultará del sitio público y quedará archivado. Podrás eliminarlo permanentemente desde ahí.
            </p>
          </>
        )}
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 text-white text-sm font-semibold rounded-lg transition-colors ${
              esArchivado ? "bg-red-600 hover:bg-red-700" : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {esArchivado ? "Eliminar definitivamente" : "Archivar"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function AvisosAdminPage() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<Tipo | "Todos">("Todos");
  const [filtroEstado, setFiltroEstado] = useState<"Todos" | "Publicado" | "Archivado">("Todos");
  const [modalAviso, setModalAviso] = useState<Partial<Aviso> | null | false>(false);
  const [modalEliminar, setModalEliminar] = useState<Aviso | null>(null);

  const loadAvisos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/avisos?limit=50&all=1");
      if (!r.ok) throw new Error("Error al cargar avisos");
      const d = await r.json();
      setAvisos(d.avisos ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAvisos(); }, [loadAvisos]);

  async function toggleActivo(a: Aviso) {
    try {
      const r = await fetch(`/api/avisos/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !a.activo }),
      });
      if (r.ok) loadAvisos();
    } catch { /* ignore */ }
  }

  async function handleDeleteOrArchive(a: Aviso) {
    if (a.activo) {
      // Publicado → archivar (soft delete)
      try {
        const r = await fetch(`/api/avisos/${a.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activo: false }),
        });
        if (r.ok) { loadAvisos(); setModalEliminar(null); }
      } catch { /* ignore */ }
    } else {
      // Archivado → eliminar definitivamente
      try {
        const r = await fetch(`/api/avisos/${a.id}`, { method: "DELETE" });
        if (r.ok) { setAvisos((prev) => prev.filter((x) => x.id !== a.id)); setModalEliminar(null); }
      } catch { /* ignore */ }
    }
  }

  const filtrados = avisos.filter((a) => {
    if (filtroTipo !== "Todos" && a.tipo !== filtroTipo) return false;
    if (filtroEstado === "Publicado" && !a.activo) return false;
    if (filtroEstado === "Archivado" && a.activo) return false;
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      a.titulo.toLowerCase().includes(q) ||
      a.cuerpo.toLowerCase().includes(q) ||
      (a.firmado ?? "").toLowerCase().includes(q)
    );
  });

  const stats = {
    total:      avisos.length,
    publicados: avisos.filter((a) => a.activo).length,
    archivados: avisos.filter((a) => !a.activo).length,
    urgentes:   avisos.filter((a) => a.tipo === "urgente" && a.activo).length,
  };

  const fechaDisplay = (f: string | null) =>
    f ? new Date(f).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador"
        activeTopLink="avisos"
        showSearch
        linkBase={BASE}
      />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="avisos" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          {/* Encabezado */}
          <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Avisos</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Gestión de comunicados institucionales. Los cambios se reflejan inmediatamente en el sitio público.
              </p>
            </div>
            <button
              onClick={() => setModalAviso({})}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Nuevo aviso
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Total avisos",     val: stats.total,      color: "text-slate-700",  bg: "bg-slate-50 dark:bg-slate-800" },
              { label: "Publicados",       val: stats.publicados, color: "text-green-700",  bg: "bg-green-50 dark:bg-green-900/20" },
              { label: "Archivados",       val: stats.archivados, color: "text-slate-500",  bg: "bg-slate-100 dark:bg-slate-800" },
              { label: "Urgentes activos", val: stats.urgentes,   color: "text-red-700",    bg: "bg-red-50 dark:bg-red-900/20" },
            ].map(({ label, val, color, bg }) => (
              <div key={label} className={`${bg} border border-slate-200 dark:border-slate-700 rounded-xl p-3`}>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{val}</p>
              </div>
            ))}
          </div>

          {/* Filtros y lista */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-2 items-start sm:items-center flex-wrap">
              {/* Búsqueda */}
              <div className="relative w-full sm:w-64">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar aviso..."
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                />
              </div>
              {/* Filtro tipo */}
              <div className="flex gap-1.5 flex-wrap">
                {(["Todos", ...TIPOS] as (Tipo | "Todos")[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFiltroTipo(t)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${filtroTipo === t ? "bg-blue-700 text-white border-blue-700" : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                  >
                    {t === "Todos" ? "Todos" : TIPO_LABEL[t as Tipo]}
                  </button>
                ))}
              </div>
              {/* Filtro estado */}
              <div className="flex gap-1.5 flex-wrap">
                {(["Todos", "Publicado", "Archivado"] as const).map((e) => (
                  <button
                    key={e}
                    onClick={() => setFiltroEstado(e)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${filtroEstado === e ? "bg-slate-700 text-white border-slate-700" : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de avisos */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <div className="py-12 text-center text-sm text-slate-400">Cargando avisos...</div>
              ) : filtrados.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">No se encontraron avisos con los filtros actuales.</div>
              ) : filtrados.map((a) => (
                <div key={a.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  {a.fotos[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.fotos[0]} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${TIPO_COLORS[a.tipo]}`}>{TIPO_LABEL[a.tipo] ?? a.tipo}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${a.activo ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                        {a.activo ? "Publicado" : "Archivado"}
                      </span>
                      {a.firmado && <span className="text-[11px] text-slate-400">— {a.firmado}</span>}
                    </div>
                    <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{a.titulo}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{a.cuerpo}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{fechaDisplay(a.fecha_publicacion)}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Publicar / Archivar */}
                    <button
                      onClick={() => toggleActivo(a)}
                      title={a.activo ? "Archivar" : "Publicar"}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${a.activo ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30" : "text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30"}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        {a.activo
                          ? <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/>
                          : <path d="M20.55 5.22l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.15.55L3.46 5.22C3.17 5.57 3 6.01 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.49-.17-.93-.45-1.28zM12 9.5l5.5 5.5H14v2h-4v-2H6.5L12 9.5zM5.12 5l.82-1h12l.93 1H5.12z"/>
                        }
                      </svg>
                    </button>
                    {/* Editar */}
                    <button
                      onClick={() => setModalAviso(a)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </button>
                    {/* Eliminar */}
                    <button
                      onClick={() => setModalEliminar(a)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
              Mostrando {filtrados.length} de {avisos.length} avisos
            </div>
          </div>
        </main>
      </div>

      {modalAviso !== false && (
        <ModalAviso
          aviso={modalAviso}
          onClose={() => setModalAviso(false)}
          onSaved={loadAvisos}
        />
      )}
      {modalEliminar && (
        <ModalEliminar
          titulo={modalEliminar.titulo}
          esArchivado={!modalEliminar.activo}
          onClose={() => setModalEliminar(null)}
          onConfirm={() => handleDeleteOrArchive(modalEliminar)}
        />
      )}
    </>
  );
}
