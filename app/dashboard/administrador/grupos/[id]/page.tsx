"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

interface Asignacion {
  id: string;
  ciclo_id: string;
  materia: { id: string; nombre: string; clave: string; semestre: number };
  maestro: {
    id: string;
    usuarios: { id: string; nombre: string; apellido_paterno: string; apellido_materno: string }[];
  };
  ciclo: { id: string; nombre: string };
}

interface Materia { id: string; nombre: string; clave: string; semestre: number; }
interface Maestro { id: string; nombre: string; apellido_paterno: string; apellido_materno: string; }
interface Ciclo   { id: string; nombre: string; activo: boolean; }
interface Grupo   { id: string; nombre: string; semestre: number; turno: string; ciclo: { id: string; nombre: string }; carrera: { nombre: string; clave: string }; }

function nombreMaestro(m: Asignacion["maestro"] | undefined | null): string {
  if (!m) return "Sin maestro";
  const u = Array.isArray(m.usuarios) ? m.usuarios[0] : null;
  if (!u) return "Sin maestro";
  return [u.apellido_paterno, u.apellido_materno, u.nombre].filter(Boolean).join(" ");
}

// ─── Modal Asignar Materia/Maestro ───────────────────────────────────────────
function AsignarModal({
  grupo,
  onClose,
  onCreated,
}: {
  grupo: Grupo;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [maestros, setMaestros] = useState<Maestro[]>([]);
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ materia_id: "", maestro_id: "", ciclo_id: "" });

  useEffect(() => {
    // Cargar materias del mismo semestre del grupo
    fetch(`/api/materias?semestre=${grupo.semestre}`)
      .then((r) => r.json())
      .then((d) => setMaterias(d.materias ?? []));
    // Cargar maestros
    fetch("/api/admin/usuarios?rol=maestro&limit=200")
      .then((r) => r.json())
      .then((d) => setMaestros(
        (d.usuarios ?? []).map((u: { id: string; nombre: string; apellido_paterno: string; apellido_materno: string }) => u)
      ));
    // Cargar ciclos
    fetch("/api/admin/ciclos")
      .then((r) => r.json())
      .then((d) => {
        const cs: Ciclo[] = d.ciclos ?? [];
        setCiclos(cs);
        const activo = cs.find((c) => c.activo);
        if (activo) setForm((f) => ({ ...f, ciclo_id: activo.id }));
      });
  }, [grupo.semestre]);

  const inp = "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300";
  const lbl = "text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1";

  async function handleGuardar() {
    setError("");
    if (!form.materia_id || !form.maestro_id || !form.ciclo_id) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/grupo-materia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grupo_id: grupo.id,
          materia_id: form.materia_id,
          maestro_id: form.maestro_id,
          ciclo_id: form.ciclo_id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al crear asignación");
        return;
      }
      onCreated();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Asignar Materia y Maestro</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {error && <p className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>}
          <p className="text-sm text-slate-500">Grupo: <strong className="text-slate-800 dark:text-slate-100">{grupo.nombre}</strong> — Semestre {grupo.semestre}</p>

          <div>
            <label className={lbl}>Materia *</label>
            <select className={inp} value={form.materia_id}
              onChange={(e) => setForm((f) => ({ ...f, materia_id: e.target.value }))}>
              <option value="">— Selecciona materia —</option>
              {materias.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre} ({m.clave}) — S{m.semestre}</option>
              ))}
            </select>
            {materias.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">No hay materias para el semestre {grupo.semestre}. Agrégalas en la base de datos.</p>
            )}
          </div>

          <div>
            <label className={lbl}>Maestro *</label>
            <select className={inp} value={form.maestro_id}
              onChange={(e) => setForm((f) => ({ ...f, maestro_id: e.target.value }))}>
              <option value="">— Selecciona maestro —</option>
              {maestros.map((m) => (
                <option key={m.id} value={m.id}>
                  {[m.apellido_paterno, m.apellido_materno, m.nombre].filter(Boolean).join(" ")}
                </option>
              ))}
            </select>
            {maestros.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">No hay maestros registrados. Crea usuarios con rol &quot;maestro&quot; primero.</p>
            )}
          </div>

          <div>
            <label className={lbl}>Ciclo escolar *</label>
            <select className={inp} value={form.ciclo_id}
              onChange={(e) => setForm((f) => ({ ...f, ciclo_id: e.target.value }))}>
              <option value="">— Selecciona ciclo —</option>
              {ciclos.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}{c.activo ? " (activo)" : ""}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            Cancelar
          </button>
          <button onClick={handleGuardar} disabled={saving}
            className="px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors">
            {saving ? "Guardando..." : "Asignar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function GrupoDetallePage() {
  const params = useParams();
  const grupoId = typeof params?.id === "string" ? params.id : "";

  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAsignar, setModalAsignar] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  const fetchGrupo = useCallback(async () => {
    if (!grupoId) return;
    const res = await fetch(`/api/grupos?id=${grupoId}`);
    const d = await res.json();
    const g = (d.grupos ?? [])[0] ?? null;
    setGrupo(g);
  }, [grupoId]);

  const fetchAsignaciones = useCallback(async () => {
    if (!grupoId) return;
    setLoading(true);
    const res = await fetch(`/api/admin/grupo-materia?grupo_id=${grupoId}`);
    const d = await res.json();
    setAsignaciones(d.asignaciones ?? []);
    setLoading(false);
  }, [grupoId]);

  useEffect(() => {
    fetchGrupo();
    fetchAsignaciones();
  }, [fetchGrupo, fetchAsignaciones]);

  async function handleEliminar(id: string) {
    if (!confirm("¿Eliminar esta asignación? El maestro ya no verá este grupo/materia.")) return;
    setDeletingId(id);
    setMsg(null);
    const res = await fetch(`/api/admin/grupo-materia?id=${id}`, { method: "DELETE" });
    const d = await res.json();
    if (res.ok) {
      setMsg({ tipo: "ok", texto: "Asignación eliminada." });
      fetchAsignaciones();
    } else {
      setMsg({ tipo: "error", texto: d.error ?? "Error al eliminar." });
    }
    setDeletingId(null);
  }

  return (
    <>
      {modalAsignar && grupo && (
        <AsignarModal
          grupo={grupo}
          onClose={() => setModalAsignar(false)}
          onCreated={() => { fetchAsignaciones(); setMsg({ tipo: "ok", texto: "Materia asignada correctamente." }); }}
        />
      )}

      <DashboardTopbar userImageAlt="Administrador" linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="grupos" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <a href={`${BASE}/grupos`} className="hover:text-blue-600 transition-colors">Grupos</a>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">{grupo?.nombre ?? "Cargando..."}</span>
          </div>

          {/* Encabezado */}
          {grupo && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{grupo.nombre}</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {grupo.carrera.nombre} ({grupo.carrera.clave}) · Semestre {grupo.semestre} · Turno {grupo.turno} · {grupo.ciclo.nombre}
                  </p>
                </div>
                <button
                  onClick={() => { setMsg(null); setModalAsignar(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Asignar Materia / Maestro
                </button>
              </div>
            </div>
          )}

          {msg && (
            <div className={`mb-4 p-3 rounded-lg border text-sm ${msg.tipo === "ok" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
              {msg.texto}
            </div>
          )}

          {/* Lista de asignaciones */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Materias y Maestros Asignados</h3>
              <span className="text-xs text-slate-500">{asignaciones.length} asignaciones</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm text-slate-400">Cargando asignaciones...</div>
            ) : asignaciones.length === 0 ? (
              <div className="p-10 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">school</span>
                <p className="text-slate-500 font-medium">Este grupo no tiene materias asignadas aún.</p>
                <p className="text-sm text-slate-400 mt-1">Usa el botón &quot;Asignar Materia / Maestro&quot; para comenzar.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[560px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="px-4 py-2.5 text-left border-b border-slate-200 dark:border-slate-700">Materia</th>
                      <th className="px-4 py-2.5 text-left border-b border-slate-200 dark:border-slate-700">Clave</th>
                      <th className="px-4 py-2.5 text-left border-b border-slate-200 dark:border-slate-700">Maestro</th>
                      <th className="px-4 py-2.5 text-left border-b border-slate-200 dark:border-slate-700">Ciclo</th>
                      <th className="px-4 py-2.5 text-center border-b border-slate-200 dark:border-slate-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asignaciones.map((a, i) => (
                      <tr key={a.id} className={`border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${i % 2 === 1 ? "bg-slate-50/50 dark:bg-slate-800/20" : ""}`}>
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{a.materia?.nombre ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                            {a.materia?.clave ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{nombreMaestro(a.maestro)}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{a.ciclo?.nombre ?? "—"}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleEliminar(a.id)}
                            disabled={deletingId === a.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-700 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-xs">delete</span>
                            {deletingId === a.id ? "..." : "Eliminar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Nota: Al asignar una materia a un maestro, el maestro podrá ver este grupo en su panel de calificaciones y asistencias.
          </p>
        </main>
      </div>
    </>
  );
}
