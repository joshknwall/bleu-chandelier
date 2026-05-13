"use client";

import { useState } from "react";
import { useApprovals, Approval, ApprovalStatus } from "@/hooks/useApprovals";

const INITIAL_APPROVALS: Approval[] = [
  { id: "1", session_id: "", label: "Seating layout", status: "pending", decided_at: null },
  { id: "2", session_id: "", label: "Vendor selections", status: "approved", decided_at: null },
  { id: "3", session_id: "", label: "Color palette", status: "approved", decided_at: null },
];

function ApprovalRow({
  approval,
  onApprove,
  onDefer,
}: {
  approval: Approval;
  onApprove: (id: string) => void;
  onDefer: (id: string) => void;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(189,212,228,0.1)",
        borderRadius: 10,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <span style={{ fontSize: 13, color: "rgba(189,212,228,0.85)", fontWeight: 500, flex: 1 }}>
        {approval.label}
      </span>

      {approval.status === "approved" ? (
        <span
          style={{
            background: "rgba(16,185,129,0.2)",
            color: "var(--green)",
            borderRadius: "999px",
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 10px",
            letterSpacing: "0.04em",
          }}
        >
          Approved
        </span>
      ) : approval.status === "deferred" ? (
        <span
          style={{
            background: "rgba(245,158,11,0.15)",
            color: "var(--amber)",
            borderRadius: "999px",
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 10px",
            letterSpacing: "0.04em",
          }}
        >
          Deferred
        </span>
      ) : (
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onApprove(approval.id)}
            style={{
              background: "rgba(16,185,129,0.2)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: 8,
              padding: "5px 10px",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--green)",
              cursor: "pointer",
            }}
          >
            Approve
          </button>
          <button
            onClick={() => onDefer(approval.id)}
            style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 8,
              padding: "5px 10px",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--amber)",
              cursor: "pointer",
            }}
          >
            Defer
          </button>
        </div>
      )}
    </div>
  );
}

function LiveApprovalsPanel({ sessionId }: { sessionId: string }) {
  const { approvals, approve, defer } = useApprovals(sessionId);

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(189,212,228,0.5)",
          marginBottom: 4,
        }}
      >
        Approvals
      </div>
      {approvals.map((a) => (
        <ApprovalRow key={a.id} approval={a} onApprove={approve} onDefer={defer} />
      ))}
    </div>
  );
}

function DemoApprovalsPanel() {
  const [approvals, setApprovals] = useState<Approval[]>(INITIAL_APPROVALS);

  const update = (id: string, status: ApprovalStatus) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(189,212,228,0.5)",
          marginBottom: 4,
        }}
      >
        Approvals
      </div>
      {approvals.map((a) => (
        <ApprovalRow
          key={a.id}
          approval={a}
          onApprove={(id) => update(id, "approved")}
          onDefer={(id) => update(id, "deferred")}
        />
      ))}
    </div>
  );
}

export default function ApprovalsPanel({ sessionId }: { sessionId?: string }) {
  if (sessionId) return <LiveApprovalsPanel sessionId={sessionId} />;
  return <DemoApprovalsPanel />;
}
