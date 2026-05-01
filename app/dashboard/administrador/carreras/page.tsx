"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useAdminConfig } from "@/app/context/AdminConfigContext";
import type { CarrerasConfig, CarreraConfig } from "@/app/context/AdminConfigContext";

const BASE = "/dashboard/administrador";

export default function CarrerasEditPage() {
  const { config, updateCarreras } = useAdminConfig();
  const [form, setForm] = useState<CarrerasConfig>(config.carreras);
  const [saved, setSaved] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useEffect(() => {
    setForm(config.carreras);
  }, [config.carreras]);

  function setHeroField(k: "heroTitulo" | "heroDescripcion", v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  }

  function setCarreraField(idx: number, k: keyof CarreraConfig, v: string) {
    setForm((f) => {
      const carreras = f.carreras.map((c, i) => (i === idx ? { ...c, [k]: v } : c));
      return { ...f, carreras };
    });
    setSaved(false);
  }

  function setDestacado(carreraIdx: number, destIdx: number, v: string) {
    setForm((f) => {
      const carreras = f.carreras.map((c, i) => {
        if (i !== carreraIdx) return c;
        const destacados = c.destacados.map((d, j) => (j === destIdx ? { text: v } : d));
        return { ...c, destacados };
      });
      return { ...f, carreras };
    });
    setSaved(false);
  }

  function addDestacado(carreraIdx: number) {
    setForm((f) => {
      const carreras = f.carreras.map((c, i) =>
        i === carreraIdx ? { ...c, destacados: [...c.destacados, { text: "" }] } : c
      );
      return { ...f, carreras };
    });
    setSaved(false);
  }

  function removeDestacado(carreraIdx: number, destIdx: number) {
    setForm((f) => {
      const carreras = f.carreras.map((c, i) =>
        i === carreraIdx ? { ...c, destacados: c.destacados.filter((_, j) => j !== destIdx) } : c
      );
      return { ...f, carreras };
    });
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateCarreras(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputBase =
    "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-colors";
  const labelBase =
    "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1";

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
        <DashboardSidebar activeLink="carreras" headerVariant="school-icon" linkBase={BASE} />

        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[960px] mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Editar Sección: Carreras
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gestiona el encabezado y el contenido de cada carrera técnica incluyendo imágenes.
            </p>
          </div>

          {saved && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200 text-sm">
              ✅ Cambios guardados exitosamente
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">

            {/* ── Encabezado ── */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">🎓 Encabezado de la Página</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Título principal</label>
                  <input type="text" value={form.heroTitulo} onChange={(e) => setHeroField("heroTitulo", e.target.value)} className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>Descripción</label>
                  <textarea rows={3} value={form.heroDescripcion} onChange={(e) => setHeroField("heroDescripcion", e.target.value)} className={inputBase} />
                </div>
              </div>
            </div>

            {/* ── Carreras ── */}
            {form.carreras.map((carrera, idx) => (
              <div key={carrera.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden">
                {/* Cabecera del accordion */}
                <button
                  type="button"
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{carrera.titulo}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${openIdx === idx ? "rotate-180" : ""}`}
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                  </svg>
                </button>

                {openIdx === idx && (
                  <div className="px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-slate-700 pt-4">

                    {/* Imagen */}
                    <div>
                      <label className={labelBase}>URL de la imagen</label>
                      <input
                        type="url"
                        value={carrera.imageSrc}
                        onChange={(e) => setCarreraField(idx, "imageSrc", e.target.value)}
                        className={inputBase}
                        placeholder="https://..."
                      />
                      {carrera.imageSrc && (
                        <div className="mt-2 rounded-lg overflow-hidden h-40 bg-slate-100 dark:bg-slate-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={carrera.imageSrc}
                            alt={carrera.imageAlt}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Título */}
                    <div>
                      <label className={labelBase}>Nombre de la carrera</label>
                      <input
                        type="text"
                        value={carrera.titulo}
                        onChange={(e) => setCarreraField(idx, "titulo", e.target.value)}
                        className={inputBase}
                      />
                    </div>

                    {/* Perfil y campo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelBase}>Perfil de Egreso</label>
                        <textarea
                          rows={4}
                          value={carrera.perfilEgreso}
                          onChange={(e) => setCarreraField(idx, "perfilEgreso", e.target.value)}
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label className={labelBase}>Campo Profesional</label>
                        <textarea
                          rows={4}
                          value={carrera.campoProfesional}
                          onChange={(e) => setCarreraField(idx, "campoProfesional", e.target.value)}
                          className={inputBase}
                        />
                      </div>
                    </div>

                    {/* Destacados del Plan de Estudios */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={labelBase + " mb-0"}>Destacados del Plan de Estudios</label>
                        <button
                          type="button"
                          onClick={() => addDestacado(idx)}
                          className="text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-100 transition-colors"
                        >
                          + Agregar
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {carrera.destacados.map((d, dIdx) => (
                          <div key={dIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={d.text}
                              onChange={(e) => setDestacado(idx, dIdx, e.target.value)}
                              className={inputBase}
                              placeholder="Materia o habilidad"
                            />
                            <button
                              type="button"
                              onClick={() => removeDestacado(idx, dIdx)}
                              disabled={carrera.destacados.length <= 1}
                              className="text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                              aria-label="Eliminar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Guardar */}
            <div className="flex justify-end gap-3 pb-6">
              <button
                type="button"
                onClick={() => { setForm(config.carreras); setSaved(false); }}
                className="px-5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Descartar cambios
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

