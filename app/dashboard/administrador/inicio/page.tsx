"use client";

import { useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

export default function InicioEditPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    tituloPrincipal: "Centro de Bachillerato Tecnológico Núm. 5",
    subtituloPrincipal: "Formando profesionales del futuro",
    imagenCarrusel1: "/images/carrusel1.jpg",
    imagenCarrusel2: "/images/carrusel2.jpg",
    imagenCarrusel3: "/images/carrusel3.jpg",
    textoCTA: "Inicia tu formación ahora",
    linkCTA: "/admision",
    estadisticasAlumnos: 1245,
    estadisticasDocentes: 85,
    estadisticasCarreras: 3,
  });

  function set(k: string, v: string | number) {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputBase =
    "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-colors";
  const labelBase = "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1";

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador"
        userName="Mtra. Viderique"
        userRole="Administradora"
        activeTopLink="dashboard"
        showSearch
        linkBase={BASE}
      />

      <div className="flex pt-14">
        <DashboardSidebar activeLink="inicio" headerVariant="school-icon" linkBase={BASE} />

        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[960px] mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Editar Sección: Inicio
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gestiona el contenido principal de la página de inicio
            </p>
          </div>

          {saved && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200 text-sm">
              ✅ Cambios guardados exitosamente
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Encabezado principal */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                📄 Encabezado Principal
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Título principal</label>
                  <input
                    type="text"
                    value={form.tituloPrincipal}
                    onChange={(e) => set("tituloPrincipal", e.target.value)}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Subtítulo</label>
                  <input
                    type="text"
                    value={form.subtituloPrincipal}
                    onChange={(e) => set("subtituloPrincipal", e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Carrusel de imágenes */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                🖼️ Carrusel de Imágenes
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Imagen 1 (URL o ruta)</label>
                  <input
                    type="text"
                    value={form.imagenCarrusel1}
                    onChange={(e) => set("imagenCarrusel1", e.target.value)}
                    placeholder="/images/carrusel1.jpg"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Imagen 2 (URL o ruta)</label>
                  <input
                    type="text"
                    value={form.imagenCarrusel2}
                    onChange={(e) => set("imagenCarrusel2", e.target.value)}
                    placeholder="/images/carrusel2.jpg"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Imagen 3 (URL o ruta)</label>
                  <input
                    type="text"
                    value={form.imagenCarrusel3}
                    onChange={(e) => set("imagenCarrusel3", e.target.value)}
                    placeholder="/images/carrusel3.jpg"
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                🎯 Botón de Acción
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Texto del botón</label>
                  <input
                    type="text"
                    value={form.textoCTA}
                    onChange={(e) => set("textoCTA", e.target.value)}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Enlace del botón</label>
                  <input
                    type="text"
                    value={form.linkCTA}
                    onChange={(e) => set("linkCTA", e.target.value)}
                    placeholder="/admision"
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                📊 Estadísticas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelBase}>Total de alumnos</label>
                  <input
                    type="number"
                    value={form.estadisticasAlumnos}
                    onChange={(e) => set("estadisticasAlumnos", parseInt(e.target.value))}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Docentes</label>
                  <input
                    type="number"
                    value={form.estadisticasDocentes}
                    onChange={(e) => set("estadisticasDocentes", parseInt(e.target.value))}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Carreras disponibles</label>
                  <input
                    type="number"
                    value={form.estadisticasCarreras}
                    onChange={(e) => set("estadisticasCarreras", parseInt(e.target.value))}
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                💾 Guardar cambios
              </button>
              <button
                type="button"
                className="px-6 py-2 border border-outline text-on-surface rounded-lg hover:bg-surface-variant font-medium transition-colors"
              >
                📋 Vista previa
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
