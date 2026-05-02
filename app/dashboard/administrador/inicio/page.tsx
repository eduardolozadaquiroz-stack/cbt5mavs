"use client";

import { useState, useEffect, useRef } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

const inputBase =
  "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition-colors";
const labelBase =
  "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1";

async function uploadSitePhoto(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("bucket", "site");
  fd.append("file", file);
  try {
    const r = await fetch("/api/storage/upload", { method: "POST", body: fd });
    const d = await r.json();
    return d.ok ? (d.url as string) : null;
  } catch {
    return null;
  }
}

function UploadBtn({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadSitePhoto(file);
    if (url) onUploaded(url);
    setUploading(false);
    e.target.value = "";
  }
  return (
    <>
      <button
        type="button"
        disabled={uploading}
        onClick={() => ref.current?.click()}
        className="flex-shrink-0 px-2.5 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {uploading ? "..." : "📁 Subir"}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </>
  );
}

interface Slide { src: string; alt: string; label: string }
interface Metrica { valor: string; etiqueta: string; descripcion: string }
interface InicioForm {
  titulo: string;
  subtitulo: string;
  descripcion: string;
  boton1Texto: string;
  boton1Href: string;
  boton2Texto: string;
  boton2Href: string;
  slides: Slide[];
  metricas: Metrica[];
}

const DEFAULT_FORM: InicioForm = {
  titulo: "",
  subtitulo: "",
  descripcion: "",
  boton1Texto: "",
  boton1Href: "",
  boton2Texto: "",
  boton2Href: "",
  slides: [
    { src: "", alt: "", label: "" },
    { src: "", alt: "", label: "" },
    { src: "", alt: "", label: "" },
  ],
  metricas: [
    { valor: "", etiqueta: "", descripcion: "" },
    { valor: "", etiqueta: "", descripcion: "" },
    { valor: "", etiqueta: "", descripcion: "" },
    { valor: "", etiqueta: "", descripcion: "" },
  ],
};

function configToForm(c: Record<string, unknown>): InicioForm {
  const hero = (c.hero as Record<string, string>) ?? {};
  const carousel = (c.carousel as Slide[]) ?? [];
  const metricas = (c.metricas as Metrica[]) ?? [];
  return {
    titulo: hero.titulo ?? "",
    subtitulo: hero.subtitulo ?? "",
    descripcion: hero.descripcion ?? "",
    boton1Texto: hero.boton1Texto ?? "",
    boton1Href: hero.boton1Href ?? "",
    boton2Texto: hero.boton2Texto ?? "",
    boton2Href: hero.boton2Href ?? "",
    slides: [0, 1, 2, 3, 4].map((i) => ({
      src: carousel[i]?.src ?? "",
      alt: carousel[i]?.alt ?? "",
      label: carousel[i]?.label ?? "",
    })),
    metricas: [0, 1, 2, 3].map((i) => ({
      valor: metricas[i]?.valor ?? "",
      etiqueta: metricas[i]?.etiqueta ?? "",
      descripcion: metricas[i]?.descripcion ?? "",
    })),
  };
}

export default function InicioEditPage() {
  const [form, setForm] = useState<InicioForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((data) => {
        if (data?.config?.inicio) setForm(configToForm(data.config.inicio));
      })
      .catch(() => setError("No se pudo cargar la configuración"))
      .finally(() => setLoading(false));
  }, []);

  function setSlide(idx: number, field: keyof Slide, value: string) {
    setForm((f) => {
      const slides = f.slides.map((s, i) => (i === idx ? { ...s, [field]: value } : s));
      return { ...f, slides };
    });
  }

  function setMetrica(idx: number, field: keyof Metrica, value: string) {
    setForm((f) => {
      const metricas = f.metricas.map((m, i) => (i === idx ? { ...m, [field]: value } : m));
      return { ...f, metricas };
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/config");
      const { config: currentConfig } = await res.json();
      const nuevaConfig = {
        ...currentConfig,
        inicio: {
          hero: {
            titulo: form.titulo,
            subtitulo: form.subtitulo,
            descripcion: form.descripcion,
            boton1Texto: form.boton1Texto,
            boton1Href: form.boton1Href,
            boton2Texto: form.boton2Texto,
            boton2Href: form.boton2Href,
          },
          carousel: form.slides,
          metricas: form.metricas,
        },
      };
      const saveRes = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: nuevaConfig }),
      });
      if (!saveRes.ok) throw new Error("Error al guardar");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

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

          {loading && (
            <div className="text-sm text-slate-500 py-8 text-center">Cargando configuración...</div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200 text-sm">
              ✅ Cambios guardados exitosamente
            </div>
          )}

          {!loading && (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Hero */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                  📄 Encabezado Principal
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={labelBase}>Título principal</label>
                    <input
                      type="text"
                      value={form.titulo}
                      onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Subtítulo</label>
                    <input
                      type="text"
                      value={form.subtitulo}
                      onChange={(e) => setForm((f) => ({ ...f, subtitulo: e.target.value }))}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Descripción</label>
                    <textarea
                      rows={2}
                      value={form.descripcion}
                      onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                      className={inputBase + " resize-none"}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelBase}>Texto Botón 1</label>
                      <input
                        type="text"
                        value={form.boton1Texto}
                        onChange={(e) => setForm((f) => ({ ...f, boton1Texto: e.target.value }))}
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Enlace Botón 1</label>
                      <input
                        type="text"
                        value={form.boton1Href}
                        onChange={(e) => setForm((f) => ({ ...f, boton1Href: e.target.value }))}
                        placeholder="/carreras"
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Texto Botón 2</label>
                      <input
                        type="text"
                        value={form.boton2Texto}
                        onChange={(e) => setForm((f) => ({ ...f, boton2Texto: e.target.value }))}
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Enlace Botón 2</label>
                      <input
                        type="text"
                        value={form.boton2Href}
                        onChange={(e) => setForm((f) => ({ ...f, boton2Href: e.target.value }))}
                        placeholder="/admision"
                        className={inputBase}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Carrusel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                  🖼️ Carrusel de Imágenes
                </h3>
                <div className="space-y-5">
                  {form.slides.map((slide, i) => (
                    <div key={i} className="border border-slate-100 dark:border-slate-700 rounded-lg p-4 space-y-3">
                      <p className={labelBase}>Imagen {i + 1}</p>
                      <div>
                        <label className={labelBase}>URL de la imagen</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slide.src}
                            onChange={(e) => setSlide(i, "src", e.target.value)}
                            placeholder="https://... o sube desde tu dispositivo"
                            className={inputBase}
                          />
                          <UploadBtn onUploaded={(url) => setSlide(i, "src", url)} />
                        </div>
                        {slide.src && (
                          <div className="mt-2 rounded-lg overflow-hidden h-32 bg-slate-100 dark:bg-slate-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={slide.src}
                              alt={slide.alt || `Slide ${i + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={labelBase}>Texto alternativo</label>
                          <input
                            type="text"
                            value={slide.alt}
                            onChange={(e) => setSlide(i, "alt", e.target.value)}
                            placeholder="Descripción de la imagen"
                            className={inputBase}
                          />
                        </div>
                        <div>
                          <label className={labelBase}>Etiqueta sobre la imagen</label>
                          <input
                            type="text"
                            value={slide.label}
                            onChange={(e) => setSlide(i, "label", e.target.value)}
                            placeholder="Ej: Laboratorios de Informática"
                            className={inputBase}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métricas */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                  📊 Estadísticas / Métricas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {form.metricas.map((m, i) => (
                    <div key={i} className="border border-slate-100 dark:border-slate-700 rounded-lg p-4 space-y-2">
                      <p className={labelBase}>Métrica {i + 1}</p>
                      <div>
                        <label className={labelBase}>Valor (ej: +1,200)</label>
                        <input
                          type="text"
                          value={m.valor}
                          onChange={(e) => setMetrica(i, "valor", e.target.value)}
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label className={labelBase}>Etiqueta</label>
                        <input
                          type="text"
                          value={m.etiqueta}
                          onChange={(e) => setMetrica(i, "etiqueta", e.target.value)}
                          placeholder="alumnos activos"
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label className={labelBase}>Descripción</label>
                        <input
                          type="text"
                          value={m.descripcion}
                          onChange={(e) => setMetrica(i, "descripcion", e.target.value)}
                          placeholder="comunidad en crecimiento"
                          className={inputBase}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "💾 Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </>
  );
}
