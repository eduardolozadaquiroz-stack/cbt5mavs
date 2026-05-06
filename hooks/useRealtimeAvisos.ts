"use client";

import { useRealtime } from "./useRealtime";

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
  const destLabel = para
    ? { alumnos: "Alumnos", maestros: "Maestros", padres: "Padres" }[para]
    : null;

  const { data: avisos, loading, error, refetch } = useRealtime<Aviso>({
    table: "avisos",
    fetchUrl: `/api/avisos?limit=50${para ? `&para=${para}` : ""}`,
    channelName: "public:avisos",
    onEvent: (payload, _prevData, setData) => {
      const destOk = (row: DbRow) =>
        !para || row.destinatario === "Todos" || row.destinatario === destLabel;

      if (payload.eventType === "INSERT") {
        const raw = payload.new as DbRow;
        const mapped = mapDbRow(raw);
        if (mapped.activo && destOk(raw)) {
          setData((prev) => [mapped, ...prev]);
        }
      } else if (payload.eventType === "UPDATE") {
        const raw = payload.new as DbRow;
        const mapped = mapDbRow(raw);
        const canShow = mapped.activo && destOk(raw);
        setData((prev) =>
          canShow
            ? prev.map((a) => (a.id === mapped.id ? mapped : a))
            : prev.filter((a) => a.id !== mapped.id)
        );
      } else if (payload.eventType === "DELETE") {
        const deleted = payload.old as Partial<Aviso>;
        setData((prev) => prev.filter((a) => a.id !== deleted.id));
      }
    },
  });

  return { avisos, loading, error, refetch };
}
