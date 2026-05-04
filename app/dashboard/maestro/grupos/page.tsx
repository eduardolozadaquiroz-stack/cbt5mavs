"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface Alumno {
  alumno_id: string;
  matricula: string;
  nombre: string;
  promedio_general: number | null;
  estatus: string;
}

interface GrupoMaestro {
  id: string;
  nombre: string;
  semestre: number;
  turno: string;
  carrera: { nombre: string; clave: string };
  ciclo: { nombre: string } | null;
  materias: string[];
  alumnos: Alumno[];
  reprobados: number;
}

function estatusChip(est: string) {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold";
  if (est === "regular") return `${base} bg-surface-container-high text-on-surface`;
  if (est === "en_riesgo") return `${base} bg-yellow-100 text-yellow-800`;
  if (est === "critico") return `${base} bg-orange-100 text-orange-800`;
  return `${base} bg-error-container text-on-error-container`;
}

export default function GruposMaestroPage() {
  const [grupos, setGrupos] = useState<GrupoMaestro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/maestro/mis-grupos")
      .then((r) => r.json())
      .then((d) => {
        setGrupos(d.grupos ?? []);
        setLoading(false);
      });
  }, []);

  const totalAlumnos = grupos.reduce((a, g) => a + g.alumnos.length, 0);
  const totalReprobados = grupos.reduce((a, g) => a + g.reprobados, 0);

  return (
    <>
      <DashboardTopbar userImageAlt="Maestro" linkBase="/dashboard/maestro" />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="grupos" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[1280px] mx-auto p-md lg:p-lg">

            <div className="mb-lg">
              <h2 className="font-headline-md text-headline-md text-on-background">Mis Grupos</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Grupos asignados en el ciclo actual.</p>
            </div>

            {!loading && (
              <div className="grid grid-cols-3 gap-md mb-xl">
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm text-center">
                  <p className="font-display-lg text-display-lg text-on-surface">{grupos.length}</p>
                  <p className="text-xs text-on-surface-variant mt-unit">Grupos asignados</p>
                </div>
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm text-center">
                  <p className="font-display-lg text-display-lg text-on-surface">{totalAlumnos}</p>
                  <p className="text-xs text-on-surface-variant mt-unit">Alumnos totales</p>
                </div>
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm text-center">
                  <p className="font-display-lg text-display-lg text-error">{totalReprobados}</p>
                  <p className="text-xs text-on-surface-variant mt-unit">Alumnos con promedio &lt;6</p>
                </div>
              </div>
            )}

            {loading ? (
              <p className="text-sm text-on-surface-variant">Cargando grupos…</p>
            ) : grupos.length === 0 ? (
              <div className="bg-surface-container-high border border-outline-variant rounded-xl p-lg text-center">
                <p className="text-on-surface-variant">No tienes grupos asignados en este ciclo.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-xl">
                {grupos.map((grupo) => (
                  <div key={grupo.id} className="bg-white border border-outline-variant rounded-lg shadow-sm overflow-hidden">
                    <div className="p-md border-b border-outline-variant bg-surface-bright flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm">
                      <div className="flex items-center gap-md">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-lg flex-shrink-0">
                          {grupo.nombre.slice(0, 3)}
                        </div>
                        <div>
                          <h3 className="font-title-sm text-title-sm text-on-surface">Grupo {grupo.nombre}</h3>
                          <p className="text-xs text-on-surface-variant">{grupo.semestre}° Semestre · {grupo.carrera.nombre} · {grupo.turno}</p>
                          {grupo.materias.length > 0 && (
                            <p className="text-xs text-on-surface-variant mt-0.5">{grupo.materias.join(", ")}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-md">
                        <div className="text-center">
                          <p className="text-xs text-on-surface-variant">Alumnos</p>
                          <p className="font-semibold text-on-surface">{grupo.alumnos.length}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-on-surface-variant">Reprobados</p>
                          <p className={`font-semibold ${grupo.reprobados > 2 ? "text-error" : "text-on-surface"}`}>{grupo.reprobados}</p>
                        </div>
                        <a
                          href="/dashboard/maestro/calificaciones"
                          className="ml-sm inline-flex items-center gap-1 px-md py-unit border border-primary text-primary rounded font-label-bold text-label-bold text-sm hover:bg-primary/5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">grade</span>
                          Capturar
                        </a>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-lowest border-b border-outline-variant">
                            <th className="py-2 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs">Matrícula</th>
                            <th className="py-2 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs">Nombre</th>
                            <th className="py-2 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs text-center">Promedio</th>
                            <th className="py-2 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs text-center">Estatus</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grupo.alumnos.map((a, i) => (
                            <tr key={a.alumno_id} className={`border-b border-outline-variant hover:bg-surface-container-low transition-colors ${i % 2 === 1 ? "bg-surface-container-lowest" : "bg-white"}`}>
                              <td className="py-2 px-4 text-on-surface-variant font-mono text-sm">{a.matricula}</td>
                              <td className="py-2 px-4 text-on-surface font-medium">{a.nombre}</td>
                              <td className={`py-2 px-4 text-center font-bold ${a.promedio_general !== null && a.promedio_general < 6 ? "text-error" : "text-on-surface"}`}>
                                {a.promedio_general !== null ? a.promedio_general.toFixed(1) : "—"}
                              </td>
                              <td className="py-2 px-4 text-center">
                                <span className={estatusChip(a.estatus)}>{a.estatus}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

