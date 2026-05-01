"use client";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useRealtimeCalificaciones } from "@/hooks/useRealtimeCalificaciones";

function estatusChip(promedio: number) {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
  if (promedio >= 6) return `${base} bg-surface-container-high text-primary`;
  if (promedio >= 5) return `${base} bg-[#fff3cd] text-[#856404] border border-[#ffeeba]`;
  return `${base} bg-error-container text-on-error-container`;
}

function estatusLabel(promedio: number) {
  if (promedio >= 6) return "APROBADO";
  if (promedio >= 5) return "RIESGO";
  return "REPROBADO";
}

export default function CalificacionesPage() {
  const { calificaciones, loading, error } = useRealtimeCalificaciones();

  // Agrupar por materia
  const porMateria: Record<string, { nombre: string; parciales: Record<number, number> }> = {};
  for (const cal of calificaciones) {
    const key = cal.materia_id;
    if (!porMateria[key]) {
      porMateria[key] = {
        nombre: cal.materias?.nombre ?? cal.materia_id,
        parciales: {},
      };
    }
    porMateria[key].parciales[cal.parcial] = cal.calificacion;
  }

  const materias = Object.values(porMateria);
  const promedios = materias.map((m) => {
    const vals = Object.values(m.parciales);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  });
  const promedioGeneral = promedios.length
    ? (promedios.reduce((a, b) => a + b, 0) / promedios.length).toFixed(2)
    : "–";

  return (
    <>
      <DashboardTopbar
        userImageSrc=""
        userImageAlt="User profile"
        activeTopLink="dashboard"
        linkBase="/dashboard/alumno"
      />

      <div className="flex pt-16">
        <DashboardSidebar activeLink="calificaciones" headerVariant="simple" linkBase="/dashboard/alumno" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          {/* Page Header */}
          <div className="mb-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-background">Calificaciones</h1>
              <p className="text-on-surface-variant mt-unit">Ciclo en curso · Se actualiza en tiempo real</p>
            </div>
            <span className="inline-flex items-center gap-1 px-md py-sm bg-primary-fixed/20 text-primary rounded-full text-label-bold font-label-bold text-sm">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                sync
              </span>
              Tiempo real
            </span>
          </div>

          {error && (
            <div className="mb-md rounded-lg bg-error-container text-on-error-container px-md py-sm">{error}</div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-xl">
            <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-unit">
              <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-xs">Promedio General</span>
              <span className="font-display-lg text-display-lg text-on-surface">{loading ? "…" : promedioGeneral}</span>
              <span className="text-body-sm font-body-sm text-on-surface-variant">Ciclo en curso</span>
            </div>
            <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-unit">
              <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-xs">Materias Aprobadas</span>
              <span className="font-display-lg text-display-lg text-on-surface">
                {loading ? "…" : promedios.filter((p) => p >= 6).length}
                <span className="text-on-surface-variant font-body-sm text-body-sm"> / {materias.length}</span>
              </span>
              <span className="text-body-sm font-body-sm text-on-surface-variant">De las materias actuales</span>
            </div>
            <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-unit">
              <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-xs">Parciales registrados</span>
              <span className="font-display-lg text-display-lg text-on-surface">
                {loading ? "…" : new Set(calificaciones.map((c) => c.parcial)).size}
              </span>
              <span className="text-body-sm font-body-sm text-on-surface-variant">Con calificación</span>
            </div>
          </div>

          {/* Grades Table */}
          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-x-auto">
            <div className="p-md border-b border-outline-variant">
              <h2 className="font-title-sm text-title-sm text-on-surface">Calificaciones por Parcial</h2>
            </div>
            {loading ? (
              <div className="text-center py-xl text-on-surface-variant">Cargando calificaciones...</div>
            ) : materias.length === 0 ? (
              <div className="text-center py-xl text-on-surface-variant">Sin calificaciones registradas.</div>
            ) : (
              <table className="w-full min-w-[600px] text-left border-collapse">
                <thead className="bg-surface-container-high">
                  <tr>
                    <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Materia</th>
                    <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-center">P1</th>
                    <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-center">P2</th>
                    <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-center">P3</th>
                    <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-center">Promedio</th>
                    <th className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-center">Estatus</th>
                  </tr>
                </thead>
                <tbody>
                  {materias.map((m, i) => {
                    const promedio = promedios[i];
                    return (
                      <tr key={m.nombre} className="odd:bg-surface even:bg-surface-bright hover:bg-surface-container-lowest transition-colors border-b border-outline-variant last:border-0">
                        <td className="p-sm px-md font-medium text-on-surface">{m.nombre}</td>
                        <td className="p-sm px-md text-center text-on-surface">{m.parciales[1] ?? <span className="text-outline">—</span>}</td>
                        <td className="p-sm px-md text-center text-on-surface">{m.parciales[2] ?? <span className="text-outline">—</span>}</td>
                        <td className="p-sm px-md text-center text-on-surface">{m.parciales[3] ?? <span className="text-outline">—</span>}</td>
                        <td className="p-sm px-md text-center font-semibold text-on-surface">{promedio.toFixed(2)}</td>
                        <td className="p-sm px-md text-center">
                          <span className={estatusChip(promedio)}>{estatusLabel(promedio)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </>
  );
}


