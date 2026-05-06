"use client";

import { useRealtime } from "./useRealtime";

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
  const filter = alumnoId ? `alumno_id=eq.${alumnoId}` : undefined;

  const { data: calificaciones, loading, error, refetch } = useRealtime<Calificacion>({
    table: "calificaciones",
    fetchUrl: () => {
      const params = new URLSearchParams();
      if (alumnoId) params.set("alumno_id", alumnoId);
      return `/api/calificaciones?${params}`;
    },
    channelName: `public:calificaciones:${alumnoId ?? "all"}`,
    filter,
  });

  return { calificaciones, loading, error, refetch };
}
