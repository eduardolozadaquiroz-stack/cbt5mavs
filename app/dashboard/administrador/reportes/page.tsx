"use client";

import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

const reportes = [
  { id: 1, titulo: "Informe Mensual — Junio 2024",    tipo: "Mensual",    fecha: "01/07/2024", generado: "Admin" },
  { id: 2, titulo: "Reporte de Reprobación 2024-1",   tipo: "Académico",  fecha: "15/06/2024", generado: "Admin" },
  { id: 3, titulo: "Estadísticas de Asistencia Mayo", tipo: "Asistencia", fecha: "03/06/2024", generado: "Maestro" },
  { id: 4, titulo: "Padrón Actualizado 2024",         tipo: "Padrón",     fecha: "20/05/2024", generado: "Admin" },
  { id: 5, titulo: "Informe Mensual — Mayo 2024",     tipo: "Mensual",    fecha: "01/06/2024", generado: "Admin" },
];

const tipoColor: Record<string, string> = {
  Mensual:    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  Académico:  "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  Asistencia: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
  Padrón:     "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
};

export default function ReportesPage() {
  return (
    <>
      <DashboardTopbar userImageAlt="Administrador" userName="Mtra. Viderique" userRole="Administradora" activeTopLink="reportes" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="reportes" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reportes</h2>
              <p className="text-on-surface-variant mt-1">Generación y descarga de reportes institucionales.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded hover:bg-primary/90 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Generar Reporte
            </button>
          </div>

          <div className="bg-surface border border-outline-variant rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-variant">
                  <tr>
                    {["Título", "Tipo", "Fecha", "Generado por", "Acciones"].map((h, i) => (
                      <th key={h} className={`p-2 px-4 border-b border-outline-variant text-on-surface-variant uppercase tracking-wider text-xs font-semibold ${i === 4 ? "text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((r) => (
                    <tr key={r.id} className="odd:bg-surface even:bg-surface-bright hover:bg-surface-container-lowest transition-colors">
                      <td className="p-2 px-4 border-b border-outline-variant font-medium text-on-surface">{r.titulo}</td>
                      <td className="p-2 px-4 border-b border-outline-variant">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${tipoColor[r.tipo] ?? ""}`}>{r.tipo}</span>
                      </td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{r.fecha}</td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{r.generado}</td>
                      <td className="p-2 px-4 border-b border-outline-variant text-right">
                        <button className="text-on-surface-variant hover:text-primary p-1 rounded" title="Descargar PDF">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                          </svg>
                        </button>
                        <button className="text-on-surface-variant hover:text-red-600 p-1 rounded" title="Eliminar">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
