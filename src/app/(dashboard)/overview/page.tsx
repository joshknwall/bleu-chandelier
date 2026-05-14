import { LayoutDashboard } from "lucide-react";

export default function Overview() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: 'var(--ink)' }}>Welcome to Bleu Chandelier</h1>
          <p className="text-[13px]" style={{ color: 'var(--ink-muted)' }}>Your command center</p>
        </div>
      </div>
      <div className="glass-card" style={{ textAlign: 'center', padding: '80px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, opacity: 0.3 }}>
          <LayoutDashboard size={48} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>Your dashboard is ready</div>
        <div style={{ fontSize: 14, color: 'var(--ink-muted)', maxWidth: 400, margin: '0 auto 24px' }}>Your command center will populate as you add clients and events</div>
        <button style={{ background: 'linear-gradient(135deg, #182b47, #244066)', color: '#fff', border: 'none', borderRadius: '999px', padding: '10px 24px', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>+ Add First Client</button>
      </div>
    </div>
  );
}
