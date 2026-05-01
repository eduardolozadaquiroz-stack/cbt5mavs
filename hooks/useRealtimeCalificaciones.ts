"use client";

import { useEffect, useState, useCallback } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

export interface Calificacion {
  id: string;
  alumno_id: string;
  materia_id: string;
  grupo_id: string;
  parcial: number;
  calificacion: number;
  observaciones: string | null;
  fecha_registro: string;
  materias?: { nombre: string; clave: string } | null;
  grupos?: { nombre: string } | null;
}

export function useRealtimeCalificaciones(alumnoId?: string) {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalificaciones = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (alumnoId) params.set("alumno_id", alumnoId);
      const res = await fetch(`/api/calificaciones?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Error al cargar calificaciones");
      const json = await res.json();
      setCalificaciones(json.calificaciones ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [alumnoId]);

  useEffect(() => {
    fetchCalificaciones();

    const client = getBrowserClient();
    // Filtrar por alumno si se proporciona (row-level realtime)
    const filter = alumnoId ? `alumno_id=eq.${alumnoId}` : undefined;

    const channel = client
      .channel(`public:calificaciones:${alumnoId ?? "all"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "calificaciones",
          ...(filter ? { filter } : {}),
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setCalificaciones((prev) => [...prev, payload.new as Calificacion]);
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Calificacion;
            setCalificaciones((prev) =>
              prev.map((c) => (c.id === updated.id ? updated : c))
            );
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as Partial<Calificacion>;
            setCalificaciones((prev) => prev.filter((c) => c.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [fetchCalificaciones, alumnoId]);

  return { calificaciones, loading, error, refetch: fetchCalificaciones };
}
