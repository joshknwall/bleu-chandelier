export default function Ops() {
  const automations = [
    { id: 1, name: "Client Onboarding", trigger: "New client added", action: "Send welcome email + schedule intro call", status: "Active" },
    { id: 2, name: "Budget Alert", trigger: "Spending exceeds 80%", action: "Email alert to project manager", status: "Active" },
    { id: 3, name: "Invoice Reminder", trigger: "7 days before event", action: "Send invoice reminder", status: "Active" },
    { id: 4, name: "Vendor Confirmation", trigger: "Event date set", action: "Request vendor confirmations", status: "Paused" },
    { id: 5, name: "Day-Of Checklist", trigger: "1 day before event", action: "Send checklist to team", status: "Active" },
  ];

  const playbooks = [
    { id: 1, name: "Wedding Setup", steps: 12, lastUsed: "May 10", events: 3 },
    { id: 2, name: "Corporate Event", steps: 8, lastUsed: "May 5", events: 2 },
    { id: 3, name: "Launch Party", steps: 15, lastUsed: "May 2", events: 1 },
    { id: 4, name: "Gala Preparation", steps: 10, lastUsed: "Apr 28", events: 4 },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: "var(--ink)" }}>
            Ops Hub
          </h1>
          <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>Automations, workflows, and playbooks</p>
        </div>
        <button className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
          + New Automation
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Automations */}
        <div className="glass-card">
          <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold mb-4" style={{ color: "var(--ink)" }}>
            Active Automations
          </h2>
          <div className="space-y-3">
            {automations.map((auto) => (
              <div key={auto.id} className="p-4 rounded-lg" style={{ background: "var(--surface-alt)" }}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-[family-name:var(--font-heading)] text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                    {auto.name}
                  </h3>
                  <div className="pill" style={{ background: auto.status === "Active" ? "var(--green-soft)" : "var(--gray-soft)", color: auto.status === "Active" ? "var(--green-text)" : "var(--ink-muted)" }}>
                    {auto.status}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>
                    <span style={{ color: "var(--ink-soft)" }}>If:</span> {auto.trigger}
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>
                    <span style={{ color: "var(--ink-soft)" }}>Then:</span> {auto.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Playbooks */}
        <div className="glass-card">
          <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold mb-4" style={{ color: "var(--ink)" }}>
            Playbooks
          </h2>
          <div className="space-y-3">
            {playbooks.map((book) => (
              <div key={book.id} className="p-4 rounded-lg" style={{ background: "var(--surface-alt)" }}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-[family-name:var(--font-heading)] text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                    {book.name}
                  </h3>
                  <span className="text-[11px] font-medium" style={{ color: "var(--gold)" }}>★ {book.events}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>
                    {book.steps} steps
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>
                    Used {book.lastUsed}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="glass-card mt-6">
        <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold mb-6" style={{ color: "var(--ink)" }}>
          Workflow Builder
        </h2>
        <div className="flex items-center justify-center gap-4 min-h-40" style={{ background: "var(--surface-alt)", borderRadius: "var(--r)" }}>
          <div className="text-center">
            <div className="text-3xl mb-2">📋</div>
            <p className="text-[12px]" style={{ color: "var(--ink-muted)" }}>Trigger</p>
          </div>
          <div className="text-2xl" style={{ color: "var(--border)" }}>→</div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚙️</div>
            <p className="text-[12px]" style={{ color: "var(--ink-muted)" }}>Action</p>
          </div>
          <div className="text-2xl" style={{ color: "var(--border)" }}>→</div>
          <div className="text-center">
            <div className="text-3xl mb-2">✓</div>
            <p className="text-[12px]" style={{ color: "var(--ink-muted)" }}>Result</p>
          </div>
        </div>
      </div>
    </div>
  );
}
