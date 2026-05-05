"use client";

import { useEffect, useState, useCallback } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

export interface Aviso {
  id: string;
  titulo: string;
  cuerpo: string;
  tipo: string;
  imagen_url: string | null;
  fecha_publicacion: string | null;
  activo: boolean;
  autor_id: string | null;
  destinatario: string;
}

export function useRealtimeAvisos(para?: "alumnos" | "maestros" | "padres") {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvisos = useCallback(async () => {
    try {
      const url = `/api/avisos?limit=50${para ? `&para=${para}` : ""}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Error al cargar avisos");
      const json = await res.json();
      setAvisos(json.avisos ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [para]);

  useEffect(() => {
    fetchAvisos();

    const client = getBrowserClient();
    const channel = client
      .channel("public:avisos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "avisos" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newRow = payload.new as Aviso;
            if (newRow.activo) {
              setAvisos((prev) => [newRow, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Aviso;
            setAvisos((prev) =>
              updated.activo
                ? prev.map((a) => (a.id === updated.id ? updated : a))
                : prev.filter((a) => a.id !== updated.id)
            );
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as Partial<Aviso>;
            setAvisos((prev) => prev.filter((a) => a.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [fetchAvisos]);

  return { avisos, loading, error, refetch: fetchAvisos };
}
