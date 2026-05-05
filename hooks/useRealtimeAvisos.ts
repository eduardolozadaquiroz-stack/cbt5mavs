"use client";

import { useEffect, useState, useCallback } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

export interface Aviso {
  id: string;
  titulo: string;
  cuerpo: string;
  tipo: string;
  fotos: string[];
  videos: string[];
  pdfs: string[];
  fecha_publicacion: string | null;
  activo: boolean;
  autor_id: string | null;
  destinatario: string;
  es_evento: boolean;
  evento_inicio: string | null;
  evento_fin: string | null;
  evento_lugar: string | null;
  evento_vestimenta: string | null;
  evento_enlace: string | null;
}

// Tipo del row crudo que devuelve Supabase Realtime (columnas DB)
interface DbRow {
  id: string;
  titulo: string;
  contenido: string;
  tipo: string;
  estado: string;
  fotos: string[];
  videos: string[];
  pdfs: string[];
  fecha_publicacion: string | null;
  destinatario: string;
  autor_id: string | null;
  es_evento: boolean;
  evento_inicio: string | null;
  evento_fin: string | null;
  evento_lugar: string | null;
  evento_vestimenta: string | null;
  evento_enlace: string | null;
}

function mapDbRow(row: DbRow): Aviso {
  return {
    id: row.id,
    titulo: row.titulo,
    cuerpo: row.contenido,
    tipo: row.tipo,
    fotos: row.fotos ?? [],
    videos: row.videos ?? [],
    pdfs: row.pdfs ?? [],
    activo: row.estado === "publicado",
    fecha_publicacion: row.fecha_publicacion,
    destinatario: row.destinatario ?? "Todos",
    autor_id: row.autor_id,
    es_evento: row.es_evento ?? false,
    evento_inicio: row.evento_inicio ?? null,
    evento_fin: row.evento_fin ?? null,
    evento_lugar: row.evento_lugar ?? null,
    evento_vestimenta: row.evento_vestimenta ?? null,
    evento_enlace: row.evento_enlace ?? null,
  };
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
            const mapped = mapDbRow(payload.new as DbRow);
            if (mapped.activo) {
              setAvisos((prev) => [mapped, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            const mapped = mapDbRow(payload.new as DbRow);
            setAvisos((prev) =>
              mapped.activo
                ? prev.map((a) => (a.id === mapped.id ? mapped : a))
                : prev.filter((a) => a.id !== mapped.id)
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
