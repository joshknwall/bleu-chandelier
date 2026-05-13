export default function Command() {
  const checklist = [
    { id: 1, item: "Venue walkthrough complete", done: true },
    { id: 2, item: "Vendor confirmations received", done: true },
    { id: 3, item: "Guest list finalized", done: true },
    { id: 4, item: "Timeline printed for team", done: false },
    { id: 5, item: "Emergency contacts distributed", done: false },
    { id: 6, item: "Audio/visual equipment tested", done: false },
    { id: 7, item: "Seating chart finalized", done: false },
    { id: 8, item: "Catering final headcount", done: false },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: "var(--ink)" }}>
            Live Command
          </h1>
          <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>Real-time event management and coordination</p>
        </div>
        <button className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
          + Alert Team
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* NOW Card */}
        <div className="glass-card col-span-1">
          <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--ink-muted)" }}>Current Event</p>
          <h2 className="font-[family-name:var(--font-heading)] text-[20px] font-semibold mb-4" style={{ color: "var(--ink)" }}>
            Whitfield Wedding
          </h2>

          {/* Countdown Timer */}
          <div className="glass-card mb-6" style={{ background: "linear-gradient(135deg, rgba(255, 217, 102, 0.1), rgba(189, 212, 228, 0.1))" }}>
            <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: "var(--ink-muted)" }}>Event Starts In</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Days", value: 5 },
                { label: "Hours", value: 3 },
                { label: "Mins", value: 42 },
                { label: "Secs", value: 18 },
              ].map((time, idx) => (
                <div key={idx} className="text-center">
                  <p className="font-[family-name:var(--font-heading)] text-[18px] font-bold" style={{ color: "var(--gold)" }}>
                    {String(time.value).padStart(2, "0")}
                  </p>
                  <p className="text-[9px]" style={{ color: "var(--ink-muted)" }}>
                    {time.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>Venue</p>
              <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>Grand Ballroom</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>Guests</p>
              <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>220 Confirmed</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>Team</p>
              <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>8 Staff Members</p>
            </div>
          </div>
        </div>

        {/* Venue Checklist */}
        <div className="glass-card col-span-2">
          <h2 className="font-[family-name:var(--font-heading)] text-[16px] font-semibold mb-4" style={{ color: "var(--ink)" }}>
            Pre-Event Checklist
          </h2>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>Progress</p>
              <p className="text-[12px] font-bold" style={{ color: "var(--ink)" }}>
                {checklist.filter((c) => c.done).length}/{checklist.length}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2" style={{ background: "var(--surface-alt)" }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${(checklist.filter((c) => c.done).length / checklist.length) * 100}%`,
                  background: "linear-gradient(90deg, var(--gold), var(--powder))",
                }}
              ></div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-2 gap-3">
            {checklist.map((item) => (
              <label key={item.id} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-opacity-80" style={{ background: item.done ? "var(--green-soft)" : "var(--surface-alt)" }}>
                <input type="checkbox" checked={item.done} readOnly className="w-4 h-4" />
                <span className="text-[12px]" style={{ color: item.done ? "var(--green-text)" : "var(--ink)" }}>
                  {item.item}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Section */}
      <div className="glass-card mt-6">
        <h2 className="font-[family-name:var(--font-heading)] text-[16px] font-semibold mb-4" style={{ color: "var(--ink)" }}>
          Team Broadcast
        </h2>
        <div className="space-y-3">
          <textarea
            placeholder="Send a real-time alert to your entire team..."
            className="w-full p-3 rounded-lg text-[13px] border resize-none"
            rows={3}
            style={{ borderColor: "var(--border)", background: "var(--surface-alt)", color: "var(--ink)" }}
          />
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 rounded-lg text-[12px] font-bold uppercase tracking-wider" style={{ background: "var(--surface-alt)", color: "var(--ink)" }}>
              📸 Attach
            </button>
            <button className="flex-1 px-4 py-2 rounded-lg text-[12px] font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
              Send Alert
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Preview */}
      <div className="glass-card mt-6">
        <h2 className="font-[family-name:var(--font-heading)] text-[16px] font-semibold mb-4" style={{ color: "var(--ink)" }}>
          Event Timeline
        </h2>
        <div className="space-y-3">
          {[
            { time: "2:00 PM", event: "Venue opens — setup begins", status: "pending" },
            { time: "3:00 PM", event: "Vendor arrival and setup", status: "pending" },
            { time: "5:00 PM", event: "Guest arrival begins", status: "pending" },
            { time: "5:30 PM", event: "Cocktail hour", status: "pending" },
            { time: "6:30 PM", event: "Dinner service", status: "pending" },
            { time: "8:00 PM", event: "Dancing and entertainment", status: "pending" },
            { time: "11:00 PM", event: "Cake cutting", status: "pending" },
            { time: "11:30 PM", event: "Last dance and sendoff", status: "pending" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-2">
              <div className="flex items-center gap-2 w-20 flex-shrink-0">
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--gold)" }}></div>
                <p className="text-[11px] font-medium" style={{ color: "var(--ink)" }}>
                  {item.time}
                </p>
              </div>
              <p className="text-[12px]" style={{ color: "var(--ink-soft)" }}>
                {item.event}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
