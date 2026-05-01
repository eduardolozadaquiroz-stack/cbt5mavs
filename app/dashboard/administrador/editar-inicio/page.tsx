"use client";

import { useState, useEffect } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useAdminConfig } from "@/app/context/AdminConfigContext";
import type { InicioConfig, CarouselSlide, Metrica } from "@/app/context/AdminConfigContext";

const BASE = "/dashboard/administrador";

export default function EditarInicioPage() {
  const { config, updateInicio } = useAdminConfig();
  const [form, setForm] = useState<InicioConfig>(config.inicio);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(config.inicio);
  }, [config.inicio]);

  function setHeroField(k: keyof InicioConfig["hero"], v: string) {
    setForm((f) => ({ ...f, hero: { ...f.hero, [k]: v } }));
    setSaved(false);
  }

  function setSlide(idx: number, k: keyof CarouselSlide, v: string) {
    setForm((f) => {
      const carousel = f.carousel.map((s, i) => (i === idx ? { ...s, [k]: v } : s));
      return { ...f, carousel };
    });
    setSaved(false);
  }

  function addSlide() {
    setForm((f) => ({
      ...f,
      carousel: [...f.carousel, { src: "", alt: "", label: "" }],
    }));
    setSaved(false);
  }

  function removeSlide(idx: number) {
    if (form.carousel.length <= 1) return;
    setForm((f) => ({ ...f, carousel: f.carousel.filter((_, i) => i !== idx) }));
    setSaved(false);
  }

  function setMetrica(idx: number, k: keyof Metrica, v: string) {
    setForm((f) => {
      const metricas = f.metricas.map((m, i) => (i === idx ? { ...m, [k]: v } : m));
      return { ...f, metricas };
    });
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateInicio(form);
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
        <DashboardSidebar activeLink="editar-inicio" headerVariant="school-icon" linkBase={BASE} />

        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[960px] mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Editar Sección: Inicio
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gestiona el Hero, imágenes del carrusel y métricas. Los cambios se reflejan de inmediato en el sitio público.
            </p>
          </div>

          {saved && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200 text-sm">
              ✅ Cambios guardados exitosamente
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">

            {/* ── Hero ── */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">🖼️ Hero Principal</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Etiqueta superior</label>
                  <input type="text" value={form.hero.subtitulo} onChange={(e) => setHeroField("subtitulo", e.target.value)} className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>Título principal</label>
                  <textarea rows={3} value={form.hero.titulo} onChange={(e) => setHeroField("titulo", e.target.value)} className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>Descripción</label>
                  <textarea rows={2} value={form.hero.descripcion} onChange={(e) => setHeroField("descripcion", e.target.value)} className={inputBase} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Botón Principal</p>
                    <div>
                      <label className={labelBase}>Texto</label>
                      <input type="text" value={form.hero.boton1Texto} onChange={(e) => setHeroField("boton1Texto", e.target.value)} className={inputBase} />
                    </div>
                    <div>
                      <label className={labelBase}>Enlace (href)</label>
                      <input type="text" value={form.hero.boton1Href} onChange={(e) => setHeroField("boton1Href", e.target.value)} className={inputBase} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Botón Secundario</p>
                    <div>
                      <label className={labelBase}>Texto</label>
                      <input type="text" value={form.hero.boton2Texto} onChange={(e) => setHeroField("boton2Texto", e.target.value)} className={inputBase} />
                    </div>
                    <div>
                      <label className={labelBase}>Enlace (href)</label>
                      <input type="text" value={form.hero.boton2Href} onChange={(e) => setHeroField("boton2Href", e.target.value)} className={inputBase} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Carrusel ── */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">🎠 Imágenes del Carrusel</h3>
                <button type="button" onClick={addSlide} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-100 transition-colors">
                  + Agregar imagen
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Pega la URL de la imagen (Unsplash, servidor propio, etc.). Resolución recomendada: 1600×900px.
              </p>
              <div className="space-y-4">
                {form.carousel.map((slide, idx) => (
                  <div key={idx} className="border border-slate-100 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Imagen {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeSlide(idx)}
                        disabled={form.carousel.length <= 1}
                        className="text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <label className={labelBase}>URL de imagen</label>
                        <input type="url" value={slide.src} onChange={(e) => setSlide(idx, "src", e.target.value)} className={inputBase} placeholder="https://..." />
                      </div>
                      <div>
                        <label className={labelBase}>Etiqueta</label>
                        <input type="text" value={slide.label} onChange={(e) => setSlide(idx, "label", e.target.value)} className={inputBase} placeholder="Descripción corta" />
                      </div>
                    </div>
                    {slide.src && (
                      <div className="mt-3 rounded-lg overflow-hidden h-28 bg-slate-100 dark:bg-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={slide.src} alt={slide.alt || "Vista previa"} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Métricas ── */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">📊 Métricas Destacadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {form.metricas.map((m, idx) => (
                  <div key={idx} className="border border-slate-100 dark:border-slate-700 rounded-lg p-4 space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Métrica {idx + 1}</p>
                    <div>
                      <label className={labelBase}>Valor</label>
                      <input type="text" value={m.valor} onChange={(e) => setMetrica(idx, "valor", e.target.value)} className={inputBase} placeholder="+1,200" />
                    </div>
                    <div>
                      <label className={labelBase}>Etiqueta</label>
                      <input type="text" value={m.etiqueta} onChange={(e) => setMetrica(idx, "etiqueta", e.target.value)} className={inputBase} placeholder="alumnos activos" />
                    </div>
                    <div>
                      <label className={labelBase}>Descripción</label>
                      <input type="text" value={m.descripcion} onChange={(e) => setMetrica(idx, "descripcion", e.target.value)} className={inputBase} placeholder="comunidad en crecimiento" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guardar */}
            <div className="flex justify-end gap-3 pb-6">
              <button
                type="button"
                onClick={() => { setForm(config.inicio); setSaved(false); }}
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


