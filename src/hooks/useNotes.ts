"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

export function useNotes(sessionId: string) {
  const [content, setContent] = useState("");
  const noteIdRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Fetch existing private note for this session
    supabase
      .from("session_notes")
      .select("*")
      .eq("session_id", sessionId)
      .eq("is_private", true)
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          noteIdRef.current = data[0].id;
          setContent(data[0].content ?? "");
        }
      });

    const channel = supabase
      .channel(`notes-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_notes",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            // Only sync from remote if we don't have a pending local write
            if (!debounceRef.current) {
              setContent(payload.new.content ?? "");
            }
            noteIdRef.current = payload.new.id;
          }
        }
      )
      .subscribe();

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      supabase.removeChannel(channel);
    };
  }, [sessionId, supabase]);

  const updateContent = useCallback(
    (text: string) => {
      setContent(text);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        debounceRef.current = null;
        if (noteIdRef.current) {
          await supabase
            .from("session_notes")
            .update({ content: text, updated_at: new Date().toISOString() })
            .eq("id", noteIdRef.current);
        } else {
          const { data } = await supabase
            .from("session_notes")
            .insert({
              session_id: sessionId,
              content: text,
              is_private: true,
            })
            .select("id")
            .single();
          if (data) noteIdRef.current = data.id;
        }
      }, 500);
    },
    [sessionId, supabase]
  );

  return { content, updateContent };
}
