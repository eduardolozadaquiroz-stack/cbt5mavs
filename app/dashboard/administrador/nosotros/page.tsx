"use client";

import { useState, useEffect, useRef } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import SavedToast from "@/components/SavedToast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useAdminConfig } from "@/app/context/AdminConfigContext";
import type { DirectivoConfig, InstalacionConfig, ReconocimientoConfig, NosotrosConfig, HistoriaEvento } from "@/app/context/AdminConfigContext";

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

// Botón de subida reutilizable
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

const NIVEL_OPTIONS: DirectivoConfig["nivel"][] = [
  "director",
  "subdirector",
  "coordinador",
  "docente",
  "administrativo",
];
const NIVEL_LABEL: Record<string, string> = {
  director: "Director(a) General",
  subdirector: "Subdirector(a)",
  coordinador: "Coordinador(a)",
  docente: "Docente",
  administrativo: "Administrativo(a)",
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function NosotrosAdminPage() {
  const { config, updateNosotros } = useAdminConfig();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<NosotrosConfig>(config.nosotros);

  // Sincronizar cuando el contexto cambie externamente
  useEffect(() => {
    setForm(config.nosotros);
  }, [config.nosotros]);

  function setField(k: keyof NosotrosConfig, v: unknown) {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateNosotros(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function discard() {
    setForm(config.nosotros);
    setSaved(false);
  }

  // ── Eventos de historia (timeline) ──────────────────────────────────
  function setEvento(id: string, k: keyof HistoriaEvento, v: string) {
    setField(
      "historiaEventos",
      (form.historiaEventos ?? []).map((ev) => (ev.id === id ? { ...ev, [k]: v } : ev))
    );
  }
  function addEvento() {
    setField("historiaEventos", [
      ...(form.historiaEventos ?? []),
      { id: uid(), anio: "", evento: "" },
    ]);
  }
  function removeEvento(id: string) {
    setField("historiaEventos", (form.historiaEventos ?? []).filter((ev) => ev.id !== id));
  }
  function moveEvento(idx: number, dir: -1 | 1) {
    const arr = [...(form.historiaEventos ?? [])];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    setField("historiaEventos", arr);
  }

  // ── Directivos ──────────────────────────────────────
  function setDirectivo(id: string, k: keyof DirectivoConfig, v: string) {
    setField(
      "directivos",
      form.directivos.map((d) => (d.id === id ? { ...d, [k]: v } : d))
    );
  }
  function addDirectivo() {
    setField("directivos", [
      ...form.directivos,
      { id: uid(), nombre: "", cargo: "", nivel: "docente", img: "" },
    ]);
  }
  function removeDirectivo(id: string) {
    setField("directivos", form.directivos.filter((d) => d.id !== id));
  }
  function moveDirectivo(idx: number, dir: -1 | 1) {
    const arr = [...form.directivos];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    setField("directivos", arr);
  }

  // ── Instalaciones ────────────────────────────────────
  function setInstalacion(id: string, k: keyof InstalacionConfig, v: string) {
    setField(
      "instalaciones",
      form.instalaciones.map((i) => (i.id === id ? { ...i, [k]: v } : i))
    );
  }
  function addInstalacion() {
    setField("instalaciones", [
      ...form.instalaciones,
      { id: uid(), label: "", icon: "school", imageSrc: "" },
    ]);
  }
  function removeInstalacion(id: string) {
    setField("instalaciones", form.instalaciones.filter((i) => i.id !== id));
  }

  // ── Reconocimientos ──────────────────────────────────
  function setReconocimiento(id: string, k: keyof ReconocimientoConfig, v: string) {
    setField(
      "reconocimientos",
      form.reconocimientos.map((r) => (r.id === id ? { ...r, [k]: v } : r))
    );
  }
  function addReconocimiento() {
    setField("reconocimientos", [
      ...form.reconocimientos,
      { id: uid(), anio: new Date().getFullYear().toString(), titulo: "", descripcion: "", imageSrc: "" },
    ]);
  }
  function removeReconocimiento(id: string) {
    setField("reconocimientos", form.reconocimientos.filter((r) => r.id !== id));
  }

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
        <DashboardSidebar activeLink="nosotros" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[960px] mx-auto w-full">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Editar: Nosotros</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gestiona misión, visión, organigrama, instalaciones y reconocimientos
            </p>
          </div>

          <SavedToast visible={saved} message="✅ Cambios guardados y publicados" />

          <form onSubmit={handleSave} className="space-y-6">

            {/* ── Misión y Visión ── */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">🎯 Misión y Visión</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Misión</label>
                  <textarea
                    value={form.mision}
                    onChange={(e) => setField("mision", e.target.value)}
                    rows={4}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Visión</label>
                  <textarea
                    value={form.vision}
                    onChange={(e) => setField("vision", e.target.value)}
                    rows={4}
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* ── Historia ── */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">📚 Historia</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Texto de historia</label>
                  <textarea
                    value={form.historiaTexto}
                    onChange={(e) => setField("historiaTexto", e.target.value)}
                    rows={5}
                    className={inputBase}
                  />
                </div>

                {/* Timeline */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className={labelBase}>Línea de tiempo</label>
                    <button
                      type="button"
                      onClick={addEvento}
                      className="text-xs px-2.5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Agregar evento
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(form.historiaEventos ?? []).map((ev, idx) => (
                      <div key={ev.id} className="flex items-center gap-2 border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-slate-50 dark:bg-slate-900">
                        <div className="w-3 h-3 rounded-full bg-blue-700 flex-shrink-0" />
                        <input
                          type="text"
                          value={ev.anio}
                          onChange={(e) => setEvento(ev.id, "anio", e.target.value)}
                          placeholder="Año"
                          className="w-20 px-2 py-1 text-xs border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={ev.evento}
                          onChange={(e) => setEvento(ev.id, "evento", e.target.value)}
                          placeholder="Descripción del evento"
                          className="flex-1 px-2 py-1 text-xs border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                        <button type="button" onClick={() => moveEvento(idx, -1)} disabled={idx === 0} className="text-slate-400 hover:text-blue-600 disabled:opacity-30 text-xs">▲</button>
                        <button type="button" onClick={() => moveEvento(idx, 1)} disabled={idx === (form.historiaEventos ?? []).length - 1} className="text-slate-400 hover:text-blue-600 disabled:opacity-30 text-xs">▼</button>
                        <button type="button" onClick={() => removeEvento(ev.id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Organigrama ── */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">🏛️ Organigrama</h3>
                <button
                  type="button"
                  onClick={addDirectivo}
                  className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  + Agregar persona
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Orden visual: Director → Subdirectores → Resto. Usa las flechas para reordenar.
              </p>
              <div className="space-y-3">
                {form.directivos.map((d, idx) => (
                  <div
                    key={d.id}
                    className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-900"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar preview */}
                      <div className="flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            d.img ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              d.nombre.split(" ").slice(0, 2).join("+") || "?"
                            )}&background=1d4ed8&color=fff&size=64`
                          }
                          alt={d.nombre || "Directivo"}
                          className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 dark:border-blue-800"
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={labelBase}>Nombre completo</label>
                          <input
                            type="text"
                            value={d.nombre}
                            onChange={(e) => setDirectivo(d.id, "nombre", e.target.value)}
                            placeholder="Ej. Lic. María García"
                            className={inputBase}
                          />
                        </div>
                        <div>
                          <label className={labelBase}>Cargo</label>
                          <input
                            type="text"
                            value={d.cargo}
                            onChange={(e) => setDirectivo(d.id, "cargo", e.target.value)}
                            placeholder="Ej. Director(a) General"
                            className={inputBase}
                          />
                        </div>
                        <div>
                          <label className={labelBase}>Nivel jerárquico</label>
                          <select
                            value={d.nivel}
                            onChange={(e) =>
                              setDirectivo(d.id, "nivel", e.target.value as DirectivoConfig["nivel"])
                            }
                            className={inputBase}
                          >
                            {NIVEL_OPTIONS.map((n) => (
                              <option key={n} value={n}>
                                {NIVEL_LABEL[n]}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelBase}>URL de foto (opcional)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={d.img}
                              onChange={(e) => setDirectivo(d.id, "img", e.target.value)}
                              placeholder="https://... o sube desde tu dispositivo"
                              className={inputBase}
                            />
                            <UploadBtn onUploaded={(url) => setDirectivo(d.id, "img", url)} />
                          </div>
                        </div>
                      </div>
                      {/* Acciones */}
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => moveDirectivo(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 disabled:opacity-30"
                          title="Subir"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDirectivo(idx, 1)}
                          disabled={idx === form.directivos.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 disabled:opacity-30"
                          title="Bajar"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => removeDirectivo(d.id)}
                          className="p-1 rounded text-red-400 hover:text-red-600"
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Instalaciones ── */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">🏫 Instalaciones</h3>
                <button
                  type="button"
                  onClick={addInstalacion}
                  className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Agregar
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {form.instalaciones.map((inst) => (
                  <div
                    key={inst.id}
                    className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-900 flex flex-col gap-3"
                  >
                    {/* Preview imagen */}
                    {inst.imageSrc && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={inst.imageSrc}
                        alt={inst.label}
                        className="w-full h-28 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <label className={labelBase}>Nombre</label>
                      <input
                        type="text"
                        value={inst.label}
                        onChange={(e) => setInstalacion(inst.id, "label", e.target.value)}
                        placeholder="Ej. Laboratorio de Cómputo"
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Ícono (Material Symbol)</label>
                      <input
                        type="text"
                        value={inst.icon}
                        onChange={(e) => setInstalacion(inst.id, "icon", e.target.value)}
                        placeholder="computer"
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className={labelBase}>URL de foto (opcional)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inst.imageSrc}
                          onChange={(e) => setInstalacion(inst.id, "imageSrc", e.target.value)}
                          placeholder="https://... o sube desde tu dispositivo"
                          className={inputBase}
                        />
                        <UploadBtn onUploaded={(url) => setInstalacion(inst.id, "imageSrc", url)} />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeInstalacion(inst.id)}
                      className="text-xs text-red-500 hover:text-red-700 text-right"
                    >
                      🗑 Eliminar instalación
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Reconocimientos ── */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">🏆 Reconocimientos y Logros</h3>
                <button
                  type="button"
                  onClick={addReconocimiento}
                  className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Agregar
                </button>
              </div>
              <div className="space-y-4">
                {form.reconocimientos.map((r) => (
                  <div
                    key={r.id}
                    className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row gap-4"
                  >
                    {/* Preview foto */}
                    <div className="flex-shrink-0 sm:w-40">
                      {r.imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.imageSrc}
                          alt={r.titulo}
                          className="w-full h-28 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-28 flex items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                          <span className="material-symbols-outlined text-yellow-500 text-4xl">emoji_events</span>
                        </div>
                      )}
                      <div className="mt-2">
                        <label className={labelBase}>URL de foto</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={r.imageSrc}
                            onChange={(e) => setReconocimiento(r.id, "imageSrc", e.target.value)}
                            placeholder="https://... o sube desde tu dispositivo"
                            className={inputBase}
                          />
                          <UploadBtn onUploaded={(url) => setReconocimiento(r.id, "imageSrc", url)} />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className={labelBase}>Año</label>
                        <input
                          type="text"
                          value={r.anio}
                          onChange={(e) => setReconocimiento(r.id, "anio", e.target.value)}
                          placeholder="2024"
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label className={labelBase}>Título</label>
                        <input
                          type="text"
                          value={r.titulo}
                          onChange={(e) => setReconocimiento(r.id, "titulo", e.target.value)}
                          placeholder="Reconocimiento de Excelencia"
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label className={labelBase}>Descripción</label>
                        <textarea
                          value={r.descripcion}
                          onChange={(e) => setReconocimiento(r.id, "descripcion", e.target.value)}
                          rows={2}
                          className={inputBase}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeReconocimiento(r.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        🗑 Eliminar reconocimiento
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Botones ── */}
            <div className="flex gap-3 flex-wrap">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                💾 Guardar cambios
              </button>
              <button
                type="button"
                onClick={discard}
                className="px-6 py-2 border border-outline text-on-surface rounded-lg hover:bg-surface-variant font-medium transition-colors"
              >
                ↩ Descartar cambios
              </button>
              <a
                href="/nosotros"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 border border-blue-300 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-colors"
              >
                👁 Ver página pública
              </a>
            </div>

          </form>
        </main>
      </div>
    </>
  );
}
