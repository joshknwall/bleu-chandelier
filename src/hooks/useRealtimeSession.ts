import { useEffect, useState, useCallback } from "react";

/**
 * Hook for managing real-time session data via Supabase Realtime
 * Handles subscriptions to session updates (decisions, approvals, notes, agenda)
 *
 * Usage:
 * const { isConnected, sessionData, addDecision, updateApproval } = useRealtimeSession(roomId)
 */

interface SessionData {
  decisions: string[];
  approvals: Record<string, "pending" | "approved" | "deferred">;
  notes: Array<{ id: string; text: string; author: string; timestamp: string }>;
  agendaChecked: Set<number>;
}

export function useRealtimeSession(roomId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData>({
    decisions: [],
    approvals: {},
    notes: [],
    agendaChecked: new Set(),
  });
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Initialize connection to Supabase Realtime
  useEffect(() => {
    // In a real implementation, this would connect to Supabase Realtime
    // For now, we simulate the connection
    setIsConnected(true);

    // Subscribe to room changes
    const subscriptionId = `session-${roomId}`;

    // Simulated subscription setup
    // In production:
    // const subscription = supabase
    //   .channel(`room:${roomId}`)
    //   .on('postgres_changes', { event: '*', schema: 'session_data' }, payload => {
    //     handleSessionUpdate(payload);
    //   })
    //   .subscribe();

    return () => {
      // Cleanup subscription
      setIsConnected(false);
    };
  }, [roomId]);

  // Add a decision (broadcasts to other participants)
  const addDecision = useCallback(
    (decision: string) => {
      setSessionData((prev) => ({
        ...prev,
        decisions: [...prev.decisions, decision],
      }));
      setLastSyncTime(new Date());

      // In production:
      // await supabase
      //   .from('session_decisions')
      //   .insert({ room_id: roomId, text: decision, author_id: userId })
    },
    [roomId]
  );

  // Update approval status (broadcasts to other participants)
  const updateApproval = useCallback(
    (id: string, status: "pending" | "approved" | "deferred") => {
      setSessionData((prev) => ({
        ...prev,
        approvals: { ...prev.approvals, [id]: status },
      }));
      setLastSyncTime(new Date());

      // In production:
      // await supabase
      //   .from('session_approvals')
      //   .update({ status })
      //   .eq('id', id)
    },
    []
  );

  // Add a note (broadcasts to other participants)
  const addNote = useCallback(
    (text: string, author: string) => {
      const note = {
        id: String(Date.now()),
        text,
        author,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      };
      setSessionData((prev) => ({
        ...prev,
        notes: [note, ...prev.notes],
      }));
      setLastSyncTime(new Date());

      // In production:
      // await supabase
      //   .from('session_notes')
      //   .insert({ room_id: roomId, ...note })
    },
    [roomId]
  );

  // Toggle agenda item (broadcasts to other participants)
  const toggleAgendaItem = useCallback((index: number) => {
    setSessionData((prev) => {
      const next = new Set(prev.agendaChecked);
      next.has(index) ? next.delete(index) : next.add(index);
      return { ...prev, agendaChecked: next };
    });
    setLastSyncTime(new Date());

    // In production:
    // await supabase
    //   .from('session_agenda')
    //   .update({ checked: !wasChecked })
    //   .eq('room_id', roomId)
    //   .eq('index', index)
  }, []);

  // Get real-time participant count (simulated)
  const getParticipantCount = useCallback(() => {
    // In production: query active_room_participants or use presence
    return 2; // Simulated: host + guest
  }, []);

  // Mark session as ready for recording
  const markSessionReady = useCallback(async () => {
    setLastSyncTime(new Date());
    // In production: update room status in DB
  }, []);

  return {
    isConnected,
    sessionData,
    lastSyncTime,
    addDecision,
    updateApproval,
    addNote,
    toggleAgendaItem,
    getParticipantCount,
    markSessionReady,
  };
}

/**
 * Hook for monitoring session connection health
 */
export function useSessionHealth(roomId: string) {
  const [ping, setPing] = useState(0);
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate ping measurement
      const simulatedPing = Math.random() * 100;
      setPing(Math.round(simulatedPing));
      setIsHealthy(simulatedPing < 200);
    }, 5000);

    return () => clearInterval(interval);
  }, [roomId]);

  return { ping, isHealthy };
}

/**
 * Hook for presence tracking (who's currently in the session)
 */
export function useSessionPresence(roomId: string) {
  const [participants, setParticipants] = useState<
    Array<{
      userId: string;
      name: string;
      avatar: string;
      isActive: boolean;
      lastSeen: Date;
    }>
  >([]);

  useEffect(() => {
    // In production: subscribe to presence changes
    // const presence = supabase.channel(`room:${roomId}`).on('presence', { event: 'sync' }, ... )

    // Simulated participants
    setParticipants([
      {
        userId: "user-1",
        name: "You",
        avatar: "/topaz-curtis.jpg",
        isActive: true,
        lastSeen: new Date(),
      },
      {
        userId: "user-2",
        name: "Amara Whitfield",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        isActive: true,
        lastSeen: new Date(),
      },
    ]);

    return () => {
      // Cleanup subscription
    };
  }, [roomId]);

  return { participants };
}
