"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Link from "next/link";

const BASE = "/dashboard/administrador";

interface Ciclo {
  id: string;
  nombre: string;
  periodo: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

const PERIODOS_SUGERIDOS = [
  "Primer Parcial",
  "Segundo Parcial",
  "Tercer Parcial",
];

export default function PeriodosPage() {
  const [ciclos, setCiclos]     = useState<Ciclo[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState<string | null>(null); // id del ciclo que se está cambiando
  const [modal, setModal]       = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    periodo: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const fetchCiclos = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/ciclos");
    const data = await res.json();
    setCiclos(data.ciclos ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCiclos(); }, [fetchCiclos]);

  async function toggleActivo(ciclo: Ciclo) {
    setSaving(ciclo.id);
    const res = await fetch("/api/admin/ciclos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ciclo.id, activo: !ciclo.activo }),
    });
    if (res.ok) {
      await fetchCiclos();
    }
    setSaving(null);
  }

  async function handleCrear() {
    setFormError("");
    if (!form.nombre.trim() || !form.periodo.trim() || !form.fecha_inicio || !form.fecha_fin) {
      setFormError("Todos los campos son obligatorios.");
      return;
    }
    if (form.fecha_fin <= form.fecha_inicio) {
      setFormError("La fecha fin debe ser posterior a la fecha de inicio.");
      return;
    }
    setSaving("new");
    const res = await fetch("/api/admin/ciclos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setFormError(data.error ?? "Error al crear el ciclo.");
      setSaving(null);
      return;
    }
    setModal(false);
    setForm({ nombre: "", periodo: "", fecha_inicio: "", fecha_fin: "" });
    await fetchCiclos();
    setSaving(null);
  }

  function handleCerrarModal() {
    setModal(false);
    setFormError("");
    setForm({ nombre: "", periodo: "", fecha_inicio: "", fecha_fin: "" });
  }

  const inputBase = "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300";
  const labelBase = "text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1";

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador" userName="Mtra. Viderique" userRole="Administradora"
        activeTopLink="configuracion" showSearch linkBase={BASE}
      />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="inicio" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[960px] mx-auto w-full">

          <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
            <Link href={`${BASE}/configuracion`} className="hover:text-blue-700 transition-colors">Configuración</Link>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Periodos escolares</span>
          </div>

          <div className="mb-5 flex justify-between items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Periodos escolares</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Gestiona los ciclos y parciales del sistema</p>
            </div>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Nuevo periodo
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-12 text-center text-sm text-slate-500">Cargando periodos…</div>
            ) : ciclos.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">No hay periodos registrados.</div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-2.5 text-left border-b border-slate-200 dark:border-slate-700">Nombre</th>
                    <th className="px-4 py-2.5 text-center border-b border-slate-200 dark:border-slate-700">Clave</th>
                    <th className="px-4 py-2.5 text-center border-b border-slate-200 dark:border-slate-700">Inicio</th>
                    <th className="px-4 py-2.5 text-center border-b border-slate-200 dark:border-slate-700">Fin</th>
                    <th className="px-4 py-2.5 text-center border-b border-slate-200 dark:border-slate-700">Estado</th>
                    <th className="px-4 py-2.5 text-right border-b border-slate-200 dark:border-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ciclos.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100">{c.nombre}</td>
                      <td className="px-4 py-3 text-center text-xs font-mono text-slate-500">{c.periodo}</td>
                      <td className="px-4 py-3 text-center text-xs text-slate-500">{c.fecha_inicio}</td>
                      <td className="px-4 py-3 text-center text-xs text-slate-500">{c.fecha_fin}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${c.activo ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                          {c.activo ? "Activo" : "Cerrado"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleActivo(c)}
                          disabled={saving === c.id}
                          className={`text-xs px-2 py-1 rounded border transition-colors ${
                            c.activo
                              ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                              : "border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                          } disabled:opacity-50`}
                        >
                          {saving === c.id ? "…" : c.activo ? "Cerrar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Solo puede haber <strong>un periodo activo</strong> a la vez. Al activar uno, los demás se cierran automáticamente.
          </p>
        </main>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-5">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-4">Nuevo periodo escolar</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelBase}>Nombre del periodo</label>
                <input
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Ej. Ciclo 2026-2027 — Primer Parcial"
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>Parcial</label>
                <div className="flex gap-2">
                  {PERIODOS_SUGERIDOS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, nombre: f.nombre.split("—")[0].trim() ? `${f.nombre.split("—")[0].trim()} — ${s}` : s }))}
                      className="text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelBase}>Clave única del periodo <span className="font-normal normal-case">(ej: 2026-1, 2026-2)</span></label>
                <input
                  value={form.periodo}
                  onChange={(e) => setForm((f) => ({ ...f, periodo: e.target.value }))}
                  placeholder="Ej. 2026-1"
                  maxLength={20}
                  className={inputBase}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelBase}>Fecha inicio</label>
                  <input type="date" value={form.fecha_inicio} onChange={(e) => setForm((f) => ({ ...f, fecha_inicio: e.target.value }))} className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>Fecha fin</label>
                  <input type="date" value={form.fecha_fin} onChange={(e) => setForm((f) => ({ ...f, fecha_fin: e.target.value }))} className={inputBase} />
                </div>
              </div>
              {formError && <p className="text-xs text-red-600">{formError}</p>}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handleCerrarModal} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
              <button onClick={handleCrear} disabled={saving === "new"} className="flex-1 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-60">
                {saving === "new" ? "Guardando…" : "Crear periodo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
