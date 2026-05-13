import { formatCurrency } from "@/lib/utils";

export default function Overview() {
  const stats = [
    { label: "Revenue", value: "$127K", change: "+12%" },
    { label: "Events", value: "8", change: "This month" },
    { label: "Clients", value: "12", change: "Active" },
    { label: "Pending", value: "4", change: "Proposals" },
  ];

  const focusItems = [
    { id: 1, task: "Whitfield Wedding final walkthrough", date: "May 15", priority: "high" },
    { id: 2, task: "Review Nair Brand Launch mood board", date: "May 16", priority: "medium" },
    { id: 3, task: "Venue contract for Fontaine Gala", date: "May 17", priority: "medium" },
    { id: 4, task: "Approve guest list — Johnson Anniversary", date: "May 18", priority: "low" },
  ];

  const activities = [
    { id: 1, client: "Amara Whitfield", action: "Approved floor plan", time: "2 hours ago" },
    { id: 2, client: "Priya Nair", action: "Sent design review notes", time: "4 hours ago" },
    { id: 3, client: "Celeste Fontaine", action: "Budget proposal sent", time: "Yesterday" },
    { id: 4, client: "Devon Whitfield", action: "Inquiry received", time: "2 days ago" },
    { id: 5, client: "Sage Mitchell", action: "Initial consultation scheduled", time: "3 days ago" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: "var(--ink)" }}>
            Dashboard
          </h1>
          <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>Welcome back. Here's your event planning overview.</p>
        </div>
        <button className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
          + New Event
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card">
            <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>{stat.label}</p>
            <p className="text-[32px] font-[family-name:var(--font-heading)] font-semibold my-1" style={{ color: "var(--ink)" }}>{stat.value}</p>
            <p className="text-[12px]" style={{ color: "var(--ink-soft)" }}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-card mb-8">
        <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold mb-4" style={{ color: "var(--ink)" }}>Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "New Client", icon: "👤" },
            { label: "Schedule Call", icon: "📞" },
            { label: "Create Timeline", icon: "📅" },
            { label: "Send Invoice", icon: "💰" },
          ].map((action, idx) => (
            <button key={idx} className="p-4 rounded-lg border transition-all" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
              <div className="text-2xl mb-2">{action.icon}</div>
              <p className="text-[12px] font-bold" style={{ color: "var(--ink)" }}>{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Today's Focus */}
        <div className="glass-card">
          <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold mb-4" style={{ color: "var(--ink)" }}>Today's Focus</h2>
          <div className="space-y-3">
            {focusItems.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "var(--surface-alt)" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: item.priority === "high" ? "var(--red)" : item.priority === "medium" ? "var(--amber)" : "var(--blue)" }}></div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>{item.task}</p>
                  <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card">
          <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold mb-4" style={{ color: "var(--ink)" }}>Activity Feed</h2>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "var(--surface-alt)" }}>
                <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--powder), var(--powder-deep))" }}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>{activity.client}</p>
                  <p className="text-[12px]" style={{ color: "var(--ink-soft)" }}>{activity.action}</p>
                  <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
