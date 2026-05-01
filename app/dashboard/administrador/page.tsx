"use client";

import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";

const BASE = "/dashboard/administrador";

const alumnos = [
  { id: "230145", nombre: "Hernandez Garcia, María",  carrera: "Gastronomía",      estatus: "Regular",   statusClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200" },
  { id: "230188", nombre: "López Silva, Carlos",       carrera: "Informática",       estatus: "En riesgo", statusClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200" },
  { id: "220041", nombre: "Ramírez Ruiz, Ana",         carrera: "Diseño Asistido",   estatus: "Crítico",   statusClass: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200" },
  { id: "230205", nombre: "Torres Vega, Diego",        carrera: "Informática",       estatus: "Regular",   statusClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200" },
  { id: "230112", nombre: "Vargas Soto, Elena",        carrera: "Gastronomía",       estatus: "En riesgo", statusClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200" },
];

export default function DashboardAdministradorPage() {
  const [query, setQuery] = useState("");

  const filtrados = alumnos.filter(
    (a) =>
      a.nombre.toLowerCase().includes(query.toLowerCase()) ||
      a.id.includes(query) ||
      a.carrera.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador" userName="Mtra. Viderique" userRole="Administradora"
        activeTopLink="dashboard"
        showSearch linkBase={BASE}
      />

      <div className="flex pt-14">
        <DashboardSidebar activeLink="inicio" headerVariant="school-icon" linkBase={BASE} />

        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          {/* Encabezado */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Panorama Académico</h2>
              <p className="text-on-surface-variant mt-1">Resumen ejecutivo del desempeño estudiantil actual.</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 border border-outline text-on-surface font-label-bold text-label-bold rounded hover:bg-surface-variant transition-colors shadow-sm text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
                </svg>
                Exportar PDF
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-label-bold text-label-bold rounded hover:bg-primary-container transition-colors shadow-sm text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                Exportar Excel
              </button>
            </div>
          </div>

          {/* Tarjetas de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

            {/* Total Alumnos */}
            <div className="bg-surface border border-outline-variant rounded-lg p-4 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-surface-container rounded-bl-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110" />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Total Alumnos</span>
                <div className="p-1 bg-surface-container text-primary rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
              </div>
              <div className="relative z-10">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 block">1,245</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                  </svg>
                  +2.4% vs semestre anterior
                </span>
              </div>
            </div>

            {/* Tasa de aprobación */}
            <div className="bg-surface border border-outline-variant rounded-lg p-4 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-surface-container-high rounded-bl-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110" />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Tasa de Aprobación</span>
                <div className="p-1 bg-surface-container-high text-secondary rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <div className="relative z-10">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 block">85.8%</span>
                <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-secondary h-1.5 rounded-full" style={{ width: "85.8%" }} />
                </div>
              </div>
            </div>

            {/* Tasa de reprobación */}
            <div className="bg-surface border border-outline-variant rounded-lg p-4 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Tasa de Reprobación</span>
                <div className="p-1 bg-red-50 dark:bg-red-950/30 text-red-600 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
                  </svg>
                </div>
              </div>
              <div className="relative z-10">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 block">14.2%</span>
                <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: "14.2%" }} />
                </div>
              </div>
            </div>

            {/* Alumnos en riesgo */}
            <div className="bg-surface border border-outline-variant border-l-4 border-l-red-500 rounded-lg p-4 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Alumnos en Riesgo</span>
                <div className="p-1 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                </div>
              </div>
              <div className="relative z-10">
                <span className="text-2xl font-bold text-red-600 block">87</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">Requiere intervención inmediata</span>
              </div>
            </div>
          </div>

          {/* Gráficas + Tabla */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-10">

            {/* Reprobación por carrera */}
            <div className="lg:col-span-1 bg-surface border border-outline-variant rounded-lg shadow-sm flex flex-col">
              <div className="p-4 border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-title-sm text-title-sm text-on-surface">Reprobación por Carrera</h3>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-center gap-4">
                {[
                  { carrera: "Informática",     pct: "18.5%", w: "75%",  color: "bg-primary" },
                  { carrera: "Gastronomía",      pct: "12.1%", w: "50%",  color: "bg-blue-400" },
                  { carrera: "Diseño Asistido",  pct: "8.4%",  w: "35%",  color: "bg-slate-400" },
                ].map((r) => (
                  <div key={r.carrera}>
                    <div className="flex justify-between text-sm mb-1 text-on-surface-variant">
                      <span>{r.carrera}</span>
                      <span className="font-medium">{r.pct}</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2">
                      <div className={`${r.color} h-2 rounded-full`} style={{ width: r.w }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Padrón de alumnos */}
            <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-lg shadow-sm flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="font-title-sm text-title-sm text-on-surface whitespace-nowrap">Padrón de Alumnos</h3>
                <div className="relative w-full sm:w-64">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar por nombre, matrícula o carrera..."
                    className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded bg-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                  />
                </div>
              </div>

              {/* Tabla */}
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-surface-variant sticky top-0 z-10">
                    <tr>
                      {["Matrícula", "Nombre", "Carrera", "Estatus", "Acciones"].map((h, i) => (
                        <th key={h} className={`p-2 px-4 border-b border-outline-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider ${i === 4 ? "text-right" : ""}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-on-surface-variant text-sm">
                          Sin resultados para &ldquo;{query}&rdquo;
                        </td>
                      </tr>
                    ) : (
                      filtrados.map((row) => (
                        <tr key={row.id} className="odd:bg-surface even:bg-surface-bright hover:bg-surface-container-lowest transition-colors">
                          <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant font-mono">{row.id}</td>
                          <td className="p-2 px-4 border-b border-outline-variant font-medium text-on-surface">{row.nombre}</td>
                          <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{row.carrera}</td>
                          <td className="p-2 px-4 border-b border-outline-variant">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${row.statusClass}`}>
                              {row.estatus}
                            </span>
                          </td>
                          <td className="p-2 px-4 border-b border-outline-variant text-right">
                            <button className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors" title="Editar">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                              </svg>
                            </button>
                            <button className="text-on-surface-variant hover:text-secondary p-1 rounded transition-colors" title="Reporte">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="p-2 px-4 border-t border-outline-variant flex justify-between items-center text-sm text-on-surface-variant">
                <span>Mostrando {filtrados.length} de 1,245 registros</span>
                <div className="flex gap-1">
                  <button className="px-2 py-1 rounded border border-outline-variant disabled:opacity-40" disabled>&lt;</button>
                  <button className="px-2 py-1 rounded border border-outline-variant bg-primary text-on-primary">1</button>
                  <button className="px-2 py-1 rounded border border-outline-variant hover:bg-surface-variant">2</button>
                  <button className="px-2 py-1 rounded border border-outline-variant hover:bg-surface-variant">3</button>
                  <button className="px-2 py-1 rounded border border-outline-variant hover:bg-surface-variant">&gt;</button>
                </div>
              </div>
            </div>
          </div>

          {/* Accesos rápidos a módulos */}
          <div>
            <h3 className="font-title-sm text-title-sm text-on-surface mb-4">Accesos rápidos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { href: `${BASE}/usuarios`,         label: "Usuarios",       color: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300" },
                { href: `${BASE}/importar-usuarios`, label: "Importar CSV",   color: "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300" },
                { href: `${BASE}/calificaciones`,    label: "Calificaciones", color: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300" },
                { href: `${BASE}/asistencias`,       label: "Asistencias",    color: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300" },
                { href: `${BASE}/grupos`,            label: "Grupos",         color: "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300" },
                { href: `${BASE}/reportes`,          label: "Reportes",       color: "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${item.color} rounded-lg p-4 text-center font-semibold text-sm hover:opacity-80 transition-opacity border border-black/5 dark:border-white/10`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

        </main>
      </div>
    </>
  );
}
