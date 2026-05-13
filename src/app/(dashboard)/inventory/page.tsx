export default function Inventory() {
  const items = [
    { id: 1, name: "Gold Charger Plates", quantity: 240, status: "In Stock", nfc: true, image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400" },
    { id: 2, name: "Silk Table Runners", quantity: 45, status: "In Stock", nfc: true, image: "https://images.unsplash.com/photo-1584622614875-e51df1bdc82f?w=400" },
    { id: 3, name: "Crystal Candle Holders", quantity: 120, status: "Low Stock", nfc: false, image: "https://images.unsplash.com/photo-1584622614875-e51df1bdc82f?w=400" },
    { id: 4, name: "Floral Arrangements", quantity: 8, status: "Low Stock", nfc: true, image: "https://images.unsplash.com/photo-1585664632456-c3416a6f7eb9?w=400" },
    { id: 5, name: "Linen Napkins", quantity: 500, status: "In Stock", nfc: false, image: "https://images.unsplash.com/photo-1584622614875-e51df1bdc82f?w=400" },
    { id: 6, name: "String Lights", quantity: 6, status: "Low Stock", nfc: true, image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400" },
  ];

  const statusColors: Record<string, string> = {
    "In Stock": "var(--green-soft)",
    "Low Stock": "var(--amber-soft)",
  };

  const statusTextColors: Record<string, string> = {
    "In Stock": "var(--green-text)",
    "Low Stock": "var(--amber-text)",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: "var(--ink)" }}>
            Inventory
          </h1>
          <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>Track items, stock levels, and NFC tags</p>
        </div>
        <button className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
          + Add Item
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card">
          <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>Total Items</p>
          <p className="text-[32px] font-[family-name:var(--font-heading)] font-semibold my-1" style={{ color: "var(--ink)" }}>919</p>
          <p className="text-[12px]" style={{ color: "var(--ink-soft)" }}>6 categories</p>
        </div>
        <div className="glass-card">
          <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>In Stock</p>
          <p className="text-[32px] font-[family-name:var(--font-heading)] font-semibold my-1" style={{ color: "var(--ink)" }}>845</p>
          <p className="text-[12px]" style={{ color: "var(--ink-soft)" }}>92%</p>
        </div>
        <div className="glass-card">
          <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>NFC Tagged</p>
          <p className="text-[32px] font-[family-name:var(--font-heading)] font-semibold my-1" style={{ color: "var(--ink)" }}>4</p>
          <p className="text-[12px]" style={{ color: "var(--ink-soft)" }}>67%</p>
        </div>
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="glass-card overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-4" />
            <h3 className="font-[family-name:var(--font-heading)] text-[14px] font-semibold mb-2" style={{ color: "var(--ink)" }}>
              {item.name}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px]" style={{ color: "var(--ink-muted)" }}>Quantity</span>
                <span className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>{item.quantity}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="pill" style={{ background: statusColors[item.status], color: statusTextColors[item.status] }}>
                  {item.status}
                </div>
                {item.nfc && (
                  <div className="pill" style={{ background: "var(--blue-soft)", color: "var(--blue-text)" }}>
                    NFC ✓
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
