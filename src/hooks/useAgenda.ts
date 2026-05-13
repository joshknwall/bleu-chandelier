"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

export interface AgendaItem {
  id: string;
  session_id: string;
  text: string;
  completed: boolean;
  sort_order: number;
  completed_at: string | null;
}

export function useAgenda(sessionId: string) {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase
      .from("session_agenda_items")
      .select("*")
      .eq("session_id", sessionId)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setItems(data as AgendaItem[]);
      });

    const channel = supabase
      .channel(`agenda-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_agenda_items",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setItems((prev) =>
              [...prev, payload.new as AgendaItem].sort(
                (a, b) => a.sort_order - b.sort_order
              )
            );
          } else if (payload.eventType === "UPDATE") {
            setItems((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? (payload.new as AgendaItem) : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setItems((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, supabase]);

  const toggleItem = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      const completed = !item.completed;
      await supabase
        .from("session_agenda_items")
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq("id", id);
    },
    [items, supabase]
  );

  const addItem = useCallback(
    async (text: string) => {
      const maxOrder =
        items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) : 0;
      await supabase.from("session_agenda_items").insert({
        session_id: sessionId,
        text,
        completed: false,
        sort_order: maxOrder + 1,
      });
    },
    [items, sessionId, supabase]
  );

  return { items, toggleItem, addItem };
}
