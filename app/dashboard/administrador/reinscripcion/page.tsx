"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import SavedToast from "@/components/SavedToast";
import FileUploadInput from "@/components/dashboard/FileUploadInput";
import { useAdminConfig } from "@/app/context/AdminConfigContext";

// ─────────────────────────────────────────────
// Tipos de solicitudes
// ─────────────────────────────────────────────
interface Documento {
  id: string;
  nombre: string;
  url: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  notas: string | null;
}

interface Solicitud {
  id: string;
  estado: string;
  notas_admin: string | null;
  ciclo_escolar: string;
  updated_at: string;
  alumnos: {
    matricula: string;
    semestre_actual: number;
    usuarios: { nombre: string; apellido_paterno: string; apellido_materno: string; email: string };
    carreras: { nombre: string; clave: string } | null;
  };
  reinscripcion_documentos: Documento[];
}

const ESTADO_COLORS: Record<string, string> = {
  borrador:    "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  enviada:     "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  en_revision: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  aprobada:    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  rechazada:   "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const ESTADO_LABELS: Record<string, string> = {
  borrador:    "Borrador",
  enviada:     "Enviada",
  en_revision: "En revisión",
  aprobada:    "Aprobada",
  rechazada:   "Rechazada",
};

const DOC_COLORS: Record<string, string> = {
  pendiente: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
  aprobado:  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  rechazado: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

// ─── Sub-componente: Modal detalle solicitud ────────────────────────────────
function ModalDetalleSolicitud({
  solicitud,
  onClose,
  onUpdated,
}: {
  solicitud: Solicitud;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [notasAdmin, setNotasAdmin] = useState(solicitud.notas_admin ?? "");
  const [saving, setSaving] = useState(false);
  const [docNotas, setDocNotas] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  async function updateSolicitud(estado: string) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reinscripcion/solicitudes/${solicitud.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, notas_admin: notasAdmin || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      onUpdated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  async function updateDoc(docId: string, estado: string) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/reinscripcion/solicitudes/${solicitud.id}/documentos/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, notas: docNotas[docId] || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              {[solicitud.alumnos.usuarios.apellido_paterno, solicitud.alumnos.usuarios.apellido_materno, solicitud.alumnos.usuarios.nombre].filter(Boolean).join(" ")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {solicitud.alumnos.matricula} · {solicitud.alumnos.carreras?.nombre ?? "—"} · Sem. {solicitud.alumnos.semestre_actual}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="px-6 py-4 space-y-5">
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          {/* Estado actual */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Estado:</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLORS[solicitud.estado] ?? ""}`}>
              {ESTADO_LABELS[solicitud.estado] ?? solicitud.estado}
            </span>
          </div>

          {/* Documentos */}
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 text-sm">Documentos</h4>
            {solicitud.reinscripcion_documentos.length === 0 ? (
              <p className="text-xs text-slate-400">No hay documentos subidos aún.</p>
            ) : (
              <div className="space-y-3">
                {solicitud.reinscripcion_documentos.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{doc.nombre}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DOC_COLORS[doc.estado]}`}>
                          {doc.estado}
                        </span>
                      </div>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0">
                        Ver
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nota al alumno (opcional)"
                        value={docNotas[doc.id] ?? doc.notas ?? ""}
                        onChange={e => setDocNotas(n => ({ ...n, [doc.id]: e.target.value }))}
                        className="flex-1 text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                      />
                      <button onClick={() => updateDoc(doc.id, "aprobado")}
                        className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded">
                        Aprobar
                      </button>
                      <button onClick={() => updateDoc(doc.id, "rechazado")}
                        className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded">
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notas admin */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
              Notas para el alumno
            </label>
            <textarea
              value={notasAdmin}
              onChange={e => setNotasAdmin(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              placeholder="Mensaje opcional para el alumno..."
            />
          </div>

          {/* Acciones */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button disabled={saving} onClick={() => updateSolicitud("en_revision")}
              className="px-3 py-1.5 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg disabled:opacity-50">
              Marcar en revisión
            </button>
            <button disabled={saving} onClick={() => updateSolicitud("aprobada")}
              className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50">
              Aprobar solicitud ✓
            </button>
            <button disabled={saving} onClick={() => updateSolicitud("rechazada")}
              className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50">
              Rechazar solicitud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-componente: Panel de solicitudes ───────────────────────────────────
function SolicitudesPanel() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Solicitud | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (filtroEstado) params.set("estado", filtroEstado);
    if (search.trim()) params.set("search", search.trim());
    try {
      const res = await fetch(`/api/admin/reinscripcion/solicitudes?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setSolicitudes(data.solicitudes ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [filtroEstado, search]);

  useEffect(() => { fetch_(); }, [fetch_]);

  async function openDetail(s: Solicitud) {
    // Fetch detalle fresco
    const res = await fetch(`/api/admin/reinscripcion/solicitudes/${s.id}`);
    const data = await res.json();
    if (res.ok) setSelected(data.solicitud);
    else setSelected(s);
  }

  return (
    <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        📋 Solicitudes de Reinscripción
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{total} solicitudes en este ciclo</p>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[160px] px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
        />
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        >
          <option value="">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="enviada">Enviada</option>
          <option value="en_revision">En revisión</option>
          <option value="aprobada">Aprobada</option>
          <option value="rechazada">Rechazada</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {loading && <p className="text-sm text-slate-400">Cargando...</p>}

      {!loading && solicitudes.length === 0 && (
        <p className="text-sm text-slate-400 py-4 text-center">No hay solicitudes con ese filtro.</p>
      )}

      {!loading && solicitudes.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Alumno</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Matrícula</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">Carrera</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Estado</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">Docs</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {solicitudes.map((s) => {
                const u = s.alumnos.usuarios;
                const nombre = [u.apellido_paterno, u.apellido_materno, u.nombre].filter(Boolean).join(" ");
                const docs = s.reinscripcion_documentos ?? [];
                const aprobados = docs.filter(d => d.estado === "aprobado").length;
                return (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{nombre}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">{s.alumnos.matricula}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden sm:table-cell">{s.alumnos.carreras?.clave ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLORS[s.estado] ?? ""}`}>
                        {ESTADO_LABELS[s.estado] ?? s.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">
                      {aprobados}/{docs.length}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openDetail(s)}
                        className="text-xs px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        Revisar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <ModalDetalleSolicitud
          solicitud={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => { setSelected(null); fetch_(); }}
        />
      )}
    </div>
  );
}

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

          {/* ── Solicitudes ── */}
          <div className="mt-8">
            <SolicitudesPanel />
          </div>
        </main>
      </div>
    </>
  );
}
