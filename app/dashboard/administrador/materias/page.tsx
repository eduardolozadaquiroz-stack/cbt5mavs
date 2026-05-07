"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Materia {
  id: string;
  nombre: string;
  clave: string;
  semestre: number;
  creditos: number;
  horas_semanales: number;
  tipo: string;
  carrera_id: string | null;
  descripcion: string | null;
  activa: boolean;
}
interface Carrera { id: string; nombre: string; clave: string; }

const TIPOS = [
  { value: "tronco_comun",     label: "Tronco Común" },
  { value: "especifica",       label: "Específica" },
  { value: "extracurricular",  label: "Extracurricular" },
];

function tipoLabel(t: string) {
  return TIPOS.find(x => x.value === t)?.label ?? t;
}
function tipoBadge(t: string) {
  if (t === "tronco_comun")    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200";
  if (t === "especifica")      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200";
  return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
}

// ─── Estilos compartidos ──────────────────────────────────────────────────────
const inp = "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300";
const lbl = "text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1";

// ─── Modal Crear / Editar ─────────────────────────────────────────────────────
function MateriaModal({
  materia,
  carreras,
  onClose,
  onSaved,
}: {
  materia?: Materia;
  carreras: Carrera[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");
  const [form, setForm] = useState({
    nombre:          materia?.nombre          ?? "",
    clave:           materia?.clave           ?? "",
    semestre:        String(materia?.semestre ?? "1"),
    creditos:        String(materia?.creditos ?? "5"),
    horas_semanales: String(materia?.horas_semanales ?? "4"),
    tipo:            materia?.tipo            ?? "tronco_comun",
    carrera_id:      materia?.carrera_id      ?? "",
    descripcion:     materia?.descripcion     ?? "",
  });

  const setF = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleGuardar() {
    setError("");
    if (!form.nombre.trim()) { setError("El nombre es obligatorio."); return; }
    if (!form.clave.trim())  { setError("La clave es obligatoria."); return; }
    const sem = parseInt(form.semestre, 10);
    if (isNaN(sem) || sem < 1 || sem > 6) { setError("Semestre debe ser 1–6."); return; }

    setSaving(true);
    try {
      const payload = {
        ...(materia ? { id: materia.id } : {}),
        nombre:          form.nombre.trim(),
        clave:           form.clave.trim().toUpperCase(),
        semestre:        sem,
        creditos:        parseInt(form.creditos, 10) || 5,
        horas_semanales: parseInt(form.horas_semanales, 10) || 4,
        tipo:            form.tipo,
        carrera_id:      form.carrera_id || null,
        descripcion:     form.descripcion.trim() || null,
      };
      const res = await fetch("/api/materias", {
        method: materia ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Error al guardar"); return; }
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {materia ? "Editar Materia" : "Nueva Materia"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-2xl leading-none">&times;</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <p className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <div>
            <label className={lbl}>Nombre *</label>
            <input className={inp} placeholder="Ej: Álgebra Lineal" value={form.nombre}
              onChange={e => setF("nombre", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Clave *</label>
              <input className={inp} placeholder="Ej: INFO-101" value={form.clave}
                onChange={e => setF("clave", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Semestre *</label>
              <select className={inp} value={form.semestre} onChange={e => setF("semestre", e.target.value)}>
                {[1,2,3,4,5,6].map(s => <option key={s} value={s}>{s}° Semestre</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Créditos</label>
              <input type="number" min={1} max={20} className={inp} value={form.creditos}
                onChange={e => setF("creditos", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Horas por semana</label>
              <input type="number" min={1} max={20} className={inp} value={form.horas_semanales}
                onChange={e => setF("horas_semanales", e.target.value)} />
            </div>
          </div>

          <div>
            <label className={lbl}>Tipo</label>
            <select className={inp} value={form.tipo} onChange={e => setF("tipo", e.target.value)}>
              {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div>
            <label className={lbl}>Carrera (vacío = Tronco Común)</label>
            <select className={inp} value={form.carrera_id} onChange={e => setF("carrera_id", e.target.value)}>
              <option value="">— Tronco Común (todas las carreras) —</option>
              {carreras.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.clave})</option>)}
            </select>
          </div>

          <div>
            <label className={lbl}>Descripción</label>
            <textarea rows={2} className={inp + " resize-none"} placeholder="Descripción breve de la materia…"
              value={form.descripcion} onChange={e => setF("descripcion", e.target.value)} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-5">
          <button onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Cancelar
          </button>
          <button onClick={handleGuardar} disabled={saving}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50">
            {saving ? "Guardando…" : (materia ? "Guardar cambios" : "Crear Materia")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function MateriasPage() {
  const [materias,  setMaterias]  = useState<Materia[]>([]);
  const [carreras,  setCarreras]  = useState<Carrera[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando,  setEditando]  = useState<Materia | undefined>(undefined);
  const [confirmar, setConfirmar] = useState<Materia | null>(null);
  const [msg,       setMsg]       = useState("");

  // ── Filtros ──
  const [filtroCarrera,  setFiltroCarrera]  = useState("");
  const [filtroSemestre, setFiltroSemestre] = useState("");
  const [filtroTipo,     setFiltroTipo]     = useState("");
  const [mostrarInact,   setMostrarInact]   = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [rm, rc] = await Promise.all([
        fetch(`/api/materias?incluir_inactivas=true`).then(r => r.json()),
        fetch(`/api/carreras`).then(r => r.json()),
      ]);
      setMaterias(rm.materias ?? []);
      setCarreras(rc.carreras ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  async function toggleActiva(m: Materia) {
    const method = m.activa ? "DELETE" : "PATCH";
    const body   = m.activa ? null : JSON.stringify({ id: m.id, activa: true });
    const url    = m.activa ? `/api/materias?id=${m.id}` : `/api/materias`;
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ?? undefined,
    });
    if (res.ok) {
      setMsg(m.activa ? "Materia desactivada." : "Materia reactivada.");
      cargar();
      setConfirmar(null);
    }
  }

  function abrirNueva() { setEditando(undefined); setModalOpen(true); }
  function abrirEditar(m: Materia) { setEditando(m); setModalOpen(true); }

  // ── Filtrado local ──
  const lista = materias.filter(m => {
    if (!mostrarInact && !m.activa) return false;
    if (filtroCarrera  && m.carrera_id  !== filtroCarrera)  return false;
    if (filtroSemestre && String(m.semestre) !== filtroSemestre) return false;
    if (filtroTipo     && m.tipo        !== filtroTipo)     return false;
    return true;
  });

  const carreraName = (id: string | null) => {
    if (!id) return "Tronco Común";
    return carreras.find(c => c.id === id)?.nombre ?? "—";
  };

  return (
    <>
      <DashboardTopbar userImageAlt="Administrador" activeTopLink="materias" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="materias" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6">

          {/* Notificación */}
          {msg && (
            <div className="mb-4 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm flex items-center justify-between">
              <span>{msg}</span>
              <button onClick={() => setMsg("")} className="text-green-500 hover:text-green-700 ml-4">&times;</button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Catálogo de Materias</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {loading ? "Cargando…" : `${lista.length} materia${lista.length !== 1 ? "s" : ""} encontrada${lista.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <button onClick={abrirNueva}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Nueva Materia
            </button>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-5">
            <select className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500"
              value={filtroCarrera} onChange={e => setFiltroCarrera(e.target.value)}>
              <option value="">Todas las carreras</option>
              <option value="__tc">Solo Tronco Común</option>
              {carreras.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>

            <select className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500"
              value={filtroSemestre} onChange={e => setFiltroSemestre(e.target.value)}>
              <option value="">Todos los semestres</option>
              {[1,2,3,4,5,6].map(s => <option key={s} value={s}>{s}° Semestre</option>)}
            </select>

            <select className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500"
              value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
              <option value="">Todos los tipos</option>
              {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>

            <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm cursor-pointer col-span-1">
              <input type="checkbox" checked={mostrarInact} onChange={e => setMostrarInact(e.target.checked)}
                className="rounded" />
              Incluir inactivas
            </label>
          </div>

          {/* Tabla */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Materia</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Clave</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sem.</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Créd.</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Hrs/Sem</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Tipo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Carrera</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-10 text-center text-slate-400 text-sm">Cargando materias…</td>
                    </tr>
                  ) : lista.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-10 text-center text-slate-400 text-sm">
                        No hay materias que coincidan con los filtros.
                        {materias.length === 0 && (
                          <span className="block mt-1 text-blue-600 dark:text-blue-400 text-xs">
                            Haz clic en &quot;Nueva Materia&quot; para agregar la primera.
                          </span>
                        )}
                      </td>
                    </tr>
                  ) : (
                    lista.map(m => (
                      <tr key={m.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!m.activa ? "opacity-50" : ""}`}>
                        <td className="px-4 py-3">
                          <span className="font-medium text-slate-900 dark:text-slate-100">{m.nombre}</span>
                          {m.descripcion && (
                            <p className="text-xs text-slate-400 truncate max-w-[200px]">{m.descripcion}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded font-mono">{m.clave}</code>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{m.semestre}°</td>
                        <td className="px-4 py-3 text-center text-slate-500 hidden sm:table-cell">{m.creditos}</td>
                        <td className="px-4 py-3 text-center text-slate-500 hidden md:table-cell">{m.horas_semanales}h</td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${tipoBadge(m.tipo)}`}>
                            {tipoLabel(m.tipo)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">{carreraName(m.carrera_id)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block w-2 h-2 rounded-full ${m.activa ? "bg-green-500" : "bg-slate-300"}`} title={m.activa ? "Activa" : "Inactiva"} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => abrirEditar(m)}
                              className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
                              Editar
                            </button>
                            <button onClick={() => setConfirmar(m)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                m.activa
                                  ? "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400"
                                  : "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400"
                              }`}>
                              {m.activa ? "Desactivar" : "Activar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen por semestre */}
          {!loading && materias.filter(m => m.activa).length > 0 && (
            <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[1,2,3,4,5,6].map(s => {
                const count = materias.filter(m => m.activa && m.semestre === s).length;
                return (
                  <div key={s} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{count}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s}° Sem.</p>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>

      {/* Modal crear/editar */}
      {modalOpen && (
        <MateriaModal
          materia={editando}
          carreras={carreras}
          onClose={() => setModalOpen(false)}
          onSaved={cargar}
        />
      )}

      {/* Confirmar toggle activa */}
      {confirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              {confirmar.activa ? "Desactivar materia" : "Reactivar materia"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              {confirmar.activa
                ? `"${confirmar.nombre}" quedará inactiva y no aparecerá al asignar a grupos nuevos.`
                : `"${confirmar.nombre}" volverá a estar disponible para asignar a grupos.`}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmar(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Cancelar
              </button>
              <button onClick={() => toggleActiva(confirmar)}
                className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors ${
                  confirmar.activa ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}>
                {confirmar.activa ? "Desactivar" : "Reactivar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
