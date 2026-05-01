"use client";

import { useEffect, useState, useCallback } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

export interface Asistencia {
  id: string;
  alumno_id: string;
  materia_id: string;
  fecha: string;
  estatus: "presente" | "ausente" | "tardanza" | "justificada";
  observaciones: string | null;
  materias?: { nombre: string; clave: string } | null;
}

export function useRealtimeAsistencias(alumnoId?: string) {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAsistencias = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (alumnoId) params.set("alumno_id", alumnoId);
      const res = await fetch(`/api/asistencias?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Error al cargar asistencias");
      const json = await res.json();
      setAsistencias(json.asistencias ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [alumnoId]);

  useEffect(() => {
    fetchAsistencias();

    const client = getBrowserClient();
    const filter = alumnoId ? `alumno_id=eq.${alumnoId}` : undefined;

    const channel = client
      .channel(`public:asistencias:${alumnoId ?? "all"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "asistencias",
          ...(filter ? { filter } : {}),
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setAsistencias((prev) => [...prev, payload.new as Asistencia]);
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Asistencia;
            setAsistencias((prev) =>
              prev.map((a) => (a.id === updated.id ? updated : a))
            );
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as Partial<Asistencia>;
            setAsistencias((prev) => prev.filter((a) => a.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [fetchAsistencias, alumnoId]);

  return { asistencias, loading, error, refetch: fetchAsistencias };
}
