"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

export type ApprovalStatus = "pending" | "approved" | "deferred";

export interface Approval {
  id: string;
  session_id: string;
  label: string;
  status: ApprovalStatus;
  decided_at: string | null;
}

export function useApprovals(sessionId: string) {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase
      .from("session_approvals")
      .select("*")
      .eq("session_id", sessionId)
      .then(({ data }) => {
        if (data) setApprovals(data as Approval[]);
      });

    const channel = supabase
      .channel(`approvals-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_approvals",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setApprovals((prev) => [...prev, payload.new as Approval]);
          } else if (payload.eventType === "UPDATE") {
            setApprovals((prev) =>
              prev.map((a) =>
                a.id === payload.new.id ? (payload.new as Approval) : a
              )
            );
          } else if (payload.eventType === "DELETE") {
            setApprovals((prev) => prev.filter((a) => a.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, supabase]);

  const approve = useCallback(
    async (id: string) => {
      await supabase
        .from("session_approvals")
        .update({ status: "approved", decided_at: new Date().toISOString() })
        .eq("id", id);
    },
    [supabase]
  );

  const defer = useCallback(
    async (id: string) => {
      await supabase
        .from("session_approvals")
        .update({ status: "deferred", decided_at: new Date().toISOString() })
        .eq("id", id);
    },
    [supabase]
  );

  return { approvals, approve, defer };
}
