"use client";

import { useState, useRef } from "react";
import {
  Settings,
  User,
  Palette,
  Plug,
  Bell,
  Shield,
  Eye,
  EyeOff,
  LogOut,
  Monitor,
  Smartphone,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

type SettingsTab = "profile" | "branding" | "integrations" | "notifications" | "security";

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User size={16} /> },
  { id: "branding", label: "Branding", icon: <Palette size={16} /> },
  { id: "integrations", label: "Integrations", icon: <Plug size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "security", label: "Security", icon: <Shield size={16} /> },
];

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "var(--ink-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "var(--r)",
  border: "1px solid var(--border)",
  background: "var(--surface-strong)",
  fontSize: 13,
  color: "var(--ink)",
  outline: "none",
};

const cardStyle: React.CSSProperties = {
  padding: 24,
  borderRadius: "var(--r-lg)",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  boxShadow: "var(--sh)",
};

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("profile");
  const { toast } = useToast();

  const save = () => toast("Settings saved", { variant: "success" });

  return (
    <div className="page-content" style={{ maxWidth: 1000 }}>
      {/* Header */}
      <div className="page-header" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--navy)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Settings size={18} style={{ color: "var(--gold)" }} />
        </div>
        <div>
          <h1
            style={{
              fontFamily: "var(--font-h)",
              fontSize: 26,
              fontWeight: 600,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Settings
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: 0 }}>
            Manage your account, branding, and preferences
          </p>
        </div>
      </div>

      {/* Layout: sidebar tabs + content */}
      <div className="settings-layout">
        {/* Tab nav */}
        <div className="settings-tabs" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: "var(--r)",
                border: "none",
                background: tab === t.id ? "var(--surface)" : "transparent",
                color: tab === t.id ? "var(--ink)" : "var(--ink-soft)",
                fontWeight: tab === t.id ? 700 : 500,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.12s",
                boxShadow: tab === t.id ? "var(--sh)" : "none",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {tab === "profile" && <ProfileTab onSave={save} />}
          {tab === "branding" && <BrandingTab onSave={save} />}
          {tab === "integrations" && <IntegrationsTab />}
          {tab === "notifications" && <NotificationsTab onSave={save} />}
          {tab === "security" && <SecurityTab onSave={save} />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ onSave }: { onSave: () => void }) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File must be under 2MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ fontFamily: "var(--font-h)", fontSize: 18, fontWeight: 600, margin: "0 0 20px", color: "var(--ink)" }}>
        Profile
      </h2>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Avatar preview"
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--gold), var(--navy))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            TC
          </div>
        )}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
            Upload Photo
          </Button>
          <div style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 6 }}>
            JPG, PNG up to 2MB
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={labelStyle}>First Name</div>
          <input style={inputStyle} defaultValue="Topaz" />
        </div>
        <div>
          <div style={labelStyle}>Last Name</div>
          <input style={inputStyle} defaultValue="Curtis" />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>Email</div>
        <input style={inputStyle} defaultValue="topaz@bleuchandelier.com" type="email" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>Phone</div>
        <input style={inputStyle} defaultValue="(404) 555-0100" type="tel" />
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={labelStyle}>Timezone</div>
        <select style={inputStyle}>
          <option>America/New_York (EST)</option>
          <option>America/Chicago (CST)</option>
          <option>America/Los_Angeles (PST)</option>
        </select>
      </div>
      <Button variant="gold" onClick={onSave}>Save Profile</Button>
    </div>
  );
}

function BrandingTab({ onSave }: { onSave: () => void }) {
  const colors = ["#0d1929", "#b7955b", "#bdd4e4", "#f2d8dd", "#1a3050"];
  return (
    <div style={cardStyle}>
      <h2 style={{ fontFamily: "var(--font-h)", fontSize: 18, fontWeight: 600, margin: "0 0 20px", color: "var(--ink)" }}>
        Branding
      </h2>
      <div style={{ marginBottom: 24 }}>
        <div style={labelStyle}>Logo</div>
        <div
          style={{
            border: "2px dashed var(--border)",
            borderRadius: "var(--r)",
            padding: 24,
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 4 }}>✦</div>
          <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>Drop logo here or click to upload</div>
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={labelStyle}>Brand Colors</div>
        <div style={{ display: "flex", gap: 10 }}>
          {colors.map((c) => (
            <div
              key={c}
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--r)",
                background: c,
                border: "2px solid var(--border)",
                cursor: "pointer",
              }}
            />
          ))}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--r)",
              border: "2px dashed var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "var(--ink-muted)",
              cursor: "pointer",
            }}
          >
            +
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={labelStyle}>Font</div>
        <select style={inputStyle}>
          <option>DM Sans (Default)</option>
          <option>Inter</option>
          <option>Playfair Display</option>
          <option>Cormorant Garamond</option>
        </select>
      </div>
      <Button variant="gold" onClick={onSave}>Save Branding</Button>
    </div>
  );
}

function IntegrationsTab() {
  const integrations = [
    { name: "LiveKit", desc: "Video conferencing", status: "connected" as const, icon: "🎥" },
    { name: "Stripe", desc: "Payment processing", status: "connected" as const, icon: "💳" },
    { name: "Supabase", desc: "Database & auth", status: "connected" as const, icon: "🗄️" },
    { name: "Google Calendar", desc: "Calendar sync", status: "disconnected" as const, icon: "📅" },
    { name: "Zapier", desc: "Workflow automations", status: "disconnected" as const, icon: "⚡" },
  ];

  return (
    <div style={cardStyle}>
      <h2 style={{ fontFamily: "var(--font-h)", fontSize: 18, fontWeight: 600, margin: "0 0 20px", color: "var(--ink)" }}>
        Integrations
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {integrations.map((int) => (
          <div
            key={int.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: 16,
              borderRadius: "var(--r)",
              background: "var(--surface-alt)",
            }}
          >
            <div style={{ fontSize: 24, width: 40, textAlign: "center" }}>{int.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{int.name}</div>
              <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{int.desc}</div>
            </div>
            <Button
              variant={int.status === "connected" ? "secondary" : "primary"}
              size="sm"
            >
              {int.status === "connected" ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsTab({ onSave }: { onSave: () => void }) {
  const categories = [
    { label: "New Inquiry", email: true, push: true, sms: false },
    { label: "Payment Received", email: true, push: true, sms: true },
    { label: "Event Reminder", email: true, push: true, sms: false },
    { label: "Client Message", email: false, push: true, sms: false },
    { label: "Invoice Overdue", email: true, push: true, sms: true },
    { label: "Staff Updates", email: true, push: false, sms: false },
  ];

  return (
    <div style={cardStyle}>
      <h2 style={{ fontFamily: "var(--font-h)", fontSize: 18, fontWeight: 600, margin: "0 0 20px", color: "var(--ink)" }}>
        Notifications
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 60px 60px", gap: "12px 8px", alignItems: "center" }}>
        <div />
        <div style={{ ...labelStyle, textAlign: "center", marginBottom: 0 }}>Email</div>
        <div style={{ ...labelStyle, textAlign: "center", marginBottom: 0 }}>Push</div>
        <div style={{ ...labelStyle, textAlign: "center", marginBottom: 0 }}>SMS</div>
        {categories.map((cat) => (
          <div key={cat.label} style={{ display: "contents" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{cat.label}</div>
            {[cat.email, cat.push, cat.sms].map((on, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "center" }}>
                <input type="checkbox" defaultChecked={on} style={{ cursor: "pointer", width: 18, height: 18 }} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <Button variant="gold" onClick={onSave}>Save Preferences</Button>
      </div>
    </div>
  );
}

function SecurityTab({ onSave }: { onSave: () => void }) {
  const [showPw, setShowPw] = useState(false);

  const sessions = [
    { device: "MacBook Pro", location: "Atlanta, GA", current: true, icon: <Monitor size={16} /> },
    { device: "iPhone 15 Pro", location: "Atlanta, GA", current: false, icon: <Smartphone size={16} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={cardStyle}>
        <h2 style={{ fontFamily: "var(--font-h)", fontSize: 18, fontWeight: 600, margin: "0 0 20px", color: "var(--ink)" }}>
          Change Password
        </h2>
        <div style={{ marginBottom: 16 }}>
          <div style={labelStyle}>Current Password</div>
          <div style={{ position: "relative" }}>
            <input style={inputStyle} type={showPw ? "text" : "password"} defaultValue="••••••••" />
            <button
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--ink-muted)",
              }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <div style={labelStyle}>New Password</div>
            <input style={inputStyle} type="password" placeholder="Min 8 characters" />
          </div>
          <div>
            <div style={labelStyle}>Confirm Password</div>
            <input style={inputStyle} type="password" placeholder="Repeat password" />
          </div>
        </div>
        <Button variant="gold" onClick={onSave}>Update Password</Button>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontFamily: "var(--font-h)", fontSize: 18, fontWeight: 600, margin: "0 0 20px", color: "var(--ink)" }}>
          Two-Factor Authentication
        </h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Enable 2FA</div>
            <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 2 }}>
              Add an extra layer of security to your account
            </div>
          </div>
          <input type="checkbox" style={{ width: 20, height: 20, cursor: "pointer" }} />
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "var(--font-h)", fontSize: 18, fontWeight: 600, margin: 0, color: "var(--ink)" }}>
            Active Sessions
          </h2>
          <Button variant="danger" size="sm">
            <LogOut size={12} /> Sign Out All
          </Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sessions.map((s) => (
            <div
              key={s.device}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 14,
                borderRadius: "var(--r)",
                background: "var(--surface-alt)",
              }}
            >
              <div style={{ color: "var(--ink-soft)" }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                  {s.device}
                  {s.current && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 10,
                        fontWeight: 700,
                        background: "var(--green)",
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: 999,
                      }}
                    >
                      Current
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 2 }}>{s.location}</div>
              </div>
              {!s.current && (
                <Button variant="secondary" size="sm">Revoke</Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
