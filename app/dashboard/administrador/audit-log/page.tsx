"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";
const TZ = "America/Mexico_City";
const LIMIT = 25;

interface ApiLog {
  id: string;
  accion: string;
  tabla: string;
  registro_id: string;
  datos_anteriores: Record<string, unknown> | null;
  datos_nuevos: Record<string, unknown> | null;
  created_at: string;
  usuario: { nombre: string; correo: string; rol: string } | null;
}

const actionColor: Record<string, string> = {
  INSERT: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  UPDATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

const actionLabel: Record<string, string> = {
  INSERT: "CREAR",
  UPDATE: "MODIFICAR",
  DELETE: "ELIMINAR",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDetalle(log: ApiLog): string {
  const data = log.datos_nuevos ?? log.datos_anteriores;
  if (!data) return `${log.tabla} #${String(log.registro_id).slice(0, 8)}`;
  const entries = Object.entries(data)
    .filter(([k]) => k !== "id" && k !== "auth_id")
    .slice(0, 3);
  if (entries.length === 0) return `${log.tabla} #${String(log.registro_id).slice(0, 8)}`;
  return entries.map(([k, v]) => `${k}: ${String(v).slice(0, 40)}`).join(" · ");
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchLogs = useCallback(async (p: number) => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`/api/admin/audit-log?page=${p}&limit=${LIMIT}`);
      if (!r.ok) throw new Error("Error al obtener el historial");
      const d = await r.json();
      setLogs(d.logs ?? []);
      setTotal(d.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(page);
  }, [page, fetchLogs]);

  const filtrados = logs.filter((l) => {
    const q = query.toLowerCase();
    const usuario = l.usuario?.nombre ?? l.usuario?.correo ?? "";
    return (
      usuario.toLowerCase().includes(q) ||
      l.accion.toLowerCase().includes(q) ||
      l.tabla.toLowerCase().includes(q) ||
      formatDetalle(l).toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      <DashboardTopbar
        userImageAlt="Administrador"
        activeTopLink="audit-log"
        showSearch
        linkBase={BASE}
      />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="audit-log" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Audit Log</h2>
              <p className="text-on-surface-variant mt-1">
                Historial de acciones realizadas en el sistema. Hora en zona CDMX.
              </p>
            </div>
            <button
              onClick={() => fetchLogs(page)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-semibold rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              Actualizar
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="bg-surface border border-outline-variant rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant">
              <div className="relative w-full sm:w-80">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filtrar por usuario, acción, tabla..."
                  className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded bg-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="py-12 text-center text-sm text-on-surface-variant">Cargando historial...</div>
              ) : (
                <table className="w-full text-left text-sm min-w-[780px]">
                  <thead className="bg-surface-variant">
                    <tr>
                      {["Fecha y Hora (CDMX)", "Usuario", "Rol", "Acción", "Tabla", "Detalle"].map((h) => (
                        <th key={h} className="p-2 px-4 border-b border-outline-variant text-on-surface-variant uppercase tracking-wider text-xs font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-on-surface-variant">Sin registros</td>
                      </tr>
                    ) : filtrados.map((l) => (
                      <tr key={l.id} className="odd:bg-surface even:bg-surface-bright hover:bg-surface-container-lowest transition-colors">
                        <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant font-mono text-xs whitespace-nowrap">
                          {formatDate(l.created_at)}
                        </td>
                        <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant text-xs">
                          {l.usuario?.nombre ?? l.usuario?.correo ?? "—"}
                        </td>
                        <td className="p-2 px-4 border-b border-outline-variant">
                          <span className="text-xs font-medium text-on-surface-variant capitalize">
                            {l.usuario?.rol ?? "—"}
                          </span>
                        </td>
                        <td className="p-2 px-4 border-b border-outline-variant">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${actionColor[l.accion] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                            {actionLabel[l.accion] ?? l.accion}
                          </span>
                        </td>
                        <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{l.tabla}</td>
                        <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant text-xs max-w-xs truncate" title={formatDetalle(l)}>
                          {formatDetalle(l)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-3 px-4 border-t border-outline-variant flex items-center justify-between text-sm text-on-surface-variant flex-wrap gap-2">
              <span>{filtrados.length} entradas mostradas · {total} total</span>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 rounded border border-outline-variant disabled:opacity-40 hover:bg-surface-variant transition-colors text-xs"
                  >
                    ← Anterior
                  </button>
                  <span className="text-xs">Pág {page} / {totalPages}</span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 rounded border border-outline-variant disabled:opacity-40 hover:bg-surface-variant transition-colors text-xs"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
