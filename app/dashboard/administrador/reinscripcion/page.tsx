"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import SavedToast from "@/components/SavedToast";
import FileUploadInput from "@/components/dashboard/FileUploadInput";
import { useAdminConfig } from "@/app/context/AdminConfigContext";

const BASE = "/dashboard/administrador";

export default function ReinscripcionEditPage() {
  const { config, updateReinscripcion } = useAdminConfig();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(config.reinscripcion);

  useEffect(() => {
    setForm(config.reinscripcion);
  }, [config.reinscripcion]);

  function set(k: string, v: string | number | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateReinscripcion(form);
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
        activeTopLink="edicion"
        showSearch
        linkBase={BASE}
      />

      <div className="flex pt-14">
        <DashboardSidebar activeLink="reinscripcion" headerVariant="school-icon" linkBase={BASE} />

        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[960px] mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Editar Sección: Reinscripción
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gestiona los datos del proceso de reinscripción. Al activarlo aparecerá un banner en la página principal.
            </p>
          </div>

          <SavedToast visible={saved} />

          <form onSubmit={handleSave} className="space-y-6">
            {/* Estado */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                🎯 Estado de la Sección
              </h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.habilitada}
                    onChange={(e) => set("habilitada", e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Mostrar banner de reinscripción en la página principal
                  </span>
                </label>
                <span className={`text-xs font-bold px-3 py-1 rounded ${form.habilitada ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"}`}>
                  {form.habilitada ? "VISIBLE" : "OCULTO"}
                </span>
              </div>
            </div>

            {/* Ciclo y Fechas */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                📅 Ciclo y Fechas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelBase}>Ciclo escolar</label>
                  <input
                    type="text"
                    value={form.cicloEscolar}
                    onChange={(e) => set("cicloEscolar", e.target.value)}
                    placeholder="2025-2026"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Fecha de inicio</label>
                  <input
                    type="date"
                    value={form.fechaInicio}
                    onChange={(e) => set("fechaInicio", e.target.value)}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Fecha de cierre</label>
                  <input
                    type="date"
                    value={form.fechaCierre}
                    onChange={(e) => set("fechaCierre", e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Costo */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                💰 Costo
              </h3>
              <div className="max-w-xs">
                <label className={labelBase}>Costo de reinscripción ($)</label>
                <input
                  type="number"
                  value={form.costoReinscripcion}
                  onChange={(e) => set("costoReinscripcion", parseInt(e.target.value) || 0)}
                  className={inputBase}
                />
              </div>
            </div>

            {/* Documentos */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                📄 Documentos y Formatos
              </h3>
              <div className="space-y-5">
                <div>
                  <label className={labelBase}>Documentos requeridos</label>
                  <textarea
                    value={form.documentosRequeridos}
                    onChange={(e) => set("documentosRequeridos", e.target.value)}
                    rows={3}
                    className={inputBase}
                  />
                  <p className="text-xs text-slate-400 mt-1">Separar con comas. Ej: Boleta, CURP, Comprobante de domicilio</p>
                </div>

                {/* Link / archivo de formatos */}
                <div>
                  <label className={labelBase}>Formatos / instrucciones (PDF o imagen)</label>
                  <FileUploadInput
                    currentUrl={form.linkFormatos}
                    label="Subir formato PDF / imagen"
                    bucket="avisos"
                    folder="reinscripcion/formatos"
                    onUploaded={(url) => set("linkFormatos", url)}
                  />
                  <div className="mt-2">
                    <label className="text-xs text-slate-400 block mb-1">O pega un enlace externo</label>
                    <input
                      type="url"
                      value={form.linkFormatos}
                      onChange={(e) => set("linkFormatos", e.target.value)}
                      placeholder="https://example.com/formatos-reinscripcion"
                      className={inputBase}
                    />
                  </div>
                </div>

                {/* Comprobante / referencia de pago */}
                <div>
                  <label className={labelBase}>Referencia de pago (imagen o PDF)</label>
                  <p className="text-xs text-slate-400 mb-2">Sube una imagen con los datos bancarios o referencia de pago para los alumnos.</p>
                  <FileUploadInput
                    currentUrl={form.imagenPago}
                    label="Subir referencia de pago"
                    bucket="avisos"
                    folder="reinscripcion/pago"
                    onUploaded={(url) => set("imagenPago", url)}
                  />
                </div>
              </div>
            </div>

            {/* Aviso */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                ⚠️ Aviso Importante
              </h3>
              <div>
                <label className={labelBase}>Mensaje a mostrar en el banner</label>
                <textarea
                  value={form.avisoImportante}
                  onChange={(e) => set("avisoImportante", e.target.value)}
                  rows={3}
                  className={inputBase}
                />
              </div>
            </div>

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
