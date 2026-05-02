"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

interface Calificacion {
  id: string;
  parcial: number;
  calificacion: number;
  fecha_registro: string;
  alumno: { id: string; matricula: string; usuarios: { nombre: string } };
  materia: { id: string; nombre: string; clave: string };
  grupo: { id: string; nombre: string; semestre: number; carrera: { nombre: string } };
}

function getCalifClass(c: number) {
  if (c >= 8) return "text-green-700 dark:text-green-300 font-semibold";
  if (c >= 6) return "text-yellow-700 dark:text-yellow-300 font-semibold";
  return "text-red-700 dark:text-red-300 font-semibold";
}

export default function CalificacionesPage() {
  const [cals, setCals] = useState<Calificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [carreraFiltro, setCarreraFiltro] = useState("Todas");

  useEffect(() => {
    fetch("/api/calificaciones")
      .then((r) => r.json())
      .then((d) => setCals(d.calificaciones ?? []))
      .catch(() => setCals([]))
      .finally(() => setLoading(false));
  }, []);

  const carreras = ["Todas", ...Array.from(new Set(cals.map((c) => c.grupo.carrera.nombre)))];

  const filtrados = cals.filter((c) => {
    const okCarrera = carreraFiltro === "Todas" || c.grupo.carrera.nombre === carreraFiltro;
    const q = query.toLowerCase();
    return okCarrera && (
      c.alumno.usuarios.nombre.toLowerCase().includes(q) ||
      c.alumno.matricula.toLowerCase().includes(q) ||
      c.materia.nombre.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <DashboardTopbar userImageAlt="Administrador" activeTopLink="calificaciones" showSearch linkBase={BASE} />
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
                {carreras.map((c) => (
                  <button key={c} onClick={() => setCarreraFiltro(c)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${carreraFiltro === c ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-variant"}`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[680px]">
                <thead className="bg-surface-variant">
                  <tr>
                    {["Alumno", "Matrícula", "Carrera", "Materia", "Parcial", "Calificación"].map((h) => (
                      <th key={h} className="p-2 px-4 border-b border-outline-variant text-on-surface-variant uppercase tracking-wider text-xs font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Cargando...</td></tr>
                  )}
                  {!loading && filtrados.map((r) => (
                    <tr key={r.id} className="odd:bg-surface even:bg-surface-bright hover:bg-surface-container-lowest transition-colors">
                      <td className="p-2 px-4 border-b border-outline-variant font-medium text-on-surface">{r.alumno.usuarios.nombre}</td>
                      <td className="p-2 px-4 border-b border-outline-variant font-mono text-on-surface-variant">{r.alumno.matricula}</td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{r.grupo.carrera.nombre}</td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{r.materia.nombre}</td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{r.parcial}°</td>
                      <td className={`p-2 px-4 border-b border-outline-variant text-lg ${getCalifClass(r.calificacion)}`}>{r.calificacion.toFixed(1)}</td>
                    </tr>
                  ))}
                  {!loading && filtrados.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Sin registros de calificaciones</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-3 px-4 border-t border-outline-variant text-sm text-on-surface-variant">
              {loading ? "Cargando..." : `Mostrando ${filtrados.length} de ${cals.length} registros`}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
