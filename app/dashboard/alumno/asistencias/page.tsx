"use client";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useRealtimeAsistencias } from "@/hooks/useRealtimeAsistencias";

function estadoChip(porcentaje: number) {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
  if (porcentaje >= 90) return `${base} bg-surface-container-high text-primary`;
  if (porcentaje >= 80) return `${base} bg-[#fff3cd] text-[#856404] border border-[#ffeeba]`;
  return `${base} bg-error-container text-on-error-container`;
}
function estadoLabel(porcentaje: number) {
  if (porcentaje >= 90) return "Regular";
  if (porcentaje >= 80) return "Riesgo";
  return "Crítico";
}

export default function AsistenciasPage() {
  const { asistencias, loading, error } = useRealtimeAsistencias();

  // Agrupar por materia
  const porMateria: Record<string, { nombre: string; total: number; presentes: number; faltas: number; justificadas: number }> = {};
  for (const a of asistencias) {
    const key = a.materia_id;
    if (!porMateria[key]) {
      porMateria[key] = { nombre: a.materias?.nombre ?? a.materia_id, total: 0, presentes: 0, faltas: 0, justificadas: 0 };
    }
    porMateria[key].total++;
    if (a.estatus === "presente") porMateria[key].presentes++;
    else if (a.estatus === "ausente") porMateria[key].faltas++;
    else if (a.estatus === "tardanza") porMateria[key].presentes++;
    else if (a.estatus === "justificada") porMateria[key].justificadas++;
  }
  const resumen = Object.values(porMateria).map((m) => ({
    ...m,
    porcentaje: m.total ? Math.round(((m.presentes + m.justificadas) / m.total) * 100) : 100,
  }));

  return (
    <>
      <DashboardTopbar
        userImageSrc=""
        userImageAlt="User profile"
        activeTopLink="dashboard"
        linkBase="/dashboard/alumno"
      />

      <div className="flex pt-16">
        <DashboardSidebar activeLink="asistencias" headerVariant="simple" linkBase="/dashboard/alumno" />

        <main className="flex-1 md:ml-64 p-md md:p-lg xl:p-xl w-full max-w-container-max mx-auto overflow-x-hidden">

          {/* Page Header */}
          <div className="mb-lg">
            <h1 className="font-display-lg text-display-lg text-on-background">Mis Asistencias</h1>
            <p className="text-on-surface-variant mt-unit">
              Registro de asistencias del ciclo actual · Se actualiza en tiempo real
            </p>
          </div>

          {error && (
            <div className="mb-md rounded-lg bg-error-container text-on-error-container px-md py-sm">{error}</div>
          )}

          {/* Info banner */}
          <div className="mb-lg flex items-start gap-sm bg-surface-container border border-outline-variant rounded-xl p-md">
            <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              El reglamento del plantel establece que el alumno que acumule más del <strong>20% de faltas</strong> en
              cualquier materia pierde el derecho a evaluación ordinaria.
            </p>
          </div>

          {/* Summary table */}
          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-x-auto mb-lg">
            <div className="p-md border-b border-outline-variant flex items-center justify-between">
              <h2 className="font-title-sm text-title-sm text-on-surface">Resumen por Materia</h2>
              <span className="inline-flex items-center gap-1 text-body-sm text-primary">
                <span className="material-symbols-outlined text-sm">sync</span>
                Tiempo real
              </span>
            </div>
            {loading ? (
              <div className="text-center py-xl text-on-surface-variant">Cargando asistencias...</div>
            ) : resumen.length === 0 ? (
              <div className="text-center py-xl text-on-surface-variant">Sin registros de asistencia.</div>
            ) : (
              <table className="w-full min-w-[650px] text-left border-collapse">
                <thead className="bg-surface-container-high">
                  <tr>
                    {["Materia", "Total", "Asistidas", "Faltas", "Justificadas", "% Asistencia", "Estado"].map((h) => (
                      <th key={h} className="p-sm px-md border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-center first:text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resumen.map((r) => (
                    <tr key={r.nombre} className="border-b border-outline-variant last:border-0 transition-colors hover:bg-surface-container-lowest odd:bg-surface even:bg-surface-bright">
                      <td className="p-sm px-md font-medium text-on-surface">{r.nombre}</td>
                      <td className="p-sm px-md text-center text-on-surface">{r.total}</td>
                      <td className="p-sm px-md text-center text-on-surface">{r.presentes}</td>
                      <td className={`p-sm px-md text-center font-semibold ${r.faltas > 0 ? "text-error" : "text-on-surface"}`}>{r.faltas}</td>
                      <td className="p-sm px-md text-center text-on-surface-variant">{r.justificadas}</td>
                      <td className="p-sm px-md text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 bg-surface-container rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${r.porcentaje >= 90 ? "bg-primary" : r.porcentaje >= 80 ? "bg-[#ffc107]" : "bg-error"}`}
                              style={{ width: `${r.porcentaje}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{r.porcentaje}%</span>
                        </div>
                      </td>
                      <td className="p-sm px-md text-center">
                        <span className={estadoChip(r.porcentaje)}>{estadoLabel(r.porcentaje)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Risk alert */}
          {!loading && resumen.some((r) => r.porcentaje < 90) && (
            <div className="bg-[#fff3cd] border border-[#ffc107]/40 rounded-xl p-md flex items-start gap-sm">
              <span className="material-symbols-outlined text-[#856404] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <div>
                <p className="font-label-bold text-label-bold text-[#856404]">Materias en riesgo por faltas</p>
                <p className="text-body-sm font-body-sm text-[#856404]/80 mt-unit">
                  {resumen.filter((r) => r.porcentaje < 90).map((r) => r.nombre).join(", ")} —
                  acude a Control Escolar para tramitar justificantes si aplica.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}


