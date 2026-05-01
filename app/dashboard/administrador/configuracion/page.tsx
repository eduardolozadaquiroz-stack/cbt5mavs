"use client";

import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Link from "next/link";

const BASE = "/dashboard/administrador";

export default function ConfiguracionPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nombreInstituto: "Centro de Bachillerato Tecnológico Núm. 5",
    municipio: "Chalco",
    estado: "Estado de México",
    director: "María Amparo Viderique de Shein",
    ciclo: "2023-2024",
    turnoMatutino: true,
    turnoVespertino: true,
    mantenimiento: false,
    registroPublico: true,
  });

  function set(k: string, v: string | boolean) { setForm((f) => ({ ...f, [k]: v })); setSaved(false); }

  function handleSave(e: React.FormEvent) { e.preventDefault(); setSaved(true); }

  const inputBase =
    "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-colors";
  const labelBase = "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1";

  const subLinks = [
    { href: `${BASE}/configuracion/periodos`, label: "Periodos escolares", desc: "Gestiona los ciclos y parciales activos" },
    { href: `${BASE}/configuracion/roles`,    label: "Roles y permisos",   desc: "Administra los niveles de acceso del sistema" },
  ];

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador" userName="Mtra. Viderique" userRole="Administradora"
        activeTopLink="configuracion" showSearch linkBase={BASE}
      />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="inicio" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[960px] mx-auto w-full">

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Configuración del sistema</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Parámetros generales de la institución</p>
          </div>

          {/* Sub-navegación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {subLinks.map((s) => (
              <Link key={s.href} href={s.href} className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all group">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-600">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{s.label}</p>
                  <p className="text-xs text-slate-500">{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Formulario general */}
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-4">Datos institucionales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelBase}>Nombre del plantel</label>
                <input value={form.nombreInstituto} onChange={(e) => set("nombreInstituto", e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Municipio</label>
                <input value={form.municipio} onChange={(e) => set("municipio", e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Estado</label>
                <input value={form.estado} onChange={(e) => set("estado", e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Director(a)</label>
                <input value={form.director} onChange={(e) => set("director", e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Ciclo escolar activo</label>
                <input value={form.ciclo} onChange={(e) => set("ciclo", e.target.value)} className={inputBase} />
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 dark:border-slate-700 pt-4">
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-3">Opciones generales</h3>
              <div className="flex flex-col gap-3">
                {[
                  { key: "turnoMatutino",    label: "Turno Matutino activo" },
                  { key: "turnoVespertino",  label: "Turno Vespertino activo" },
                  { key: "registroPublico",  label: "Admisión abierta al público" },
                  { key: "mantenimiento",    label: "Modo mantenimiento (bloquea acceso a alumnos)" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => set(key, !(form as Record<string, string | boolean>)[key])}
                      className={`relative w-9 h-5 rounded-full transition-colors ${(form as Record<string, string | boolean>)[key] ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${(form as Record<string, string | boolean>)[key] ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              {saved && (
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  Configuración guardada
                </span>
              )}
              <button type="submit" className="ml-auto px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors">
                Guardar configuración
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
