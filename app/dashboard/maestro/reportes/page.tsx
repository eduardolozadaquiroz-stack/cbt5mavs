import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAEzpJcll0X5d9jtID0KZQY9DQZRRq2urTYr7OTdd5wbN3bwTITJS_udArelmyFwKHp52jZMTZigPK27koZBzrOk8apUTBoENBTNSQ_9UV341OiiIG2ayvR2P6RSKF_-zlJhwraxvKTWP30vx0XqFtP3QHDJZtZ5q0FsLnV0k_-5Y9u3x3nfcJe2qD7R3eQk7iDmNl6Al0VZjLNgQ06SdDzzwjB1yyZU_u4Aiu24ZTFsCj_CbalIFeIYzf8-mCoS4Y8hn9Ux-Vpjacf";

const GRUPOS_STATS = [
  { grupo: "301-G", carrera: "Gastronomía", alumnos: 32, promedio: 7.9, reprobados: 4, asistencia: 88 },
  { grupo: "302-G", carrera: "Gastronomía", alumnos: 28, promedio: 8.3, reprobados: 2, asistencia: 92 },
  { grupo: "301-I", carrera: "Informática",  alumnos: 27, promedio: 8.6, reprobados: 1, asistencia: 95 },
];

const TENDENCIA = [
  { parcial: "Parcial 1", "301-G": 8.1, "302-G": 8.4, "301-I": 8.7 },
  { parcial: "Parcial 2", "301-G": 7.8, "302-G": 8.2, "301-I": 8.5 },
  { parcial: "Parcial 3", "301-G": null, "302-G": null, "301-I": null },
];

function barWidth(val: number, max = 10) {
  return `${(val / max) * 100}%`;
}

export default function ReportesMaestroPage() {
  const totalAlumnos = GRUPOS_STATS.reduce((a, g) => a + g.alumnos, 0);
  const totalReprobados = GRUPOS_STATS.reduce((a, g) => a + g.reprobados, 0);
  const promedioGlobal = (GRUPOS_STATS.reduce((a, g) => a + g.promedio * g.alumnos, 0) / totalAlumnos).toFixed(1);
  const asistenciaMedia = Math.round(GRUPOS_STATS.reduce((a, g) => a + g.asistencia, 0) / GRUPOS_STATS.length);

  return (
    <>
      <DashboardTopbar
        userImageSrc={AVATAR}
        userImageAlt="User profile"
        linkBase="/dashboard/maestro"
      />

      <div className="flex pt-16 min-h-screen bg-surface-bright">
        <DashboardSidebar activeLink="reportes" headerVariant="cbt-circle" linkBase="/dashboard/maestro" />

        <main className="pt-0 md:pl-64 w-full pb-xl">
          <div className="max-w-[1280px] mx-auto p-md lg:p-lg">

            {/* Page Header */}
            <div className="mb-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-background">Reportes</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Estadísticas de calificaciones y asistencia de tus grupos. Ciclo 2023-2024.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-outline-variant text-on-surface font-label-bold text-label-bold rounded hover:bg-surface-container-lowest shadow-sm transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  Exportar PDF
                </button>
                <button className="px-4 py-2 bg-primary text-on-primary font-label-bold text-label-bold rounded hover:bg-primary-container shadow-sm transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">table_view</span>
                  Exportar Excel
                </button>
              </div>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-md mb-xl">
              {[
                { icon: "person", label: "Alumnos Totales", value: String(totalAlumnos), color: "text-primary bg-surface-container" },
                { icon: "grade", label: "Promedio Global", value: promedioGlobal, color: "text-secondary bg-surface-container-high" },
                { icon: "close", label: "Reprobados", value: String(totalReprobados), color: "text-error bg-error-container" },
                { icon: "event_available", label: "Asistencia Media", value: `${asistenciaMedia}%`, color: "text-[#856404] bg-[#fff3cd]" },
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

            {/* Two columns: bar chart + trend table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-md mb-xl">

              {/* Promedio por grupo (horizontal bars) */}
              <div className="bg-white border border-outline-variant rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="p-md border-b border-outline-variant bg-surface-bright">
                  <h3 className="font-title-sm text-title-sm text-on-surface">Promedio por Grupo</h3>
                </div>
                <div className="p-md flex flex-col gap-md">
                  {GRUPOS_STATS.map((g) => (
                    <div key={g.grupo}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-on-surface">{g.grupo} · {g.carrera}</span>
                        <span className="font-data-tabular font-semibold text-on-surface">{g.promedio}</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all ${g.promedio >= 8 ? "bg-primary" : g.promedio >= 7 ? "bg-[#ffc107]" : "bg-error"}`}
                          style={{ width: barWidth(g.promedio) }}
                        />
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">{g.reprobados} reprobados · {g.alumnos} alumnos</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asistencia por grupo */}
              <div className="bg-white border border-outline-variant rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="p-md border-b border-outline-variant bg-surface-bright">
                  <h3 className="font-title-sm text-title-sm text-on-surface">Asistencia por Grupo</h3>
                </div>
                <div className="p-md flex flex-col gap-md">
                  {GRUPOS_STATS.map((g) => (
                    <div key={g.grupo}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-on-surface">{g.grupo} · {g.carrera}</span>
                        <span className="font-data-tabular font-semibold text-on-surface">{g.asistencia}%</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all ${g.asistencia >= 90 ? "bg-secondary" : g.asistencia >= 80 ? "bg-[#ffc107]" : "bg-error"}`}
                          style={{ width: `${g.asistencia}%` }}
                        />
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {g.asistencia >= 90 ? "Dentro del límite" : "Riesgo — revisar faltas"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tendencia por Parcial */}
            <div className="bg-white border border-outline-variant rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="p-md border-b border-outline-variant bg-surface-bright flex items-center justify-between">
                <h3 className="font-title-sm text-title-sm text-on-surface">Tendencia por Parcial</h3>
                <span className="text-xs text-on-surface-variant">Promedio del grupo</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left border-collapse font-data-tabular text-data-tabular">
                  <thead className="bg-surface-container-lowest border-b border-outline-variant">
                    <tr>
                      <th className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs">Parcial</th>
                      {GRUPOS_STATS.map((g) => (
                        <th key={g.grupo} className="py-3 px-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-xs text-center">{g.grupo}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TENDENCIA.map((row, i) => (
                      <tr key={row.parcial} className={`border-b border-outline-variant hover:bg-surface-container-low transition-colors ${i % 2 === 1 ? "bg-surface-container-lowest" : "bg-white"}`}>
                        <td className="py-3 px-4 font-medium text-on-surface">{row.parcial}</td>
                        {GRUPOS_STATS.map((g) => {
                          const val = row[g.grupo as keyof typeof row] as number | null;
                          return (
                            <td key={g.grupo} className="py-3 px-4 text-center">
                              {val !== null ? (
                                <span className={`font-semibold ${val >= 8 ? "text-primary" : val >= 7 ? "text-[#856404]" : "text-error"}`}>
                                  {val}
                                </span>
                              ) : (
                                <span className="text-on-surface-variant">En curso</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
