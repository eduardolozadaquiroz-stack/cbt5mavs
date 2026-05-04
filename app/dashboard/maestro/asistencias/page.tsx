"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

type Estatus = "P" | "F" | "J";

interface AlumnoGrupo {
  alumno_id: string;
  matricula: string;
  nombre: string;
}

interface GrupoMaestro {
  id: string;
  nombre: string;
  materias: string[];
  alumnos: AlumnoGrupo[];
}

interface HorarioSlot {
  materia: { id: string; nombre: string };
  grupo: { id: string } | null;
}

function EstatusBtn({ value, active, onClick }: { value: Estatus; active: boolean; onClick: () => void }) {
  const styles: Record<Estatus, string> = {
    P: "bg-surface-container-high text-primary border-primary/30",
    F: "bg-error-container text-on-error-container border-error/30",
    J: "bg-yellow-50 text-yellow-800 border-yellow-300",
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${active ? styles[value] : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-variant"}`}
    >
      {value}
    </button>
  );
}

export default function AsistenciasMaestroPage() {
  const [grupos, setGrupos] = useState<GrupoMaestro[]>([]);
  const [grupoId, setGrupoId] = useState("");
  const [materias, setMaterias] = useState<{ id: string; nombre: string }[]>([]);
  const [materiaId, setMateriaId] = useState("");
  const [alumnos, setAlumnos] = useState<AlumnoGrupo[]>([]);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [asistencias, setAsistencias] = useState<Record<string, Estatus>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

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

  useEffect(() => {
    if (!grupoId) return;
    const g = grupos.find((x) => x.id === grupoId);
    const als = g?.alumnos ?? [];
    setAlumnos(als);
    const initAsist: Record<string, Estatus> = {};
    als.forEach((a) => { initAsist[a.alumno_id] = "P"; });
    setAsistencias(initAsist);

    fetch(`/api/horarios?grupo_id=${grupoId}`)
      .then((r) => r.json())
      .then((d) => {
        const slots: HorarioSlot[] = d.horarios ?? [];
        const matMap = new Map<string, string>();
        slots.forEach((s) => {
          if (s.materia && s.grupo?.id === grupoId) matMap.set(s.materia.id, s.materia.nombre);
        });
        const mats = [...matMap.entries()].map(([id, nombre]) => ({ id, nombre }));
        setMaterias(mats);
        if (mats.length > 0) setMateriaId(mats[0].id);
      });
  }, [grupoId, grupos]);

  // Cargar asistencias ya registradas para el día/materia
  useEffect(() => {
    if (!grupoId || !materiaId || !fecha) return;
    fetch(`/api/asistencias?grupo_id=${grupoId}&materia_id=${materiaId}&fecha=${fecha}`)
      .then((r) => r.json())
      .then((d) => {
        const asis = d.asistencias ?? [];
        const map: Record<string, Estatus> = {};
        alumnos.forEach((a) => { map[a.alumno_id] = "P"; });
        asis.forEach((a: { alumno_id: string; estatus: Estatus }) => {
          map[a.alumno_id] = a.estatus;
        });
        setAsistencias(map);
      });
  }, [materiaId, fecha, grupoId]);

  async function guardar() {
    if (!grupoId || !materiaId || !fecha) return;
    setSaving(true);
    setMsg(null);
    try {
      const body = alumnos.map((a) => ({
        alumno_id: a.alumno_id,
        grupo_id: grupoId,
        materia_id: materiaId,
        fecha,
        estatus: asistencias[a.alumno_id] ?? "P",
      }));
      const res = await fetch("/api/asistencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asistencias: body }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ tipo: "ok", texto: "Asistencias guardadas correctamente." });
      } else {
        setMsg({ tipo: "error", texto: data.error ?? "Error al guardar." });
      }
    } finally {
      setSaving(false);
    }
  }

  const presentes = Object.values(asistencias).filter((e) => e === "P").length;
  const faltas = Object.values(asistencias).filter((e) => e === "F").length;

  return (
    <>
      <DashboardTopbar userImageAlt="Maestro" linkBase="/dashboard/maestro" />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="asistencias" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[1280px] mx-auto p-md lg:p-lg">

            <div className="mb-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-background">Registro de Asistencia</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  {presentes} presentes · {faltas} faltas
                </p>
              </div>
              <button
                onClick={guardar}
                disabled={saving || !grupoId || !materiaId}
                className="px-4 py-2 bg-primary text-on-primary font-label-bold text-label-bold rounded hover:bg-primary-container shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                {saving ? "Guardando…" : "Guardar Asistencia"}
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
                  <label className="font-label-bold text-label-bold text-on-surface-variant uppercase" htmlFor="grupo-s">Grupo</label>
                  <select id="grupo-s" className="w-full border border-outline-variant rounded px-3 py-2 bg-surface-container-lowest focus:outline-none focus:border-primary" value={grupoId} onChange={(e) => setGrupoId(e.target.value)} disabled={loading}>
                    {grupos.map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant uppercase" htmlFor="materia-s">Materia</label>
                  <select id="materia-s" className="w-full border border-outline-variant rounded px-3 py-2 bg-surface-container-lowest focus:outline-none focus:border-primary" value={materiaId} onChange={(e) => setMateriaId(e.target.value)} disabled={materias.length === 0}>
                    {materias.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant uppercase" htmlFor="fecha-s">Fecha</label>
                  <input id="fecha-s" type="date" className="w-full border border-outline-variant rounded px-3 py-2 bg-surface-container-lowest focus:outline-none focus:border-primary" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-on-surface-variant">Cargando…</p>
            ) : alumnos.length === 0 ? (
              <div className="bg-surface-container-high border border-outline-variant rounded-xl p-lg text-center">
                <p className="text-on-surface-variant">Sin alumnos en este grupo.</p>
              </div>
            ) : (
              <div className="bg-white border border-outline-variant rounded-lg shadow-sm overflow-hidden">
                <div className="p-md border-b border-outline-variant bg-surface-bright">
                  <h3 className="font-title-sm text-title-sm text-on-surface">Lista de Alumnos</h3>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-lowest border-b border-outline-variant">
                      <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs">Nombre</th>
                      <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs">Matrícula</th>
                      <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs text-center">Asistencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnos.map((a, i) => (
                      <tr key={a.alumno_id} className={`border-b border-outline-variant hover:bg-surface-container-low transition-colors ${i % 2 === 1 ? "bg-surface-container-lowest" : "bg-white"}`}>
                        <td className="py-2 px-4 text-on-surface font-medium">{a.nombre}</td>
                        <td className="py-2 px-4 text-on-surface-variant font-mono text-sm">{a.matricula}</td>
                        <td className="py-2 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {(["P", "F", "J"] as Estatus[]).map((e) => (
                              <EstatusBtn
                                key={e}
                                value={e}
                                active={asistencias[a.alumno_id] === e}
                                onClick={() => setAsistencias((prev) => ({ ...prev, [a.alumno_id]: e }))}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
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

