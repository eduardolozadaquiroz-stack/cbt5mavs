"use client";

import { useEffect, useState, useCallback } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

export interface RealtimeItem {
  id: string;
}

interface UseRealtimeOptions<T extends RealtimeItem> {
  table: string;
  fetchUrl: string | (() => string);
  channelName: string;
  filter?: string;
  onEvent?: (payload: any, prevData: T[], setData: React.Dispatch<React.SetStateAction<T[]>>) => void;
}

export function useRealtime<T extends RealtimeItem>({
  table,
  fetchUrl,
  channelName,
  filter,
  onEvent,
}: UseRealtimeOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const url = typeof fetchUrl === "function" ? fetchUrl() : fetchUrl;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`Error al cargar ${table}`);
      const json = await res.json();
      setData(json[table] ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, table]);

  useEffect(() => {
    fetchData();

    const client = getBrowserClient();
    const channel = client
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          ...(filter ? { filter } : {}),
        },
        (payload) => {
          if (onEvent) {
            onEvent(payload, data, setData);
          } else {
            if (payload.eventType === "INSERT") {
              setData((prev) => [...prev, payload.new as T]);
            } else if (payload.eventType === "UPDATE") {
              const updated = payload.new as T;
              setData((prev) =>
                prev.map((item) => ((item as RealtimeItem).id === updated.id ? updated : item))
              );
            } else if (payload.eventType === "DELETE") {
              const deleted = payload.old as Partial<RealtimeItem>;
              setData((prev) => prev.filter((item) => (item as RealtimeItem).id !== deleted.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [fetchData, channelName, table, filter, onEvent]);

  return { data, loading, error, refetch: fetchData };
}
