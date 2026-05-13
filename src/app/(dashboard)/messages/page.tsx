import { DEMO_ROOMS } from "@/lib/constants";
import { getInitials } from "@/lib/utils";

export default function Messages() {
  const messages = [
    { id: 1, sender: "Amara Whitfield", text: "Can we adjust the centerpiece arrangement?", time: "2:45 PM", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 2, sender: "You", text: "Absolutely! I have 3 options to show you.", time: "2:52 PM", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 3, sender: "Amara Whitfield", text: "Perfect! Looking forward to seeing them.", time: "3:15 PM", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold" style={{ color: "var(--ink)" }}>
            Messages
          </h1>
          <p className="text-[13px]" style={{ color: "var(--ink-muted)" }}>Client communications and conversations</p>
        </div>
        <button className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
          + New Chat
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversation List */}
        <div className="glass-card overflow-y-auto">
          <h2 className="font-[family-name:var(--font-heading)] text-[16px] font-semibold mb-4 sticky top-0" style={{ color: "var(--ink)" }}>
            Conversations
          </h2>
          <div className="space-y-2">
            {DEMO_ROOMS.map((room) => (
              <button
                key={room.id}
                className="w-full text-left p-3 rounded-lg transition-all hover:bg-opacity-80"
                style={{
                  background: room.id === "room-1" ? "linear-gradient(135deg, rgba(183, 149, 91, 0.1), rgba(189, 212, 228, 0.1))" : "transparent",
                }}
              >
                <div className="flex items-start gap-3">
                  <img src={room.avatarUrl} alt={room.client} className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium text-[13px]" style={{ color: "var(--ink)" }}>
                        {room.client}
                      </h3>
                      {room.unread > 0 && (
                        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "var(--red)" }}>
                          {room.unread}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] truncate" style={{ color: "var(--ink-muted)" }}>
                      {room.event}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--ink-muted)" }}>
                      {room.lastActivity}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-2 glass-card flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Amara" className="w-10 h-10 rounded-full" />
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-[14px] font-semibold" style={{ color: "var(--ink)" }}>
                  Amara Whitfield
                </h3>
                <p className="text-[11px]" style={{ color: "var(--ink-muted)" }}>Whitfield Wedding — Jun 14</p>
              </div>
            </div>
            <button className="text-[20px]">📞</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {messages.map((msg) => {
              const isYou = msg.sender === "You";
              return (
                <div key={msg.id} className={`flex ${isYou ? "justify-end" : "justify-start"} gap-3`}>
                  {!isYou && <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full flex-shrink-0" />}
                  <div className={isYou ? "order-2" : ""}>
                    <div
                      className="px-4 py-2 rounded-lg max-w-xs"
                      style={{
                        background: isYou ? "linear-gradient(135deg, #182b47, #244066)" : "var(--surface-alt)",
                        color: isYou ? "#fff" : "var(--ink)",
                      }}
                    >
                      <p className="text-[13px]">{msg.text}</p>
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: "var(--ink-muted)" }}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-end gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-lg text-[13px] border"
                style={{ borderColor: "var(--border)", background: "var(--surface-alt)", color: "var(--ink)" }}
              />
              <button className="px-4 py-2 rounded-full font-bold text-[12px] text-white uppercase tracking-wider" style={{ background: "linear-gradient(135deg, #182b47, #244066)" }}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
