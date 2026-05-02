"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useAdminConfig } from "@/app/context/AdminConfigContext";

const BASE = "/dashboard/administrador";

export default function AdmisionEditPage() {
  const { config, updateAdmision, updateSectionEnabled } = useAdminConfig();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(config.admision);

  useEffect(() => {
    setForm(config.admision);
  }, [config.admision]);

  function set(k: string, v: string | number | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateAdmision(form);
    // Sincronizar visibilidad en navbar con el estado habilitada del formulario
    updateSectionEnabled("admision", form.habilitada);
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
        <DashboardSidebar activeLink="admision" headerVariant="school-icon" linkBase={BASE} />

        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[960px] mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Editar Sección: Admisión
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gestiona los datos y contenido de la sección de admisión. Los cambios se reflejan inmediatamente en el sitio público.
            </p>
          </div>

          {saved && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200 text-sm">
              ✅ Cambios guardados exitosamente
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Habilitar/Deshabilitar sección */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                🎯 Estado de la Sección
              </h3>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.habilitada}
                    onChange={(e) => {
                      set("habilitada", e.target.checked);
                      updateSectionEnabled("admision", e.target.checked);
                    }}
                    className="w-5 h-5 rounded border-slate-300"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Mostrar sección de admisión en el sitio público
                  </span>
                </label>
                <span className={`text-xs font-bold px-3 py-1 rounded ${form.habilitada ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"}`}>
                  {form.habilitada ? "VISIBLE" : "OCULTA"}
                </span>
              </div>
            </div>

            {/* Fechas importantes */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                📅 Fechas Importantes
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelBase}>Fecha de inicio de inscripciones</label>
                  <input
                    type="date"
                    value={form.fechaInicio}
                    onChange={(e) => set("fechaInicio", e.target.value)}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Fecha de cierre de inscripciones</label>
                  <input
                    type="date"
                    value={form.fechaCierre}
                    onChange={(e) => set("fechaCierre", e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Información de cupos y precios */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                💰 Cupos y Precios
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelBase}>Cupo de admisión</label>
                  <input
                    type="number"
                    value={form.cupoActual}
                    onChange={(e) => set("cupoActual", parseInt(e.target.value))}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Costo de inscripción ($)</label>
                  <input
                    type="number"
                    value={form.precioInscripcion}
                    onChange={(e) => set("precioInscripcion", parseInt(e.target.value))}
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Documentos requeridos */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                📄 Documentos Requeridos
              </h3>
              
              <div>
                <label className={labelBase}>Lista de documentos</label>
                <textarea
                  value={form.documentosRequeridos}
                  onChange={(e) => set("documentosRequeridos", e.target.value)}
                  rows={4}
                  className={inputBase}
                />
                <p className="text-xs text-on-surface-variant mt-1">
                  Separar con comas. Ej: Certificado, INE, Comprobante
                </p>
              </div>

              <div className="mt-4">
                <label className={labelBase}>Link a formatos de admisión</label>
                <input
                  type="url"
                  value={form.linkFormatosAdmision}
                  onChange={(e) => set("linkFormatosAdmision", e.target.value)}
                  placeholder="https://example.com/formatos"
                  className={inputBase}
                />
              </div>
            </div>

            {/* Avisos importantes */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                ⚠️ Aviso Importante
              </h3>
              
              <div>
                <label className={labelBase}>Mensaje a mostrar en la sección</label>
                <textarea
                  value={form.avisoImportante}
                  onChange={(e) => set("avisoImportante", e.target.value)}
                  rows={3}
                  className={inputBase}
                />
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
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

