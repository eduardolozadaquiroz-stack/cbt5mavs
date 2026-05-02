"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

interface Grupo {
  id: string;
  nombre: string;
  semestre: number;
  turno: string;
  activo: boolean;
  carrera: { id: string; nombre: string; clave: string };
  ciclo: { id: string; nombre: string; activo: boolean };
}

function turnoColor(turno: string) {
  if (turno === "matutino") return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200";
  return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200";
}

export default function GruposPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [fCarrera, setFCarrera] = useState("Todas");
  const [fSem, setFSem] = useState(0);
  const [fTurno, setFTurno] = useState("Todos");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/grupos")
      .then((r) => r.json())
      .then((d) => setGrupos(d.grupos ?? []))
      .catch(() => setGrupos([]))
      .finally(() => setLoading(false));
  }, []);

  const carreras = ["Todas", ...Array.from(new Set(grupos.map((g) => g.carrera.nombre)))];

  const filtrados = grupos.filter((g) => {
    const okCarrera = fCarrera === "Todas" || g.carrera.nombre === fCarrera;
    const okSem = fSem === 0 || g.semestre === fSem;
    const okTurno = fTurno === "Todos" || g.turno === fTurno;
    const q = query.toLowerCase();
    const okQ = q === "" || g.nombre.toLowerCase().includes(q) || g.carrera.nombre.toLowerCase().includes(q);
    return okCarrera && okSem && okTurno && okQ;
  });

  return (
    <>
      <DashboardTopbar userImageAlt="Administrador" activeTopLink="grupos" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="grupos" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Grupos</h2>
              <p className="text-sm text-slate-500 mt-0.5">{loading ? "Cargando..." : `${grupos.length} grupos registrados`}</p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Total grupos",     val: grupos.length,                                         color: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300" },
              { label: "Activos",          val: grupos.filter((g) => g.activo).length,                 color: "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300" },
              { label: "Turno matutino",   val: grupos.filter((g) => g.turno === "matutino").length,   color: "bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300" },
              { label: "Turno vespertino", val: grupos.filter((g) => g.turno === "vespertino").length, color: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300" },
            ].map(({ label, val, color }) => (
              <div key={label} className={`rounded-xl p-3 ${color}`}>
                <p className="text-xs font-medium opacity-70">{label}</p>
                <p className="text-xl font-bold mt-0.5">{loading ? "—" : val}</p>
              </div>
            ))}
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-3 mb-3 flex flex-col gap-2.5">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre de grupo o carrera..." className="w-full sm:w-80 pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300" />
            </div>
            <div className="flex gap-1.5 flex-wrap items-center">
              <span className="text-xs font-semibold text-slate-400 mr-1">Carrera:</span>
              {carreras.map((c) => (
                <button key={c} onClick={() => setFCarrera(c)} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${fCarrera === c ? "bg-blue-700 text-white border-blue-700" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>{c}</button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap items-center">
              <span className="text-xs font-semibold text-slate-400 mr-1">Semestre:</span>
              <button onClick={() => setFSem(0)} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${fSem === 0 ? "bg-slate-700 text-white border-slate-700" : "border-slate-200 dark:border-slate-600 text-slate-600 hover:bg-slate-50"}`}>Todos</button>
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <button key={s} onClick={() => setFSem(s)} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${fSem === s ? "bg-slate-700 text-white border-slate-700" : "border-slate-200 dark:border-slate-600 text-slate-600 hover:bg-slate-50"}`}>S{s}</button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap items-center">
              <span className="text-xs font-semibold text-slate-400 mr-1">Turno:</span>
              {[{ key: "Todos", label: "Ambos turnos" }, { key: "matutino", label: "Matutino" }, { key: "vespertino", label: "Vespertino" }].map(({ key, label }) => (
                <button key={key} onClick={() => setFTurno(key)} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${fTurno === key ? "bg-sky-700 text-white border-sky-700" : "border-slate-200 dark:border-slate-600 text-slate-600 hover:bg-slate-50"}`}>{label}</button>
              ))}
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[680px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {["Nombre", "Carrera", "Semestre", "Turno", "Ciclo", "Estado"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left border-b border-slate-200 dark:border-slate-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">Cargando...</td></tr>
                  )}
                  {!loading && filtrados.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">No hay grupos registrados aún.</td></tr>
                  )}
                  {!loading && filtrados.map((g) => (
                    <tr key={g.id} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-200">{g.nombre}</td>
                      <td className="px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400">{g.carrera.nombre}</td>
                      <td className="px-4 py-2.5 text-center font-bold text-xs text-slate-600 dark:text-slate-400">S{g.semestre}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${turnoColor(g.turno)}`}>
                          {g.turno.charAt(0).toUpperCase() + g.turno.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400">{g.ciclo.nombre}</td>
                      <td className="px-4 py-2.5">
                        {g.activo
                          ? <span className="inline-flex px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-semibold">Activo</span>
                          : <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-semibold">Inactivo</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500">
                    <td colSpan={6} className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                      {loading ? "Cargando..." : `Mostrando ${filtrados.length} de ${grupos.length} grupos`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
