/**
 * lib/audit-log.ts
 * Utilidad de audit log del lado del cliente (localStorage).
 */

export interface AuditEntry {
  id: number;
  timestamp: string;
  user: string;
  role: "Admin" | "Maestro" | "Alumno";
  action: string;
  entity: string;
  detail: string;
}

export const AUDIT_LS_KEY = "cbt-audit-log";

/** Escribe una entrada nueva en el audit log (solo cliente) */
export function logAudit(entry: Omit<AuditEntry, "id" | "timestamp">) {
  if (typeof window === "undefined") return;
  const prev: AuditEntry[] = JSON.parse(localStorage.getItem(AUDIT_LS_KEY) ?? "[]");
  const newEntry: AuditEntry = {
    ...entry,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(AUDIT_LS_KEY, JSON.stringify([newEntry, ...prev]));
}
