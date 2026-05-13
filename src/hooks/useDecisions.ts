"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Decision {
  id: string;
  session_id: string;
  text: string;
  created_at: string;
}

export function useDecisions(sessionId: string) {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase
      .from("session_decisions")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at")
      .then(({ data }) => {
        if (data) setDecisions(data as Decision[]);
      });

    const channel = supabase
      .channel(`decisions-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_decisions",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setDecisions((prev) => [...prev, payload.new as Decision]);
          } else if (payload.eventType === "UPDATE") {
            setDecisions((prev) =>
              prev.map((d) =>
                d.id === payload.new.id ? (payload.new as Decision) : d
              )
            );
          } else if (payload.eventType === "DELETE") {
            setDecisions((prev) => prev.filter((d) => d.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, supabase]);

  const addDecision = useCallback(
    async (text: string) => {
      await supabase.from("session_decisions").insert({
        session_id: sessionId,
        text,
      });
    },
    [sessionId, supabase]
  );

  return { decisions, addDecision };
}
