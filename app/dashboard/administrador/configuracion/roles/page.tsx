"use client";

import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Link from "next/link";

const BASE = "/dashboard/administrador";

interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: string[];
  color: string;
  usuarios: number;
}

const TODOS_PERMISOS = [
  "Ver dashboard", "Gestionar usuarios", "Gestionar grupos", "Ver calificaciones",
  "Editar calificaciones", "Ver asistencias", "Editar asistencias", "Ver horarios",
  "Editar horarios", "Ver avisos", "Publicar avisos", "Ver reportes",
  "Generar reportes", "Configuración del sistema", "Ver audit log",
];

const rolesIniciales: Rol[] = [
  {
    id: 1, nombre: "Administrador", descripcion: "Acceso completo al sistema",
    permisos: TODOS_PERMISOS, color: "bg-purple-100 text-purple-800", usuarios: 2,
  },
  {
    id: 2, nombre: "Maestro", descripcion: "Acceso a calificaciones, asistencias y horarios de sus grupos",
    permisos: ["Ver dashboard", "Ver calificaciones", "Editar calificaciones", "Ver asistencias", "Editar asistencias", "Ver horarios", "Ver avisos"],
    color: "bg-blue-100 text-blue-800", usuarios: 24,
  },
  {
    id: 3, nombre: "Alumno", descripcion: "Acceso de solo lectura a sus propios datos",
    permisos: ["Ver dashboard", "Ver calificaciones", "Ver asistencias", "Ver horarios", "Ver avisos"],
    color: "bg-green-100 text-green-800", usuarios: 186,
  },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>(rolesIniciales);
  const [selected, setSelected] = useState<Rol | null>(null);

  function togglePermiso(permiso: string) {
    if (!selected) return;
    const tiene = selected.permisos.includes(permiso);
    const nuevos = tiene ? selected.permisos.filter((p) => p !== permiso) : [...selected.permisos, permiso];
    const updated = { ...selected, permisos: nuevos };
    setSelected(updated);
    setRoles((r) => r.map((x) => (x.id === selected.id ? updated : x)));
  }

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador" userName="Mtra. Viderique" userRole="Administradora"
        activeTopLink="configuracion" showSearch linkBase={BASE}
      />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="configuracion" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1100px] mx-auto w-full">

          <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
            <Link href={`${BASE}/configuracion`} className="hover:text-blue-700 transition-colors">Configuración</Link>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Roles y permisos</span>
          </div>

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Roles y permisos</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Define los niveles de acceso para cada tipo de usuario</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Lista de roles */}
            <div className="flex flex-col gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(selected?.id === r.id ? null : r)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${selected?.id === r.id ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300"}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.color} dark:bg-opacity-30`}>{r.nombre}</span>
                    <span className="text-xs text-slate-400">{r.usuarios} usuarios</span>
                  </div>
                  <p className="text-xs text-slate-500">{r.descripcion}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{r.permisos.length} permisos activos</p>
                </button>
              ))}
            </div>

            {/* Editor de permisos */}
            <div className="md:col-span-2">
              {selected ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                      Permisos — {selected.nombre}
                    </h3>
                    <span className="text-xs text-slate-400">{selected.permisos.length} / {TODOS_PERMISOS.length}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TODOS_PERMISOS.map((permiso) => {
                      const tiene = selected.permisos.includes(permiso);
                      return (
                        <label key={permiso} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div
                            onClick={() => togglePermiso(permiso)}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${tiene ? "bg-blue-600 border-blue-600" : "border-slate-300 dark:border-slate-600"}`}
                          >
                            {tiene && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                          </div>
                          <span className={`text-xs ${tiene ? "text-slate-800 dark:text-slate-200 font-medium" : "text-slate-500"}`}>{permiso}</span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-slate-400">Los cambios se aplican inmediatamente a todos los usuarios con este rol.</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 text-sm">
                  Selecciona un rol para editar sus permisos
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
