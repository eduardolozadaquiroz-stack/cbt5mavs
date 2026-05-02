"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

interface Asistencia {
  id: string;
  fecha: string;
  estatus: string; // "P" = presente, "F" = falta, "J" = justificado
  justificacion: string | null;
  alumno: { id: string; matricula: string; usuarios: { nombre: string } };
  materia: { id: string; nombre: string };
  grupo: { id: string; nombre: string; semestre: number };
}

function EstatusChip({ estatus }: { estatus: string }) {
  if (estatus === "P") return <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold">Presente</span>;
  if (estatus === "J") return <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 text-xs font-bold">Justificado</span>;
  return <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-bold">Falta</span>;
}

export default function AsistenciasPage() {
  const [registros, setRegistros] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/asistencias")
      .then((r) => r.json())
      .then((d) => setRegistros(d.asistencias ?? []))
      .catch(() => setRegistros([]))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = registros.filter((r) =>
    r.alumno.usuarios.nombre.toLowerCase().includes(query.toLowerCase()) ||
    r.alumno.matricula.includes(query) ||
    r.materia.nombre.toLowerCase().includes(query.toLowerCase()) ||
    r.grupo.nombre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <DashboardTopbar userImageAlt="Administrador" activeTopLink="asistencias" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="asistencias" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Asistencias</h2>
            <p className="text-on-surface-variant mt-1">Control de asistencias por alumno y materia.</p>
          </div>

          <div className="bg-surface border border-outline-variant rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant">
              <div className="relative w-full sm:w-72">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar alumno, matrícula o materia..." className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded bg-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[700px]">
                <thead className="bg-surface-variant">
                  <tr>
                    {["Fecha", "Alumno", "Matrícula", "Materia", "Grupo", "Estado"].map((h) => (
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
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{new Date(r.fecha).toLocaleDateString("es-MX")}</td>
                      <td className="p-2 px-4 border-b border-outline-variant font-medium text-on-surface">{r.alumno.usuarios.nombre}</td>
                      <td className="p-2 px-4 border-b border-outline-variant font-mono text-on-surface-variant">{r.alumno.matricula}</td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{r.materia.nombre}</td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{r.grupo.nombre}</td>
                      <td className="p-2 px-4 border-b border-outline-variant"><EstatusChip estatus={r.estatus} /></td>
                    </tr>
                  ))}
                  {!loading && filtrados.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Sin registros de asistencias</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-3 px-4 border-t border-outline-variant text-sm text-on-surface-variant">
              {loading ? "Cargando..." : `Mostrando ${filtrados.length} de ${registros.length} registros`}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
