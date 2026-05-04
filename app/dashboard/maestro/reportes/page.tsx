"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface AlumnoGrupo {
  alumno_id: string;
  matricula: string;
  nombre: string;
  promedio_general: number | null;
}

interface GrupoStats {
  id: string;
  nombre: string;
  carrera: string;
  alumnos: AlumnoGrupo[];
  materias: string[];
  reprobados: number;
}

interface Calificacion {
  alumno_id: string;
  parcial: number;
  calificacion: number;
  grupo_id: string;
}

export default function ReportesMaestroPage() {
  const [grupos, setGrupos] = useState<GrupoStats[]>([]);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [asistencias, setAsistencias] = useState<{ alumno_id: string; estatus: string; grupo_id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/maestro/mis-grupos").then((r) => r.json()),
      fetch("/api/calificaciones").then((r) => r.json()),
      fetch("/api/asistencias").then((r) => r.json()),
    ]).then(([gData, cData, aData]) => {
      setGrupos(gData.grupos ?? []);
      setCalificaciones(cData.calificaciones ?? []);
      setAsistencias(aData.asistencias ?? []);
      setLoading(false);
    });
  }, []);

  // Estadísticas globales
  const totalAlumnos = grupos.reduce((a, g) => a + g.alumnos.length, 0);
  const totalReprobados = grupos.reduce((a, g) => a + g.reprobados, 0);

  const calsNumericas = calificaciones.filter((c) => typeof c.calificacion === "number");
  const promedioGlobal = calsNumericas.length > 0
    ? (calsNumericas.reduce((a, c) => a + c.calificacion, 0) / calsNumericas.length).toFixed(1)
    : "—";

  const asistenciasPorGrupo = grupos.map((g) => {
    const asGrupo = asistencias.filter((a) => a.grupo_id === g.id);
    const pct = asGrupo.length > 0
      ? Math.round((asGrupo.filter((a) => a.estatus === "P").length / asGrupo.length) * 100)
      : null;
    return { ...g, asistenciaPct: pct };
  });

  const asistenciaMedia = asistenciasPorGrupo.filter((g) => g.asistenciaPct !== null).length > 0
    ? Math.round(asistenciasPorGrupo.filter((g) => g.asistenciaPct !== null).reduce((a, g) => a + (g.asistenciaPct ?? 0), 0) / asistenciasPorGrupo.filter((g) => g.asistenciaPct !== null).length)
    : null;

  return (
    <>
      <DashboardTopbar userImageAlt="Maestro" linkBase="/dashboard/maestro" />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="reportes" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[1280px] mx-auto p-md lg:p-lg">

            <div className="mb-lg">
              <h2 className="font-headline-md text-headline-md text-on-background">Reportes</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Estadísticas de calificaciones y asistencia de tus grupos.</p>
            </div>

            {loading ? (
              <p className="text-sm text-on-surface-variant">Cargando…</p>
            ) : (
              <>
                {/* Stats globales */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-md mb-xl">
                  {[
                    { icon: "person", label: "Alumnos Totales", value: String(totalAlumnos), color: "text-primary bg-surface-container" },
                    { icon: "grade", label: "Promedio Global", value: promedioGlobal, color: "text-secondary bg-surface-container-high" },
                    { icon: "close", label: "Reprobados", value: String(totalReprobados), color: "text-error bg-error-container" },
                    { icon: "event_available", label: "Asistencia Media", value: asistenciaMedia !== null ? `${asistenciaMedia}%` : "—", color: "text-yellow-800 bg-yellow-50" },
                  ].map((c) => (
                    <div key={c.label} className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-sm">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.color}`}>
                        <span className="material-symbols-outlined text-sm">{c.icon}</span>
                      </div>
                      <span className="font-display-lg text-display-lg text-on-surface">{c.value}</span>
                      <p className="text-xs text-on-surface-variant">{c.label}</p>
                    </div>
                  ))}
                </div>

                {/* Por grupo */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
                  {asistenciasPorGrupo.map((g) => {
                    const calsGrupo = calificaciones.filter((c) => c.grupo_id === g.id);
                    const promedioGrupo = calsGrupo.length > 0
                      ? (calsGrupo.reduce((a, c) => a + c.calificacion, 0) / calsGrupo.length).toFixed(1)
                      : "—";
                    return (
                      <div key={g.id} className="bg-white border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-md">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-title-md text-title-md text-on-surface">{g.nombre}</h3>
                            <p className="text-xs text-on-surface-variant mt-0.5">{g.carrera}</p>
                          </div>
                          <span className="text-xs bg-surface-container-high px-2 py-0.5 rounded-full text-on-surface-variant">
                            {g.alumnos.length} alumnos
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-surface-container-lowest rounded-lg p-2">
                            <p className="font-semibold text-lg text-on-surface">{promedioGrupo}</p>
                            <p className="text-xs text-on-surface-variant">Promedio</p>
                          </div>
                          <div className="bg-error-container rounded-lg p-2">
                            <p className="font-semibold text-lg text-error">{g.reprobados}</p>
                            <p className="text-xs text-on-error-container">Reprobados</p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-2">
                            <p className="font-semibold text-lg text-yellow-800">{g.asistenciaPct !== null ? `${g.asistenciaPct}%` : "—"}</p>
                            <p className="text-xs text-yellow-700">Asistencia</p>
                          </div>
                        </div>
                        {/* Top alumnos en riesgo */}
                        {g.alumnos.filter((a) => a.promedio_general !== null && a.promedio_general < 6).length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-error mb-1">En riesgo:</p>
                            <ul className="text-xs text-on-surface-variant space-y-0.5">
                              {g.alumnos
                                .filter((a) => a.promedio_general !== null && (a.promedio_general ?? 10) < 6)
                                .slice(0, 3)
                                .map((a) => (
                                  <li key={a.alumno_id} className="flex justify-between">
                                    <span>{a.nombre}</span>
                                    <span className="text-error font-medium">{a.promedio_general?.toFixed(1)}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

