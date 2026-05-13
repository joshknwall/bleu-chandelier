export default function Website() {
  const components = [
    { id: 1, name: "Hero Section", type: "Banner", modified: "2 hours ago" },
    { id: 2, name: "Services Grid", type: "Layout", modified: "Yesterday" },
    { id: 3, name: "Testimonials", type: "Section", modified: "May 10" },
    { id: 4, name: "Contact Form", type: "Form", modified: "May 8" },
    { id: 5, name: "FAQ Section", type: "Accordion", modified: "May 5" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: "var(--ink)" }}>
            Website
          </h1>
          <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>Page builder and site management</p>
        </div>
        <button className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
          + New Page
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Palette Sidebar */}
        <div className="glass-card">
          <h2 className="font-[family-name:var(--font-heading)] text-[16px] font-semibold mb-4" style={{ color: "var(--ink)" }}>
            Components
          </h2>
          <div className="space-y-3">
            {[
              { name: "Text", icon: "T" },
              { name: "Image", icon: "🖼️" },
              { name: "Button", icon: "◼️" },
              { name: "Form", icon: "📝" },
              { name: "Grid", icon: "⊞" },
              { name: "Carousel", icon: "▶" },
            ].map((comp, idx) => (
              <button key={idx} className="w-full p-3 rounded-lg text-left text-[12px] font-medium transition-all" style={{ background: "var(--surface-alt)", color: "var(--ink)" }}>
                <span>{comp.icon}</span> {comp.name}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="col-span-3">
          <div className="glass-card mb-6">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-[family-name:var(--font-heading)] text-[18px] font-semibold" style={{ color: "var(--ink)" }}>
                Homepage
              </h2>
              <button className="px-3 py-1.5 rounded-full text-[11px] font-bold" style={{ background: "var(--green-soft)", color: "var(--green-text)" }}>
                Published
              </button>
            </div>

            {/* Canvas Placeholder */}
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg p-6 min-h-96" style={{ background: "linear-gradient(180deg, #f8fbff, #f0f5fa)" }}>
              <div className="space-y-4">
                <div className="h-16 rounded-lg" style={{ background: "var(--powder-light)" }}></div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-24 rounded-lg" style={{ background: "var(--surface-alt)" }}></div>
                      <div className="h-3 rounded-full w-3/4" style={{ background: "var(--border)" }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pages List */}
          <div className="glass-card">
            <h2 className="font-[family-name:var(--font-heading)] text-[16px] font-semibold mb-4" style={{ color: "var(--ink)" }}>
              Pages
            </h2>
            <div className="space-y-2">
              {components.map((comp) => (
                <div key={comp.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--surface-alt)" }}>
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>{comp.name}</p>
                    <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>{comp.type}</p>
                  </div>
                  <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>{comp.modified}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
