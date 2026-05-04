"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface Calificacion {
  id: string;
  parcial: number;
  calificacion: number;
  materia: { id: string; nombre: string };
  ciclo: { id: string; nombre: string } | null;
  grupo: { nombre: string; semestre: number } | null;
}

interface SemestreAgrupado {
  cicloId: string;
  cicloNombre: string;
  semestre: number;
  grupo: string;
  materias: { nombre: string; parciales: (number | null)[]; promedio: number | null }[];
  promedio: number | null;
  aprobadas: number;
  total: number;
}

function calcPromedio(parciales: (number | null)[]): number | null {
  const vals = parciales.filter((p): p is number => p !== null);
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function estatusChip(prom: number | null, enCurso: boolean) {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
  if (enCurso) return <span className={`${base} bg-surface-container text-on-surface-variant border border-outline-variant`}>En curso</span>;
  if (prom === null) return <span className={`${base} bg-surface-variant text-on-surface-variant`}>Sin datos</span>;
  if (prom >= 6) return <span className={`${base} bg-surface-container-high text-primary`}>Aprobado</span>;
  return <span className={`${base} bg-error-container text-on-error-container`}>Reprobado</span>;
}

export default function ReportesPage() {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/calificaciones")
      .then((r) => r.json())
      .then((d) => {
        setCalificaciones(d.calificaciones ?? []);
        setLoading(false);
      });
  }, []);

  // Agrupar calificaciones por ciclo
  const ciclosMap = new Map<string, SemestreAgrupado>();
  calificaciones.forEach((c) => {
    const cicloId = c.ciclo?.id ?? "sin-ciclo";
    const cicloNombre = c.ciclo?.nombre ?? "Sin ciclo";
    if (!ciclosMap.has(cicloId)) {
      ciclosMap.set(cicloId, {
        cicloId,
        cicloNombre,
        semestre: c.grupo?.semestre ?? 0,
        grupo: c.grupo?.nombre ?? "—",
        materias: [],
        promedio: null,
        aprobadas: 0,
        total: 0,
      });
    }
    const entry = ciclosMap.get(cicloId)!;
    let mat = entry.materias.find((m) => m.nombre === c.materia.nombre);
    if (!mat) {
      mat = { nombre: c.materia.nombre, parciales: [null, null, null], promedio: null };
      entry.materias.push(mat);
    }
    if (c.parcial >= 1 && c.parcial <= 3) {
      mat.parciales[c.parcial - 1] = c.calificacion;
    }
  });

  ciclosMap.forEach((entry) => {
    entry.materias.forEach((m) => { m.promedio = calcPromedio(m.parciales); });
    const promedios = entry.materias.map((m) => m.promedio).filter((p): p is number => p !== null);
    entry.promedio = promedios.length ? promedios.reduce((a, b) => a + b, 0) / promedios.length : null;
    entry.total = entry.materias.length;
    entry.aprobadas = entry.materias.filter((m) => m.promedio !== null && m.promedio >= 6).length;
  });

  const semestres = [...ciclosMap.values()].sort((a, b) => a.cicloNombre.localeCompare(b.cicloNombre));

  const promedioAcumulado = (() => {
    const all = semestres.filter((s) => s.promedio !== null).map((s) => s.promedio as number);
    if (!all.length) return null;
    return (all.reduce((a, b) => a + b, 0) / all.length).toFixed(2);
  })();

  return (
    <>
      <DashboardTopbar userImageAlt="Estudiante" activeTopLink="dashboard" linkBase="/dashboard/alumno" />

      <div className="flex pt-16">
        <DashboardSidebar activeLink="reportes" headerVariant="simple" linkBase="/dashboard/alumno" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          <div className="mb-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background">Reportes Académicos</h1>
              <p className="text-on-surface-variant mt-unit">Historial académico por semestre.</p>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm p-md mb-xl flex flex-col sm:flex-row gap-md items-start sm:items-center">
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-body-sm text-on-surface-variant">Semestres con datos: <strong>{semestres.length}</strong></p>
            </div>
            <div className="flex flex-col items-end gap-unit">
              <span className="text-xs text-on-surface-variant">Promedio acumulado</span>
              <span className="font-display-lg text-display-lg text-on-surface">
                {loading ? "…" : promedioAcumulado ?? "—"}
              </span>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-on-surface-variant">Cargando historial…</p>
          ) : semestres.length === 0 ? (
            <div className="bg-surface-container-high border border-outline-variant rounded-xl p-lg text-center">
              <p className="text-on-surface-variant">Sin calificaciones registradas.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-lg">
              {semestres.map((sem, idx) => {
                const esCurso = idx === semestres.length - 1 && sem.promedio === null;
                return (
                  <div key={sem.cicloId} className={`bg-surface border rounded-xl shadow-sm overflow-hidden ${esCurso ? "border-primary/40" : "border-outline-variant"}`}>
                    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm px-md py-sm ${esCurso ? "bg-primary/5" : "bg-surface-container-high"}`}>
                      <div>
                        <h3 className="font-title-sm text-title-sm text-on-surface flex items-center gap-2">
                          {sem.semestre > 0 ? `${sem.semestre}° Semestre` : sem.cicloNombre}
                          {esCurso && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-on-primary">En curso</span>
                          )}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">{sem.cicloNombre} · {sem.grupo}</p>
                      </div>
                      <div className="flex items-center gap-md">
                        {sem.promedio !== null && (
                          <div className="text-right">
                            <p className="text-xs text-on-surface-variant">Promedio</p>
                            <p className="font-semibold text-on-surface">{sem.promedio.toFixed(2)}</p>
                          </div>
                        )}
                        <div className="text-right">
                          <p className="text-xs text-on-surface-variant">Aprobadas</p>
                          <p className="font-semibold text-on-surface">{sem.aprobadas}/{sem.total}</p>
                        </div>
                      </div>
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-surface-variant/30">
                        <tr>
                          <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-xs">Materia</th>
                          <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-xs text-center">P1</th>
                          <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-xs text-center">P2</th>
                          <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-xs text-center">P3</th>
                          <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-xs text-center">Promedio</th>
                          <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-xs text-center">Estatus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sem.materias.map((m) => (
                          <tr key={m.nombre} className="odd:bg-surface even:bg-surface-bright border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                            <td className="p-sm px-md text-on-surface font-medium">{m.nombre}</td>
                            <td className="p-sm px-md text-center">{m.parciales[0] ?? "—"}</td>
                            <td className="p-sm px-md text-center">{m.parciales[1] ?? "—"}</td>
                            <td className="p-sm px-md text-center">{m.parciales[2] ?? "—"}</td>
                            <td className="p-sm px-md text-center font-semibold">{m.promedio !== null ? m.promedio.toFixed(2) : "—"}</td>
                            <td className="p-sm px-md text-center">{estatusChip(m.promedio, esCurso && m.promedio === null)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
