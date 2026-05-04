"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface GrupoMaestro {
  id: string;
  nombre: string;
  materias: string[];
  alumnos: AlumnoGrupo[];
}

interface AlumnoGrupo {
  alumno_id: string;
  matricula: string;
  nombre: string;
  promedio_general: number | null;
}

interface CalificacionExistente {
  alumno_id: string;
  parcial: number;
  calificacion: number;
  materia: { nombre: string };
}

// Materias con ids (cargamos del horario)
interface HorarioSlot {
  materia: { id: string; nombre: string };
  grupo: { id: string } | null;
}

export default function CalificacionesMaestroPage() {
  const [grupos, setGrupos] = useState<GrupoMaestro[]>([]);
  const [grupoId, setGrupoId] = useState("");
  const [materias, setMaterias] = useState<{ id: string; nombre: string }[]>([]);
  const [materiaId, setMateriaId] = useState("");
  const [parcial, setParcial] = useState(1);
  const [alumnos, setAlumnos] = useState<AlumnoGrupo[]>([]);
  const [calificaciones, setCalificaciones] = useState<Record<string, string>>({});
  const [existentes, setExistentes] = useState<CalificacionExistente[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  // Cargar grupos del maestro
  useEffect(() => {
    fetch("/api/maestro/mis-grupos")
      .then((r) => r.json())
      .then((d) => {
        const gs: GrupoMaestro[] = d.grupos ?? [];
        setGrupos(gs);
        if (gs.length > 0) setGrupoId(gs[0].id);
        setLoading(false);
      });
  }, []);

  // Cargar materias y alumnos cuando cambia grupo
  useEffect(() => {
    if (!grupoId) return;
    const g = grupos.find((x) => x.id === grupoId);
    setAlumnos(g?.alumnos ?? []);
    setCalificaciones({});

    // Cargar materias del grupo desde horarios
    fetch(`/api/horarios?grupo_id=${grupoId}`)
      .then((r) => r.json())
      .then((d) => {
        const slots: HorarioSlot[] = d.horarios ?? [];
        const matMap = new Map<string, string>();
        slots.forEach((s) => {
          if (s.materia && s.grupo?.id === grupoId) {
            matMap.set(s.materia.id, s.materia.nombre);
          }
        });
        const mats = [...matMap.entries()].map(([id, nombre]) => ({ id, nombre }));
        setMaterias(mats);
        if (mats.length > 0) setMateriaId(mats[0].id);
      });
  }, [grupoId, grupos]);

  // Cargar calificaciones existentes cuando cambia materia/parcial
  useEffect(() => {
    if (!materiaId || !grupoId) return;
    fetch(`/api/calificaciones?grupo_id=${grupoId}&materia_id=${materiaId}&parcial=${parcial}`)
      .then((r) => r.json())
      .then((d) => {
        const cals: CalificacionExistente[] = d.calificaciones ?? [];
        setExistentes(cals);
        const pre: Record<string, string> = {};
        cals.forEach((c) => {
          pre[c.alumno_id] = String(c.calificacion);
        });
        setCalificaciones(pre);
      });
  }, [materiaId, parcial, grupoId]);

  async function guardar() {
    if (!grupoId || !materiaId) return;
    setSaving(true);
    setMsg(null);
    try {
      const body = alumnos
        .filter((a) => calificaciones[a.alumno_id] !== undefined && calificaciones[a.alumno_id] !== "")
        .map((a) => ({
          alumno_id: a.alumno_id,
          grupo_id: grupoId,
          materia_id: materiaId,
          parcial,
          calificacion: parseFloat(calificaciones[a.alumno_id]),
        }));
      const res = await fetch("/api/calificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calificaciones: body }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ tipo: "ok", texto: "Calificaciones guardadas correctamente." });
      } else {
        setMsg({ tipo: "error", texto: data.error ?? "Error al guardar." });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DashboardTopbar userImageAlt="Maestro" linkBase="/dashboard/maestro" />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="calificaciones" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[1280px] mx-auto p-md lg:p-lg">

            <div className="mb-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-background">Captura de Calificaciones</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Selecciona grupo, materia y parcial.</p>
              </div>
              <button
                onClick={guardar}
                disabled={saving || !grupoId || !materiaId}
                className="px-4 py-2 bg-primary text-on-primary font-label-bold text-label-bold rounded hover:bg-primary-container shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                {saving ? "Guardando…" : "Guardar Calificaciones"}
              </button>
            </div>

            {msg && (
              <div className={`mb-md p-sm rounded border text-sm ${msg.tipo === "ok" ? "bg-surface-container-high text-primary border-primary/20" : "bg-error-container text-on-error-container border-error/20"}`}>
                {msg.texto}
              </div>
            )}

            {/* Selectores */}
            <div className="bg-white border border-outline-variant rounded-lg p-md mb-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant uppercase" htmlFor="grupo-sel">Grupo</label>
                  <select
                    id="grupo-sel"
                    className="w-full border border-outline-variant rounded px-3 py-2 bg-surface-container-lowest focus:outline-none focus:border-primary"
                    value={grupoId}
                    onChange={(e) => setGrupoId(e.target.value)}
                    disabled={loading}
                  >
                    {grupos.map((g) => (
                      <option key={g.id} value={g.id}>{g.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant uppercase" htmlFor="materia-sel">Materia</label>
                  <select
                    id="materia-sel"
                    className="w-full border border-outline-variant rounded px-3 py-2 bg-surface-container-lowest focus:outline-none focus:border-primary"
                    value={materiaId}
                    onChange={(e) => setMateriaId(e.target.value)}
                    disabled={materias.length === 0}
                  >
                    {materias.map((m) => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant uppercase" htmlFor="parcial-sel">Parcial</label>
                  <select
                    id="parcial-sel"
                    className="w-full border border-outline-variant rounded px-3 py-2 bg-surface-container-lowest focus:outline-none focus:border-primary"
                    value={parcial}
                    onChange={(e) => setParcial(parseInt(e.target.value))}
                  >
                    <option value={1}>Primer Parcial</option>
                    <option value={2}>Segundo Parcial</option>
                    <option value={3}>Tercer Parcial</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tabla de alumnos */}
            {loading ? (
              <p className="text-sm text-on-surface-variant">Cargando…</p>
            ) : alumnos.length === 0 ? (
              <div className="bg-surface-container-high border border-outline-variant rounded-xl p-lg text-center">
                <p className="text-on-surface-variant">Sin alumnos en este grupo.</p>
              </div>
            ) : (
              <div className="bg-white border border-outline-variant rounded-lg shadow-sm overflow-hidden">
                <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                  <h3 className="font-title-sm text-title-sm text-on-surface">Lista de Alumnos — Parcial {parcial}</h3>
                  <span className="text-xs text-on-surface-variant">{alumnos.length} alumnos</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-lowest border-b border-outline-variant">
                      <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs">Nombre</th>
                      <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs">Matrícula</th>
                      {existentes.length > 0 && (
                        <>
                          {parcial > 1 && <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs text-center">P{parcial - 1} ant.</th>}
                        </>
                      )}
                      <th className="py-3 px-4 font-label-bold text-label-bold text-on-primary-fixed-variant uppercase text-xs text-center bg-primary-fixed/30 border-x border-outline-variant">
                        Parcial {parcial}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnos.map((a, i) => {
                      const val = calificaciones[a.alumno_id] ?? "";
                      const numVal = val !== "" ? parseFloat(val) : null;
                      const isReprobado = numVal !== null && numVal < 6;
                      return (
                        <tr key={a.alumno_id} className={`border-b border-outline-variant hover:bg-surface-container-low transition-colors ${i % 2 === 1 ? "bg-surface-container-lowest" : "bg-white"}`}>
                          <td className="py-2 px-4 text-on-surface font-medium">{a.nombre}</td>
                          <td className="py-2 px-4 text-on-surface-variant font-mono text-sm">{a.matricula}</td>
                          <td className="py-2 px-4 text-center bg-primary-fixed/10 border-x border-outline-variant">
                            <input
                              className={`w-16 text-center border rounded py-1 px-1 focus:outline-none focus:ring-1 font-data-tabular ${isReprobado ? "border-error focus:border-error focus:ring-error text-error" : "border-outline-variant focus:border-primary focus:ring-primary"}`}
                              max="10"
                              min="0"
                              step="0.1"
                              type="number"
                              value={val}
                              onChange={(e) => setCalificaciones((prev) => ({ ...prev, [a.alumno_id]: e.target.value }))}
                              placeholder="—"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

