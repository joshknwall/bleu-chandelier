import { Package } from "lucide-react";

export default function Inventory() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: 'var(--ink)' }}>Inventory</h1>
          <p className="text-[13px]" style={{ color: 'var(--ink-muted)' }}>Track your event supplies and equipment</p>
        </div>
      </div>
      <div className="glass-card" style={{ textAlign: 'center', padding: '80px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, opacity: 0.3 }}>
          <Package size={48} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>No inventory items yet</div>
        <div style={{ fontSize: 14, color: 'var(--ink-muted)', maxWidth: 400, margin: '0 auto 24px' }}>Track your event supplies and equipment</div>
        <button style={{ background: 'linear-gradient(135deg, #182b47, #244066)', color: '#fff', border: 'none', borderRadius: '999px', padding: '10px 24px', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>+ Add First Item</button>
      </div>
    </div>
  );
}
