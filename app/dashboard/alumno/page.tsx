"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Calificacion {
  id: string;
  parcial: number;
  calificacion: number;
  materia: { nombre: string };
  grupo: { nombre: string; semestre: number } | null;
}

function promedioMateria(cals: Calificacion[], nombre: string): number | null {
  const m = cals.filter((c) => c.materia.nombre === nombre);
  if (!m.length) return null;
  return m.reduce((a, c) => a + c.calificacion, 0) / m.length;
}

function estatusChip(prom: number | null) {
  if (prom === null) return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant">Sin datos</span>;
  if (prom >= 6) return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container-high text-primary">Aprobado</span>;
  if (prom >= 5) return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant">Riesgo</span>;
  return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-error-container text-on-error-container">Reprobado</span>;
}

export default function DashboardAlumnoPage() {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [avisos, setAvisos] = useState<{ id: string; titulo: string; tipo: string; contenido: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/calificaciones").then((r) => r.json()),
      fetch("/api/avisos").then((r) => r.json()),
    ]).then(([cData, aData]) => {
      setCalificaciones(cData.calificaciones ?? []);
      setAvisos((aData.avisos ?? []).filter((a: { estado: string }) => a.estado === "publicado").slice(0, 2));
      setLoading(false);
    });
  }, []);

  // Agrupar por materia
  const materias = [...new Set(calificaciones.map((c) => c.materia.nombre))];
  const filas = materias.map((nombre) => {
    const cals = calificaciones.filter((c) => c.materia.nombre === nombre);
    const p1 = cals.find((c) => c.parcial === 1)?.calificacion ?? null;
    const p2 = cals.find((c) => c.parcial === 2)?.calificacion ?? null;
    const p3 = cals.find((c) => c.parcial === 3)?.calificacion ?? null;
    const prom = promedioMateria(calificaciones, nombre);
    return { nombre, p1, p2, p3, prom };
  });

  const promedioGeneral = filas.length
    ? (filas.filter((f) => f.prom !== null).reduce((a, f) => a + (f.prom ?? 0), 0) / filas.filter((f) => f.prom !== null).length).toFixed(1)
    : null;

  const aviso1 = avisos.find((a) => a.tipo === "urgente") ?? avisos[0];
  const aviso2 = avisos.find((a) => a !== aviso1) ?? null;

  return (
    <>
      {loading && <LoadingSpinner duration={1500} />}
      <DashboardTopbar
        userImageAlt="Estudiante"
        activeTopLink="dashboard"
        linkBase="/dashboard/alumno"
      />

      <div className="flex flex-1 pt-16">
        <DashboardSidebar activeLink="inicio" headerVariant="simple" linkBase="/dashboard/alumno" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          <div className="mb-lg flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background mb-1">Panel de Estudiante</h1>
              <p className="font-body-base text-body-base text-on-surface-variant">Resumen académico y avisos institucionales.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">

            {/* Avisos */}
            <div className="md:col-span-4 flex flex-col gap-md">
              {aviso1 ? (
                <div className="bg-error-container border border-error/20 rounded-xl p-md flex flex-col gap-sm shadow-sm">
                  <div className="flex items-center gap-2 text-on-error-container">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                    <h3 className="font-title-sm text-title-sm">{aviso1.titulo}</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-error-container/80 line-clamp-3">{aviso1.contenido}</p>
                </div>
              ) : (
                <div className="bg-surface-container-high border border-outline-variant rounded-xl p-md shadow-sm">
                  <p className="text-sm text-on-surface-variant">Sin avisos urgentes.</p>
                </div>
              )}
              {aviso2 && (
                <div className="bg-surface-container-high border border-outline-variant rounded-xl p-md flex flex-col gap-sm shadow-sm">
                  <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
                    <h3 className="font-title-sm text-title-sm text-on-surface">{aviso2.titulo}</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">{aviso2.contenido}</p>
                </div>
              )}
            </div>

            {/* Estadísticas + tabla */}
            <div className="md:col-span-8 flex flex-col gap-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between min-h-[120px]">
                  <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase">Promedio Actual</h3>
                  <div className="flex items-end gap-3 mt-auto">
                    <span className="text-4xl font-display-lg text-primary leading-none">
                      {loading ? "…" : promedioGeneral ?? "N/D"}
                    </span>
                    <span className="font-body-sm text-body-sm text-tertiary-fixed-dim pb-1">Ciclo en curso</span>
                  </div>
                </div>
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between min-h-[120px]">
                  <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase">Estado Académico</h3>
                  <div className="mt-auto">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-bold text-label-bold border border-outline-variant/50">
                      <span className="w-2 h-2 rounded-full bg-secondary-container mr-2"></span>
                      {filas.filter((f) => (f.prom ?? 10) < 6).length > 0 ? "En riesgo" : "Regular"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-md border-b border-outline-variant bg-surface-bright">
                  <h2 className="font-title-sm text-title-sm text-on-surface">Calificaciones por Parcial</h2>
                </div>
                <div className="overflow-x-auto">
                  {loading ? (
                    <p className="p-md text-sm text-on-surface-variant">Cargando calificaciones…</p>
                  ) : filas.length === 0 ? (
                    <p className="p-md text-sm text-on-surface-variant">Sin calificaciones registradas.</p>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-surface-container-low border-b border-outline-variant">
                        <tr>
                          <th className="px-md py-sm font-label-bold text-label-bold text-on-surface-variant uppercase">Materia</th>
                          <th className="px-md py-sm font-label-bold text-label-bold text-on-surface-variant uppercase text-center">P1</th>
                          <th className="px-md py-sm font-label-bold text-label-bold text-on-surface-variant uppercase text-center">P2</th>
                          <th className="px-md py-sm font-label-bold text-label-bold text-on-surface-variant uppercase text-center">P3</th>
                          <th className="px-md py-sm font-label-bold text-label-bold text-on-surface-variant uppercase text-center">Prom</th>
                          <th className="px-md py-sm font-label-bold text-label-bold text-on-surface-variant uppercase text-center">Estatus</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/50">
                        {filas.map((f) => (
                          <tr key={f.nombre} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="px-md py-sm font-body-sm text-body-sm">{f.nombre}</td>
                            <td className="px-md py-sm text-center">{f.p1 ?? "—"}</td>
                            <td className="px-md py-sm text-center">{f.p2 ?? "—"}</td>
                            <td className="px-md py-sm text-center">{f.p3 ?? "—"}</td>
                            <td className="px-md py-sm text-center font-bold">{f.prom !== null ? f.prom.toFixed(2) : "—"}</td>
                            <td className="px-md py-sm text-center">{estatusChip(f.prom)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
