"use client";

import { useState, useRef } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useAdminConfig } from "@/app/context/AdminConfigContext";

const BASE = "/dashboard/administrador";

type Tipo = "Urgente" | "Académico" | "Administrativo" | "Institucional" | "Sistema";
type Estado = "Publicado" | "Borrador" | "Archivado";

interface Aviso {
  id: number;
  titulo: string;
  tipo: Tipo;
  estado: Estado;
  destinatario: string;
  fecha: string;
  contenido: string;
  fotos: string[];
}

const TIPO_COLORS: Record<Tipo, string> = {
  Urgente:        "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  Académico:      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Administrativo: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  Institucional:  "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  Sistema:        "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

const ESTADO_COLORS: Record<Estado, string> = {
  Publicado: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  Borrador:  "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  Archivado: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const avisosIniciales: Aviso[] = [
  { id: 1, titulo: "Cierre de captura de calificaciones — Parcial 2",  tipo: "Urgente",        estado: "Publicado",  destinatario: "Todos",    fecha: "2026-05-03", contenido: "El cierre de captura será el 3 de mayo a las 14:00 hrs. No habrá prórroga.",                                                             fotos: [] },
  { id: 2, titulo: "Resultados Parcial 2 disponibles en portal",       tipo: "Académico",      estado: "Publicado",  destinatario: "Alumnos",  fecha: "2026-04-30", contenido: "Los alumnos pueden consultar sus calificaciones del segundo parcial en el portal estudiantil.",                                          fotos: [] },
  { id: 3, titulo: "Suspensión 15 de mayo — Día del Maestro",          tipo: "Institucional",  estado: "Publicado",  destinatario: "Todos",    fecha: "2026-04-28", contenido: "En conmemoración del Día del Maestro, no habrá clases el próximo 15 de mayo.",                                                            fotos: [] },
  { id: 4, titulo: "Actualización de datos en SIGEEMS",                tipo: "Administrativo", estado: "Publicado",  destinatario: "Maestros", fecha: "2026-04-25", contenido: "Todos los maestros deben actualizar sus datos personales en SIGEEMS antes del 30 de abril.",                                             fotos: [] },
  { id: 5, titulo: "Borrador: Evento de fin de curso",                 tipo: "Institucional",  estado: "Borrador",   destinatario: "Todos",    fecha: "2026-04-20", contenido: "Propuesta de evento de graduación sujeta a aprobación de dirección.",                                                                  fotos: [] },
  { id: 6, titulo: "Mantenimiento de red — 22 abr",                    tipo: "Sistema",        estado: "Archivado",  destinatario: "Todos",    fecha: "2026-04-22", contenido: "Mantenimiento preventivo de infraestructura de red completado.",                                                                          fotos: [] },
];

const TIPOS: Tipo[] = ["Urgente", "Académico", "Administrativo", "Institucional", "Sistema"];
const ESTADOS: Estado[] = ["Publicado", "Borrador", "Archivado"];
const DEST = ["Todos", "Alumnos", "Maestros", "Admins"];

// ── Modal crear / editar aviso ────────────────────────────────────────────────
function ModalAviso({ aviso, onClose, onSave }: {
  aviso: Partial<Aviso> | null;
  onClose: () => void;
  onSave: (a: Aviso) => void;
}) {
  const isEdit = !!aviso?.id;
  const [form, setForm] = useState<Omit<Aviso, "id" | "fotos">>({  
    titulo:       aviso?.titulo       ?? "",
    tipo:         aviso?.tipo         ?? "Académico",
    estado:       aviso?.estado       ?? "Borrador",
    destinatario: aviso?.destinatario ?? "Todos",
    fecha:        aviso?.fecha        ?? new Date().toISOString().slice(0, 10),
    contenido:    aviso?.contenido    ?? "",
  });
  const [fotos, setFotos] = useState<string[]>(aviso?.fotos ?? []);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState("");

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); setErr(""); }

  function readFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) setFotos((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  }

  function handleSave() {
    if (!form.titulo.trim() || !form.contenido.trim()) { setErr("El título y el contenido son obligatorios."); return; }
    onSave({ id: aviso?.id ?? Date.now(), ...form, fotos });
    onClose();
  }

  const inputBase = "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-colors";
  const labelBase = "text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">{isEdit ? "Editar aviso" : "Nuevo aviso"}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3.5">
          {/* Título */}
          <div>
            <label className={labelBase}>Título *</label>
            <input value={form.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Título del aviso..." className={inputBase} />
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
              <select value={form.estado} onChange={(e) => set("estado", e.target.value)} className={inputBase}>
                {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          {/* Destinatario + Fecha */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelBase}>Destinatario</label>
              <select value={form.destinatario} onChange={(e) => set("destinatario", e.target.value)} className={inputBase}>
                {DEST.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelBase}>Fecha</label>
              <input type="date" value={form.fecha} onChange={(e) => set("fecha", e.target.value)} className={inputBase} />
            </div>
          </div>

          {/* Contenido */}
          <div>
            <label className={labelBase}>Contenido *</label>
            <textarea
              value={form.contenido}
              onChange={(e) => set("contenido", e.target.value)}
              placeholder="Escribe el contenido del aviso..."
              rows={5}
              className={`${inputBase} resize-y`}
            />
          </div>

          {/* Fotos */}
          <div>
            <label className={labelBase}>
              Fotos{" "}
              <span className="normal-case font-normal text-slate-400">(opcional · múltiples)</span>
            </label>
            {/* Zona de carga */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); readFiles(e.dataTransfer.files); }}
              className={`mt-1 border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                dragOver
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30"
                  : "border-slate-200 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/20"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-slate-400">
                <path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 14H4V7h4.05l1.83-2h4.24l1.83 2H20v12zM12 8c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
              </svg>
              <p className="text-xs text-slate-500 dark:text-slate-400">Haz clic o arrastra fotos aquí</p>
              <p className="text-[10px] text-slate-400">JPG, PNG, GIF, WEBP — sin límite de archivos</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => readFiles(e.target.files)}
            />

            {/* Cuadrícula de previsualizaciones */}
            {fotos.length > 0 && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {fotos.map((src, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFotos((f) => f.filter((_, j) => j !== i))}
                      title="Quitar foto"
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {fotos.length > 0 && (
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[11px] text-slate-400">
                  {fotos.length} foto{fotos.length !== 1 ? "s" : ""} adjunta{fotos.length !== 1 ? "s" : ""}
                </p>
                <button
                  type="button"
                  onClick={() => setFotos([])}
                  className="text-[11px] text-red-500 hover:underline"
                >
                  Quitar todas
                </button>
              </div>
            )}
          </div>

          {err && <p className="text-xs text-red-600">{err}</p>}
        </div>

        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancelar</button>
          {form.estado !== "Publicado" && (
            <button onClick={() => { set("estado", "Publicado"); }} className="px-4 py-2 rounded-lg border border-green-300 text-green-700 text-sm font-medium hover:bg-green-50 transition-colors">Publicar</button>
          )}
          <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors">{isEdit ? "Guardar cambios" : "Crear aviso"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Modal confirmación de eliminación ────────────────────────────────────────
function ModalEliminar({ titulo, onClose, onConfirm }: { titulo: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm p-5">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600 dark:text-red-400"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-center mb-1">¿Eliminar aviso?</h3>
        <p className="text-sm text-slate-500 text-center mb-4">«{titulo}» será eliminado permanentemente.</p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">Eliminar</button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────────────────────
export default function AvisosPage() {
  const { config, addAviso, updateAviso, deleteAviso, updateSectionEnabled } = useAdminConfig();
  const [query, setQuery] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<Tipo | "Todos">("Todos");
  const [filtroEstado, setFiltroEstado] = useState<Estado | "Todos">("Todos");
  const [modalAviso, setModalAviso] = useState<Partial<Aviso> | null | false>(false);
  const [modalEliminar, setModalEliminar] = useState<Aviso | null>(null);

  const filtrados = config.avisos.filter((a) => {
    const q = query.toLowerCase();
    const coincide = a.titulo.toLowerCase().includes(q) || a.destinatario.toLowerCase().includes(q);
    const tipo     = filtroTipo   === "Todos" || a.tipo   === filtroTipo;
    const estado   = filtroEstado === "Todos" || a.estado === filtroEstado;
    return coincide && tipo && estado;
  });

  function saveAviso(a: Aviso) {
    if (a.id && config.avisos.some((x) => x.id === a.id)) {
      updateAviso(a.id, a);
    } else {
      addAviso({ ...a, id: a.id || Date.now() });
    }
  }

  function toggleEstado(a: Aviso) {
    const next: Estado = a.estado === "Publicado" ? "Archivado" : "Publicado";
    updateAviso(a.id, { estado: next });
  }

  const stats = {
    total:      config.avisos.length,
    publicados: config.avisos.filter((a) => a.estado === "Publicado").length,
    borradores: config.avisos.filter((a) => a.estado === "Borrador").length,
    urgentes:   config.avisos.filter((a) => a.tipo === "Urgente" && a.estado === "Publicado").length,
  };

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador" userName="Mtra. Viderique" userRole="Administradora"
        activeTopLink="avisos" showSearch linkBase={BASE}
      />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="inicio" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          {/* Encabezado */}
          <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Avisos</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Gestión de comunicados institucionales. Los cambios se reflejan inmediatamente en el sitio público.</p>
            </div>
            <button
              onClick={() => setModalAviso({})}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Nuevo aviso
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Total avisos",    val: stats.total,      color: "text-slate-700",  bg: "bg-slate-50 dark:bg-slate-800" },
              { label: "Publicados",      val: stats.publicados, color: "text-green-700",  bg: "bg-green-50 dark:bg-green-900/20" },
              { label: "Borradores",      val: stats.borradores, color: "text-amber-700",  bg: "bg-amber-50 dark:bg-amber-900/20" },
              { label: "Urgentes activos",val: stats.urgentes,   color: "text-red-700",    bg: "bg-red-50 dark:bg-red-900/20" },
            ].map(({ label, val, color, bg }) => (
              <div key={label} className={`${bg} border border-slate-200 dark:border-slate-700 rounded-xl p-3`}>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{val}</p>
              </div>
            ))}
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-2 items-start sm:items-center flex-wrap">
              {/* Búsqueda */}
              <div className="relative w-full sm:w-64">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                <input
                  type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar aviso..."
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                />
              </div>
              {/* Filtro tipo */}
              <div className="flex gap-1.5 flex-wrap">
                {(["Todos", ...TIPOS] as (Tipo | "Todos")[]).map((t) => (
                  <button key={t} onClick={() => setFiltroTipo(t)} className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${filtroTipo === t ? "bg-blue-700 text-white border-blue-700" : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>{t}</button>
                ))}
              </div>
              {/* Filtro estado */}
              <div className="flex gap-1.5 flex-wrap">
                {(["Todos", ...ESTADOS] as (Estado | "Todos")[]).map((e) => (
                  <button key={e} onClick={() => setFiltroEstado(e)} className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${filtroEstado === e ? "bg-slate-700 text-white border-slate-700" : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>{e}</button>
                ))}
              </div>
            </div>

            {/* Lista de avisos */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtrados.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">No se encontraron avisos con los filtros actuales.</div>
              ) : filtrados.map((a) => (
                <div key={a.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${TIPO_COLORS[a.tipo]}`}>{a.tipo}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${ESTADO_COLORS[a.estado]}`}>{a.estado}</span>
                      <span className="text-[11px] text-slate-400">→ {a.destinatario}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{a.titulo}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{a.contenido}</p>
                    {/* Miniaturas de fotos */}
                    {a.fotos.length > 0 && (
                      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                        {a.fotos.slice(0, 5).map((src, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={i} src={src} alt="" className="w-8 h-8 rounded object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0" />
                        ))}
                        {a.fotos.length > 5 && (
                          <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 flex-shrink-0">
                            +{a.fotos.length - 5}
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 ml-0.5">{a.fotos.length} foto{a.fotos.length !== 1 ? "s" : ""}</span>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1">{a.fecha}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Publicar / Archivar */}
                    <button
                      onClick={() => toggleEstado(a)}
                      title={a.estado === "Publicado" ? "Archivar" : "Publicar"}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${a.estado === "Publicado" ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30" : "text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30"}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        {a.estado === "Publicado"
                          /* Archivar: caja con flecha abajo */
                          ? <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/>
                          /* Publicar: caja con flecha arriba */
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
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                    </button>
                    {/* Eliminar */}
                    <button
                      onClick={() => setModalEliminar(a)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
              Mostrando {filtrados.length} de {config.avisos.length} avisos
            </div>
          </div>
        </main>
      </div>

      {modalAviso !== false && (
        <ModalAviso aviso={modalAviso} onClose={() => setModalAviso(false)} onSave={saveAviso} />
      )}
      {modalEliminar && (
        <ModalEliminar titulo={modalEliminar.titulo} onClose={() => setModalEliminar(null)} onConfirm={() => deleteAviso(modalEliminar.id)} />
      )}
    </>
  );
}
