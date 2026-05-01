"use client";

import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Link from "next/link";

const BASE = "/dashboard/administrador";

interface Periodo {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

const periodosIniciales: Periodo[] = [
  { id: 1, nombre: "Ciclo 2023-2024 — Primer Parcial",   fechaInicio: "2023-08-21", fechaFin: "2023-10-06", activo: false },
  { id: 2, nombre: "Ciclo 2023-2024 — Segundo Parcial",  fechaInicio: "2023-10-09", fechaFin: "2023-11-24", activo: false },
  { id: 3, nombre: "Ciclo 2023-2024 — Tercer Parcial",   fechaInicio: "2023-11-27", fechaFin: "2024-01-26", activo: false },
  { id: 4, nombre: "Ciclo 2024-2025 — Primer Semestre",  fechaInicio: "2024-08-19", fechaFin: "2025-01-24", activo: false },
  { id: 5, nombre: "Ciclo 2025-2026 — Primer Parcial",   fechaInicio: "2025-08-18", fechaFin: "2025-10-03", activo: false },
  { id: 6, nombre: "Ciclo 2025-2026 — Segundo Parcial",  fechaInicio: "2025-10-06", fechaFin: "2025-12-05", activo: false },
  { id: 7, nombre: "Ciclo 2025-2026 — Tercer Parcial",   fechaInicio: "2026-01-12", fechaFin: "2026-06-30", activo: true  },
];

export default function PeriodosPage() {
  const [periodos, setPeriodos] = useState<Periodo[]>(periodosIniciales);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nombre: "", fechaInicio: "", fechaFin: "" });

  function toggleActivo(id: number) {
    setPeriodos((p) =>
      p.map((x) => x.id === id ? { ...x, activo: !x.activo } : x)
    );
  }

  function addPeriodo() {
    if (!form.nombre || !form.fechaInicio || !form.fechaFin) return;
    setPeriodos((p) => [...p, { id: Date.now(), ...form, activo: false }]);
    setForm({ nombre: "", fechaInicio: "", fechaFin: "" });
    setModal(false);
  }

  const inputBase = "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300";
  const labelBase = "text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1";

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador" userName="Mtra. Viderique" userRole="Administradora"
        activeTopLink="configuracion" showSearch linkBase={BASE}
      />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="inicio" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[960px] mx-auto w-full">

          <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
            <Link href={`${BASE}/configuracion`} className="hover:text-blue-700 transition-colors">Configuración</Link>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Periodos escolares</span>
          </div>

          <div className="mb-5 flex justify-between items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Periodos escolares</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Gestiona los ciclos y parciales del sistema</p>
            </div>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Nuevo periodo
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-2.5 text-left border-b border-slate-200 dark:border-slate-700">Nombre</th>
                  <th className="px-4 py-2.5 text-center border-b border-slate-200 dark:border-slate-700">Inicio</th>
                  <th className="px-4 py-2.5 text-center border-b border-slate-200 dark:border-slate-700">Fin</th>
                  <th className="px-4 py-2.5 text-center border-b border-slate-200 dark:border-slate-700">Estado</th>
                  <th className="px-4 py-2.5 text-right border-b border-slate-200 dark:border-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {periodos.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100">{p.nombre}</td>
                    <td className="px-4 py-3 text-center text-xs text-slate-500">{p.fechaInicio}</td>
                    <td className="px-4 py-3 text-center text-xs text-slate-500">{p.fechaFin}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${p.activo ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                        {p.activo ? "Activo" : "Cerrado"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleActivo(p.id)}
                        className="text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        {p.activo ? "Cerrar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-5">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-4">Nuevo periodo escolar</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelBase}>Nombre del periodo</label>
                <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} placeholder="Ej. Ciclo 2026-2027 — Primer Parcial" className={inputBase} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelBase}>Fecha inicio</label>
                  <input type="date" value={form.fechaInicio} onChange={(e) => setForm((f) => ({ ...f, fechaInicio: e.target.value }))} className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>Fecha fin</label>
                  <input type="date" value={form.fechaFin} onChange={(e) => setForm((f) => ({ ...f, fechaFin: e.target.value }))} className={inputBase} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setModal(false)} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
              <button onClick={addPeriodo} className="flex-1 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors">Crear periodo</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
