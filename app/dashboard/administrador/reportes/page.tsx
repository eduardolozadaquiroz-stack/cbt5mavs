"use client";

import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

export default function ReportesPage() {
  return (
    <>
      <DashboardTopbar userImageAlt="Administrador" activeTopLink="reportes" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="reportes" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reportes</h2>
            <p className="text-on-surface-variant mt-1">Generación y descarga de reportes institucionales.</p>
          </div>

          <div className="bg-surface border border-outline-variant rounded-lg shadow-sm flex flex-col items-center justify-center py-16 gap-3 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-outline">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-1 7h-2v-2h2v2zm0-4h-2V8h2v4z"/>
            </svg>
            <p className="text-on-surface font-semibold">No hay reportes generados aún</p>
            <p className="text-sm text-on-surface-variant max-w-xs">La funcionalidad de reportes estará disponible próximamente.</p>
          </div>
        </main>
      </div>
    </>
  );
}

const tipoColor: Record<string, string> = {
  Mensual:    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  Académico:  "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  Asistencia: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
  Padrón:     "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
};
