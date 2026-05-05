"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

export type TipoNotif =
  | "Urgente"
  | "Académico"
  | "Administrativo"
  | "Institucional"
  | "Sistema";

export interface Notificacion {
  id: string;
  tipo: TipoNotif;
  titulo: string;
  tiempo: string;
  leido: boolean;
}

const TIPO_MAP: Record<string, TipoNotif> = {
  urgente:        "Urgente",
  academico:      "Académico",
  administrativo: "Administrativo",
  institucional:  "Institucional",
  sistema:        "Sistema",
};

function relativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "Ahora mismo";
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 0 || isNaN(diff)) return "Ahora mismo";
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return "Ahora mismo";
  if (mins < 60)  return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
  const days = Math.floor(hours / 24);
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7)  return `Hace ${days} días`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `Hace ${weeks} semana${weeks > 1 ? "s" : ""}`;
  return new Date(dateStr).toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
}

const STORAGE_KEY = "cbt-notifs-leidas";

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set<string>(JSON.parse(raw) as string[]) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

function saveReadIds(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // localStorage no disponible (SSR)
  }
}

export function useRealtimeNotificaciones() {
  const [notifs, setNotifs]   = useState<Notificacion[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const initialized           = useRef(false);

  // Cargar IDs leídas desde localStorage
  useEffect(() => {
    setReadIds(getReadIds());
  }, []);

  const mapAviso = useCallback(
    (a: { id: string; titulo: string; tipo: string; fecha_publicacion: string | null }, ids: Set<string>): Notificacion => ({
      id:     a.id,
      tipo:   TIPO_MAP[a.tipo] ?? "Sistema",
      titulo: a.titulo,
      tiempo: relativeTime(a.fecha_publicacion),
      leido:  ids.has(a.id),
    }),
    []
  );

  const fetchNotifs = useCallback(async () => {
    try {
      const res = await fetch("/api/avisos?limit=20", { credentials: "include" });
      if (!res.ok) return;
      const json = await res.json() as { avisos?: Array<{ id: string; titulo: string; tipo: string; fecha_publicacion: string | null }> };
      const ids = getReadIds();
      setNotifs((json.avisos ?? []).map((a) => mapAviso(a, ids)));
    } catch {
      // Si falla la carga inicial, dejamos array vacío
    }
  }, [mapAviso]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    fetchNotifs();

    const client  = getBrowserClient();
    const channel = client
      .channel("topbar:avisos:realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "avisos" },
        (payload) => {
          const a = payload.new as { id: string; titulo: string; tipo: string; estado: string; fecha_publicacion: string };
          // Solo mostrar avisos publicados
          if (a.estado !== "publicado") return;
          const ids = getReadIds();
          setNotifs((prev) => [mapAviso({ ...a, fecha_publicacion: new Date().toISOString() }, ids), ...prev].slice(0, 30));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "avisos" },
        (payload) => {
          const a = payload.new as { id: string; titulo: string; tipo: string; estado: string; fecha_publicacion: string };
          setNotifs((prev) => {
            if (a.estado !== "publicado") {
              return prev.filter((n) => n.id !== a.id);
            }
            const exists = prev.some((n) => n.id === a.id);
            const ids = getReadIds();
            if (exists) {
              return prev.map((n) => n.id === a.id ? { ...mapAviso(a, ids), leido: n.leido } : n);
            }
            return [mapAviso({ ...a, fecha_publicacion: new Date().toISOString() }, ids), ...prev].slice(0, 30);
          });
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [fetchNotifs, mapAviso]);

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, leido: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifs((prev) => {
      const ids = getReadIds();
      prev.forEach((n) => ids.add(n.id));
      saveReadIds(ids);
      setReadIds(new Set(ids));
      return prev.map((n) => ({ ...n, leido: true }));
    });
  }, []);

  // Actualizar tiempos relativos cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifs((prev) =>
        prev.map((n) => ({ ...n })) // Fuerza re-render; relativeTime es live solo si re-fetch
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const unread = notifs.filter((n) => !n.leido).length;

  return { notifs, unread, markRead, markAllRead, readIds };
}
