"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

type Tipo = "Urgente" | "Académico" | "Administrativo" | "Institucional" | "Sistema";

interface Aviso {
  id: string;
  titulo: string;
  cuerpo: string;
  tipo: Tipo;
  firmado: string | null;
  fecha_publicacion: string | null;
  activo: boolean;
  imagen_url: string | null;
}

const TIPO_COLORS: Record<Tipo, string> = {
  Urgente:        "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  Académico:      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Administrativo: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  Institucional:  "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  Sistema:        "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

const TIPOS: Tipo[] = ["Urgente", "Académico", "Administrativo", "Institucional", "Sistema"];

async function uploadFoto(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("bucket", "avisos");
  fd.append("file", file);
  const r = await fetch("/api/storage/upload", { method: "POST", body: fd });
  const d = await r.json();
  if (!d.ok) throw new Error(d.error ?? "Error al subir la imagen");
  return d.url as string;
}

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
    titulo:    aviso?.titulo    ?? "",
    cuerpo:    aviso?.cuerpo    ?? "",
    tipo:      aviso?.tipo      ?? ("Académico" as Tipo),
    firmado:   aviso?.firmado   ?? "",
    activo:    aviso?.activo    ?? true,
    imagen_url: aviso?.imagen_url ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function set(k: string, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
    setErr("");
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      const url = await uploadFoto(file);
      set("imagen_url", url);
    } catch (uploadErr) {
      setErr(uploadErr instanceof Error ? uploadErr.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
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
        titulo:    form.titulo.trim(),
        cuerpo:    form.cuerpo.trim(),
        tipo:      form.tipo,
        firmado:   form.firmado.trim() || null,
        activo:    form.activo,
        imagen_url: form.imagen_url.trim() || null,
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
            <input
              value={form.titulo}
              onChange={(e) => set("titulo", e.target.value)}
              placeholder="Título del aviso..."
              className={inputBase}
            />
          </div>

          {/* Tipo + Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelBase}>Tipo</label>
              <select value={form.tipo} onChange={(e) => set("tipo", e.target.value)} className={inputBase}>
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
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
            <textarea
              value={form.cuerpo}
              onChange={(e) => set("cuerpo", e.target.value)}
              placeholder="Escribe el contenido del aviso..."
              rows={5}
              className={`${inputBase} resize-y`}
            />
          </div>

          {/* Imagen */}
          <div>
            <label className={labelBase}>
              Imagen{" "}
              <span className="normal-case font-normal text-slate-400">(opcional)</span>
            </label>
            {form.imagen_url && (
              <div className="mb-2 relative rounded-lg overflow-hidden h-36 bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imagen_url} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => set("imagen_url", "")}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={form.imagen_url}
                onChange={(e) => set("imagen_url", e.target.value)}
                placeholder="URL de imagen o sube desde tu dispositivo"
                className={inputBase}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="flex-shrink-0 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {uploading ? "Subiendo..." : "📁 Subir"}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
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
  onClose,
  onConfirm,
}: {
  titulo: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm p-5">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">¿Eliminar aviso?</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Se eliminará <span className="font-medium text-slate-700 dark:text-slate-200">"{titulo}"</span>. Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Eliminar
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

  async function deleteAviso(id: string) {
    try {
      const r = await fetch(`/api/avisos/${id}`, { method: "DELETE" });
      if (r.ok) {
        setAvisos((prev) => prev.filter((a) => a.id !== id));
        setModalEliminar(null);
      }
    } catch { /* ignore */ }
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
    urgentes:   avisos.filter((a) => a.tipo === "Urgente" && a.activo).length,
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
        <DashboardSidebar activeLink="inicio" headerVariant="school-icon" linkBase={BASE} />
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
                    {t}
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
                  {a.imagen_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.imagen_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${TIPO_COLORS[a.tipo]}`}>{a.tipo}</span>
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
          onClose={() => setModalEliminar(null)}
          onConfirm={() => deleteAviso(modalEliminar.id)}
        />
      )}
    </>
  );
}
