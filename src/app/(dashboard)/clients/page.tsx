import { DEMO_CLIENTS } from "@/lib/constants";
import { formatCurrency, getInitials } from "@/lib/utils";

export default function Clients() {
  const statusColors: Record<string, { bg: string; text: string }> = {
    Active: { bg: "var(--green-soft)", text: "var(--green-text)" },
    Planning: { bg: "var(--blue-soft)", text: "var(--blue-text)" },
    Proposal: { bg: "var(--amber-soft)", text: "var(--amber-text)" },
    Inquiry: { bg: "var(--blue-soft)", text: "var(--blue-text)" },
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: "var(--ink)" }}>
            Clients
          </h1>
          <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>Manage all client relationships and events</p>
        </div>
        <button className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
          + New Client
        </button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 gap-4">
        {DEMO_CLIENTS.map((client) => {
          const spent = client.spent;
          const budget = client.budget;
          const progress = (spent / budget) * 100;
          const statusColor = statusColors[client.status] || statusColors.Inquiry;

          return (
            <div key={client.id} className="glass-card">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <img
                  src={client.avatar}
                  alt={client.name}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-[family-name:var(--font-heading)] text-[16px] font-semibold" style={{ color: "var(--ink)" }}>
                        {client.name}
                      </h3>
                      <p className="text-[12px]" style={{ color: "var(--ink-soft)" }}>
                        {client.event} • {client.date}
                      </p>
                    </div>
                    <div className="pill" style={{ background: statusColor.bg, color: statusColor.text }}>
                      {client.status}
                    </div>
                  </div>

                  {/* Guest Count & Budget Row */}
                  <div className="flex items-center justify-between gap-4 mb-3 text-[12px]">
                    <div>
                      <span style={{ color: "var(--ink-muted)" }}>Guests:</span>{" "}
                      <span style={{ color: "var(--ink)" }} className="font-medium">
                        {client.guests}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "var(--ink-muted)" }}>Budget:</span>{" "}
                      <span style={{ color: "var(--ink)" }} className="font-medium">
                        {formatCurrency(budget)}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "var(--ink-muted)" }}>Spent:</span>{" "}
                      <span style={{ color: "var(--ink)" }} className="font-medium">
                        {formatCurrency(spent)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2" style={{ background: "var(--surface-alt)" }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        background: "linear-gradient(90deg, var(--gold), var(--powder))",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
