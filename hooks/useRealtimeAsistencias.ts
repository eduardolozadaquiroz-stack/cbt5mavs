"use client";

import { useRealtime } from "./useRealtime";

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
  const filter = alumnoId ? `alumno_id=eq.${alumnoId}` : undefined;

  const { data: asistencias, loading, error, refetch } = useRealtime<Asistencia>({
    table: "asistencias",
    fetchUrl: () => {
      const params = new URLSearchParams();
      if (alumnoId) params.set("alumno_id", alumnoId);
      return `/api/asistencias?${params}`;
    },
    channelName: `public:asistencias:${alumnoId ?? "all"}`,
    filter,
  });

  return { asistencias, loading, error, refetch };
}
