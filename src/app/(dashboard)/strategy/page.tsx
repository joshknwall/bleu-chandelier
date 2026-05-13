export default function Strategy() {
  const goals = [
    { id: 1, name: "Year 1 Revenue Target", target: "$500K", progress: 65, status: "On Track" },
    { id: 2, name: "Client Base Growth", target: "50 clients", progress: 48, status: "On Track" },
    { id: 3, name: "Team Expansion", target: "8 full-time", progress: 75, status: "On Track" },
    { id: 4, name: "Event Scale", target: "2 events/week", progress: 45, status: "At Risk" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: "var(--ink)" }}>
            Strategy
          </h1>
          <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>Goals, objectives, and strategic analysis</p>
        </div>
        <button className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
          + New Goal
        </button>
      </div>

      {/* Goals with Progress Rings */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {goals.map((goal) => (
          <div key={goal.id} className="glass-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-[14px] font-semibold" style={{ color: "var(--ink)" }}>
                  {goal.name}
                </h3>
                <p className="text-[12px]" style={{ color: "var(--ink-muted)" }}>{goal.target}</p>
              </div>
              <div className="pill" style={{ background: goal.status === "On Track" ? "var(--green-soft)" : "var(--amber-soft)", color: goal.status === "On Track" ? "var(--green-text)" : "var(--amber-text)" }}>
                {goal.status}
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Progress Ring */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="var(--surface-alt)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="linear-gradient(135deg, var(--gold), var(--powder))"
                    strokeWidth="8"
                    strokeDasharray={`${(goal.progress / 100) * 282.7} 282.7`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-center">
                    <p className="font-bold text-[18px]" style={{ color: "var(--ink)" }}>
                      {goal.progress}%
                    </p>
                  </span>
                </div>
              </div>

              {/* Milestones */}
              <div className="flex-1">
                <div className="space-y-2">
                  {[25, 50, 75, 100].map((milestone) => (
                    <div key={milestone} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: goal.progress >= milestone ? "var(--gold)" : "var(--border)" }}></div>
                      <span className="text-[11px]" style={{ color: goal.progress >= milestone ? "var(--ink)" : "var(--ink-muted)" }}>
                        {milestone}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SWOT Analysis */}
      <div className="glass-card">
        <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold mb-6" style={{ color: "var(--ink)" }}>
          SWOT Analysis
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { title: "Strengths", items: ["Strong portfolio", "Loyal clients", "Creative team"], color: "var(--green-soft)" },
            { title: "Weaknesses", items: ["Limited staff", "High overhead", "Geographic reach"], color: "var(--amber-soft)" },
            { title: "Opportunities", items: ["Corporate events", "Virtual events", "International"], color: "var(--blue-soft)" },
            { title: "Threats", items: ["Competition", "Economic slowdown", "Supply chain"], color: "var(--red-soft)" },
          ].map((quadrant, idx) => (
            <div key={idx} className="p-4 rounded-lg" style={{ background: quadrant.color }}>
              <h3 className="font-bold text-[12px] uppercase tracking-wider mb-3" style={{ color: "var(--ink)" }}>
                {quadrant.title}
              </h3>
              <ul className="space-y-2">
                {quadrant.items.map((item, i) => (
                  <li key={i} className="text-[11px] flex items-start gap-2" style={{ color: "var(--ink-soft)" }}>
                    <span className="mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="glass-card mt-6">
        <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold mb-4" style={{ color: "var(--ink)" }}>
          Key Metrics
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Client Retention", value: "92%", change: "+3%" },
            { label: "Avg Event Value", value: "$45K", change: "+8%" },
            { label: "Profit Margin", value: "28%", change: "+1%" },
            { label: "NPS Score", value: "72", change: "+5" },
          ].map((metric, idx) => (
            <div key={idx} className="p-4 rounded-lg" style={{ background: "var(--surface-alt)" }}>
              <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--ink-muted)" }}>
                {metric.label}
              </p>
              <p className="text-[22px] font-bold" style={{ color: "var(--ink)" }}>
                {metric.value}
              </p>
              <p className="text-[11px]" style={{ color: "var(--green-text)" }}>
                {metric.change}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
