export default function Events() {
  const upcomingEvents = [
    { id: 1, name: "Whitfield Wedding", client: "Amara Whitfield", date: "Jun 14, 2025", venue: "Grand Ballroom", guests: 220, status: "Active" },
    { id: 2, name: "Nair Brand Launch", client: "Priya Nair", date: "May 18, 2025", venue: "Modern Lofts", guests: 150, status: "Active" },
    { id: 3, name: "Fontaine Gala", client: "Celeste Fontaine", date: "Aug 22, 2025", venue: "Botanical Gardens", guests: 300, status: "Planning" },
    { id: 4, name: "Johnson Anniversary", client: "Devon & Marcus", date: "Sep 5, 2025", venue: "Private Estate", guests: 80, status: "Planning" },
    { id: 5, name: "Mitchell Gala", client: "Sage Mitchell", date: "Oct 18, 2025", venue: "Museum Hall", guests: 250, status: "Proposal" },
  ];

  const statusColors: Record<string, string> = {
    Active: "var(--green-soft)",
    Planning: "var(--blue-soft)",
    Proposal: "var(--amber-soft)",
  };

  const statusTextColors: Record<string, string> = {
    Active: "var(--green-text)",
    Planning: "var(--blue-text)",
    Proposal: "var(--amber-text)",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: "var(--ink)" }}>
            Events
          </h1>
          <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>Calendar and timeline management</p>
        </div>
        <button className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
          + New Event
        </button>
      </div>

      {/* View Tabs */}
      <div className="glass-card mb-8">
        <div className="flex gap-4 border-b" style={{ borderColor: "var(--border)" }}>
          <button className="px-4 py-3 text-[13px] font-bold uppercase tracking-wider border-b-2" style={{ color: "var(--ink)", borderColor: "var(--gold)" }}>
            Month View
          </button>
          <button className="px-4 py-3 text-[13px] font-bold uppercase tracking-wider opacity-60" style={{ color: "var(--ink-muted)" }}>
            Week View
          </button>
          <button className="px-4 py-3 text-[13px] font-bold uppercase tracking-wider opacity-60" style={{ color: "var(--ink-muted)" }}>
            Timeline
          </button>
        </div>
      </div>

      {/* Calendar Placeholder */}
      <div className="glass-card mb-8">
        <div className="grid grid-cols-7 gap-2 mb-6">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-[11px] font-bold uppercase" style={{ color: "var(--ink-muted)" }}>
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg flex items-center justify-center text-[12px]"
              style={{
                background: i < 5 || i > 27 ? "var(--surface-alt)" : "var(--powder-light)",
                color: i < 5 || i > 27 ? "var(--ink-muted)" : "var(--ink)",
              }}
            >
              {i < 5 ? i + 26 : i > 27 ? i - 27 : i - 4}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="glass-card">
        <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold mb-4" style={{ color: "var(--ink)" }}>Upcoming Events</h2>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 rounded-lg" style={{ background: "var(--surface-alt)" }}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-[family-name:var(--font-heading)] text-[14px] font-semibold" style={{ color: "var(--ink)" }}>
                    {event.name}
                  </h3>
                  <div className="pill" style={{ background: statusColors[event.status], color: statusTextColors[event.status] }}>
                    {event.status}
                  </div>
                </div>
                <p className="text-[12px]" style={{ color: "var(--ink-soft)" }}>
                  {event.client} • {event.venue}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>
                  {event.date}
                </p>
                <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>
                  {event.guests} guests
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
