"use client";

import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

type Carrera = "Todas" | "Gastronomía" | "Informática" | "Diseño Asistido";

const calificaciones = [
  { id: "230145", nombre: "Hernandez Garcia, María",  carrera: "Gastronomía",    materia: "Técnicas Culinarias", periodo: "2024-1", calif: 9.2 },
  { id: "230188", nombre: "López Silva, Carlos",       carrera: "Informática",     materia: "Programación I",      periodo: "2024-1", calif: 5.8 },
  { id: "220041", nombre: "Ramírez Ruiz, Ana",         carrera: "Diseño Asistido", materia: "AutoCAD Básico",      periodo: "2024-1", calif: 4.5 },
  { id: "230205", nombre: "Torres Vega, Diego",        carrera: "Informática",     materia: "Redes I",             periodo: "2024-1", calif: 8.7 },
  { id: "230112", nombre: "Vargas Soto, Elena",        carrera: "Gastronomía",     materia: "Nutrición Básica",    periodo: "2024-1", calif: 6.1 },
];

function getCalifClass(c: number) {
  if (c >= 8) return "text-green-700 dark:text-green-300 font-semibold";
  if (c >= 6) return "text-yellow-700 dark:text-yellow-300 font-semibold";
  return "text-red-700 dark:text-red-300 font-semibold";
}

export default function CalificacionesPage() {
  const [query, setQuery] = useState("");
  const [carrera, setCarrera] = useState<Carrera>("Todas");

  const filtrados = calificaciones.filter((c) => {
    const ok = carrera === "Todas" || c.carrera === carrera;
    const q = query.toLowerCase();
    return ok && (c.nombre.toLowerCase().includes(q) || c.id.includes(q) || c.materia.toLowerCase().includes(q));
  });

  return (
    <>
      <DashboardTopbar userImageAlt="Administrador" userName="Mtra. Viderique" userRole="Administradora" activeTopLink="calificaciones" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="calificaciones" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Calificaciones</h2>
            <p className="text-on-surface-variant mt-1">Consulta y gestiona el historial de calificaciones por materia y periodo.</p>
          </div>

          <div className="bg-surface border border-outline-variant rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative w-full sm:w-72">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar alumno, matrícula o materia..." className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded bg-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(["Todas", "Gastronomía", "Informática", "Diseño Asistido"] as Carrera[]).map((c) => (
                  <button key={c} onClick={() => setCarrera(c)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${carrera === c ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-variant"}`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[680px]">
                <thead className="bg-surface-variant">
                  <tr>
                    {["Matrícula", "Alumno", "Carrera", "Materia", "Periodo", "Calificación"].map((h) => (
                      <th key={h} className="p-2 px-4 border-b border-outline-variant text-on-surface-variant uppercase tracking-wider text-xs font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((r) => (
                    <tr key={`${r.id}-${r.materia}`} className="odd:bg-surface even:bg-surface-bright hover:bg-surface-container-lowest transition-colors">
                      <td className="p-2 px-4 border-b border-outline-variant font-mono text-on-surface-variant">{r.id}</td>
                      <td className="p-2 px-4 border-b border-outline-variant font-medium text-on-surface">{r.nombre}</td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{r.carrera}</td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{r.materia}</td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{r.periodo}</td>
                      <td className={`p-2 px-4 border-b border-outline-variant text-lg ${getCalifClass(r.calif)}`}>{r.calif.toFixed(1)}</td>
                    </tr>
                  ))}
                  {filtrados.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Sin resultados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-3 px-4 border-t border-outline-variant text-sm text-on-surface-variant">Mostrando {filtrados.length} de {calificaciones.length} registros</div>
          </div>
        </main>
      </div>
    </>
  );
}
