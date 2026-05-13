import { formatCurrency } from "@/lib/utils";

export default function Finance() {
  const revenueStats = [
    { label: "Total Revenue", value: "$127,500", change: "+12% from last month" },
    { label: "Invoiced", value: "$98,200", change: "5 events billed" },
    { label: "Outstanding", value: "$29,300", change: "3 invoices pending" },
    { label: "Expenses", value: "$45,800", change: "-8% month-over-month" },
  ];

  const invoices = [
    { id: 1, client: "Amara Whitfield", event: "Whitfield Wedding", amount: 62000, status: "Paid", date: "May 10" },
    { id: 2, client: "Priya Nair", event: "Nair Brand Launch", amount: 38000, status: "Paid", date: "May 5" },
    { id: 3, client: "Celeste Fontaine", event: "Fontaine Gala", amount: 45000, status: "Pending", date: "Jun 1" },
    { id: 4, client: "Sage Mitchell", event: "Mitchell Gala", amount: 75000, status: "Draft", date: "Aug 1" },
    { id: 5, client: "Devon Whitfield", event: "Johnson Anniversary", amount: 12000, status: "Pending", date: "Aug 15" },
  ];

  const statusColors: Record<string, { bg: string; text: string }> = {
    Paid: { bg: "var(--green-soft)", text: "var(--green-text)" },
    Pending: { bg: "var(--amber-soft)", text: "var(--amber-text)" },
    Draft: { bg: "var(--blue-soft)", text: "var(--blue-text)" },
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: "var(--ink)" }}>
            Finance
          </h1>
          <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>Revenue, invoices, and expenses</p>
        </div>
        <button className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
          + New Invoice
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {revenueStats.map((stat, idx) => (
          <div key={idx} className="glass-card">
            <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>{stat.label}</p>
            <p className="text-[28px] font-[family-name:var(--font-heading)] font-semibold my-2" style={{ color: "var(--ink)" }}>{stat.value}</p>
            <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="glass-card">
          <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold mb-6" style={{ color: "var(--ink)" }}>Revenue Breakdown</h2>
          <div className="flex items-end justify-center gap-4 h-64">
            {[65, 72, 58, 82, 75, 88, 95].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div
                  className="w-8 rounded-t"
                  style={{
                    height: `${val * 2}px`,
                    background: "linear-gradient(180deg, var(--gold), var(--powder-deep))",
                  }}
                ></div>
                <span className="text-[10px]" style={{ color: "var(--ink-muted)" }}>
                  W{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart Placeholder */}
        <div className="glass-card">
          <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold mb-6" style={{ color: "var(--ink)" }}>Expense Categories</h2>
          <div className="flex items-center justify-center gap-8 h-64">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--gold)" strokeWidth="8" strokeDasharray="75.4 100.5" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--blue)" strokeWidth="8" strokeDasharray="25.1 100.5" strokeDashoffset="-75.4" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-center">
                  <p className="font-bold" style={{ color: "var(--ink)" }}>$45.8K</p>
                  <p className="text-[10px]" style={{ color: "var(--ink-muted)" }}>Expenses</p>
                </span>
              </div>
            </div>
            <div className="space-y-3 text-[12px]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: "var(--gold)" }}></div>
                <span style={{ color: "var(--ink)" }}>Venue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: "var(--blue)" }}></div>
                <span style={{ color: "var(--ink)" }}>Catering</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="glass-card mt-6">
        <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold mb-4" style={{ color: "var(--ink)" }}>Recent Invoices</h2>
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--surface-alt)" }}>
              <div className="flex-1">
                <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>{invoice.client}</p>
                <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>{invoice.event}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>{formatCurrency(invoice.amount)}</p>
                <div className="pill" style={{ background: statusColors[invoice.status].bg, color: statusColors[invoice.status].text }}>
                  {invoice.status}
                </div>
              </div>
              <div className="text-right ml-6">
                <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>{invoice.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
