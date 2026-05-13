"use client";

import { useState } from "react";

type ApprovalStatus = "pending" | "approved" | "deferred";

interface Approval {
  id: string;
  label: string;
  status: ApprovalStatus;
}

const INITIAL_APPROVALS: Approval[] = [
  { id: "1", label: "Seating layout", status: "pending" },
  { id: "2", label: "Vendor selections", status: "approved" },
  { id: "3", label: "Color palette", status: "approved" },
];

export default function ApprovalsPanel() {
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);

  const update = (id: string, status: ApprovalStatus) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(189,212,228,0.5)", marginBottom: 4 }}>
        Approvals
      </div>

      {approvals.map(a => (
        <div
          key={a.id}
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
            {a.label}
          </span>

          {a.status === "approved" ? (
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
          ) : a.status === "deferred" ? (
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
                onClick={() => update(a.id, "approved")}
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
                onClick={() => update(a.id, "deferred")}
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
      ))}
    </div>
  );
}
