export default function Notes() {
  const columns = [
    {
      id: "ideas",
      title: "Ideas",
      color: "var(--blue-soft)",
      notes: [
        { id: 1, title: "Gold Geometric Centerpieces", description: "Modern twist on classic", priority: "high" },
        { id: 2, title: "Outdoor Tent Option", description: "Consider weather backup", priority: "medium" },
      ],
    },
    {
      id: "planning",
      title: "Planning",
      color: "var(--amber-soft)",
      notes: [
        { id: 3, title: "Vendor Proposals", description: "Waiting on 2 catering quotes", priority: "high" },
        { id: 4, title: "Floor Plan Draft", description: "Client review scheduled", priority: "medium" },
      ],
    },
    {
      id: "approved",
      title: "Approved",
      color: "var(--green-soft)",
      notes: [
        { id: 5, title: "Venue Locked In", description: "Grand Ballroom, Jun 14", priority: "high" },
        { id: 6, title: "Color Palette", description: "Blush, gold, ivory", priority: "medium" },
      ],
    },
    {
      id: "budget",
      title: "Budget",
      color: "var(--gold-soft)",
      notes: [
        { id: 7, title: "Catering Budget", description: "$85/person approved", priority: "high" },
        { id: 8, title: "Décor Allocation", description: "$15K max", priority: "medium" },
      ],
    },
    {
      id: "followup",
      title: "Follow-up",
      color: "var(--rose-soft)",
      notes: [
        { id: 9, title: "Call Florist", description: "Confirm seasonal availability", priority: "medium" },
        { id: 10, title: "Lighting Demo", description: "Schedule appointment", priority: "low" },
      ],
    },
  ];

  const priorityColors: Record<string, string> = {
    high: "var(--red)",
    medium: "var(--amber)",
    low: "var(--blue)",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: "var(--ink)" }}>
            Notes
          </h1>
          <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>Kanban board for project notes and tasks</p>
        </div>
        <button className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
          + New Note
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: column.color }}
              ></div>
              <h2 className="font-[family-name:var(--font-heading)] text-[14px] font-semibold" style={{ color: "var(--ink)" }}>
                {column.title}
              </h2>
              <span className="text-[11px] font-medium" style={{ color: "var(--ink-muted)" }}>
                {column.notes.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {column.notes.map((note) => (
                <div
                  key={note.id}
                  className="glass-card cursor-move transition-all hover:shadow-lg"
                  style={{ background: "var(--surface)" }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                      style={{ background: priorityColors[note.priority] }}
                    ></div>
                    <h3 className="font-medium text-[12px] flex-1" style={{ color: "var(--ink)" }}>
                      {note.title}
                    </h3>
                  </div>
                  <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>
                    {note.description}
                  </p>
                </div>
              ))}

              {/* Add Card Button */}
              <button
                className="w-full p-3 rounded-lg border-2 border-dashed transition-all"
                style={{ borderColor: "var(--border)", color: "var(--ink-muted)" }}
              >
                <span className="text-[18px]">+</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
