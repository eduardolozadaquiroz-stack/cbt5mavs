"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const BASE = "/dashboard/administrador";

export interface AuditEntry {
  id: number;
  timestamp: string;   // ISO string
  user: string;
  role: "Admin" | "Maestro" | "Alumno";
  action: string;      // ej. "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT"
  entity: string;      // ej. "Usuario" | "Calificación"
  detail: string;
}

const SEED: AuditEntry[] = [
  { id: 1, timestamp: "2024-06-28T09:15:00Z", user: "admin@cbt5.edu.mx",     role: "Admin",   action: "LOGIN",  entity: "Sesión",       detail: "Inicio de sesión exitoso" },
  { id: 2, timestamp: "2024-06-28T09:17:42Z", user: "admin@cbt5.edu.mx",     role: "Admin",   action: "CREATE", entity: "Usuario",      detail: "Creó cuenta para d.torres@cbt5.edu.mx" },
  { id: 3, timestamp: "2024-06-28T10:03:11Z", user: "j.perez@cbt5.edu.mx",   role: "Maestro", action: "UPDATE", entity: "Calificación", detail: "Modificó calificación de matrícula 230145 → 9.2" },
  { id: 4, timestamp: "2024-06-28T11:30:55Z", user: "r.garcia@cbt5.edu.mx",  role: "Maestro", action: "CREATE", entity: "Asistencia",   detail: "Registró asistencia grupo G-GAS-2A" },
  { id: 5, timestamp: "2024-06-27T08:55:00Z", user: "admin@cbt5.edu.mx",     role: "Admin",   action: "DELETE", entity: "Usuario",      detail: "Desactivó cuenta e.vargas@cbt5.edu.mx" },
];

const actionColor: Record<string, string> = {
  LOGIN:   "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  LOGOUT:  "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  CREATE:  "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  UPDATE:  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  DELETE:  "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

const LS_KEY = "cbt-audit-log";

/** Escribe una entrada nueva en el audit log (llamar desde otros módulos) */
export function logAudit(entry: Omit<AuditEntry, "id" | "timestamp">) {
  if (typeof window === "undefined") return;
  const prev: AuditEntry[] = JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
  const newEntry: AuditEntry = {
    ...entry,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(LS_KEY, JSON.stringify([newEntry, ...prev]));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) {
      setLogs(JSON.parse(stored));
    } else {
      // Cargar seed solo la primera vez
      localStorage.setItem(LS_KEY, JSON.stringify(SEED));
      setLogs(SEED);
    }
  }, []);

  const filtrados = logs.filter((l) => {
    const q = query.toLowerCase();
    return (
      l.user.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.entity.toLowerCase().includes(q) ||
      l.detail.toLowerCase().includes(q)
    );
  });

  function handleClear() {
    if (!confirm("¿Eliminar todo el historial de auditoría? Esta acción no se puede deshacer.")) return;
    localStorage.removeItem(LS_KEY);
    setLogs([]);
  }

  return (
    <>
      <DashboardTopbar userImageAlt="Administrador" userName="Mtra. Viderique" userRole="Administradora" activeTopLink="audit-log" showSearch linkBase={BASE} />
      <div className="flex pt-14">
        <DashboardSidebar activeLink="audit-log" headerVariant="school-icon" linkBase={BASE} />
        <main className="flex-1 md:ml-64 p-4 md:p-5 lg:p-6 max-w-[1280px] mx-auto w-full">

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Audit Log</h2>
              <p className="text-on-surface-variant mt-1">Historial de acciones realizadas en el sistema por todos los usuarios.</p>
            </div>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 text-sm font-semibold rounded hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Limpiar historial
            </button>
          </div>

          {/* Aviso de arquitectura */}
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200 flex gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <p>El historial se almacena localmente en este navegador (<code className="font-mono text-xs">localStorage[&quot;cbt-audit-log&quot;]</code>). Al integrar un backend, solo cambia el destino de escritura en <code className="font-mono text-xs">logAudit()</code>.</p>
          </div>

          <div className="bg-surface border border-outline-variant rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant">
              <div className="relative w-full sm:w-80">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filtrar por usuario, acción, entidad..." className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded bg-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[780px]">
                <thead className="bg-surface-variant">
                  <tr>
                    {["Fecha y Hora", "Usuario", "Rol", "Acción", "Entidad", "Detalle"].map((h) => (
                      <th key={h} className="p-2 px-4 border-b border-outline-variant text-on-surface-variant uppercase tracking-wider text-xs font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Sin registros</td></tr>
                  ) : filtrados.map((l) => (
                    <tr key={l.id} className="odd:bg-surface even:bg-surface-bright hover:bg-surface-container-lowest transition-colors">
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant font-mono text-xs whitespace-nowrap">{formatDate(l.timestamp)}</td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{l.user}</td>
                      <td className="p-2 px-4 border-b border-outline-variant">
                        <span className="text-xs font-medium text-on-surface-variant">{l.role}</span>
                      </td>
                      <td className="p-2 px-4 border-b border-outline-variant">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${actionColor[l.action] ?? ""}`}>{l.action}</span>
                      </td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant">{l.entity}</td>
                      <td className="p-2 px-4 border-b border-outline-variant text-on-surface-variant text-xs">{l.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 px-4 border-t border-outline-variant text-sm text-on-surface-variant">
              {filtrados.length} entradas mostradas · {logs.length} total en historial
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
