"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!message.trim()) return;
    const userMsg = message.trim();
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply || "No response received" }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Error connecting to AI" }]);
    }
    setLoading(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-[1500] flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {open && (
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>🧭 Navi AI</span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messagesBox}>
            {messages.length === 0 && (
              <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", marginTop: 20 }}>
                Ask me anything about UNT campus!
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.bubble,
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background: msg.role === "user" ? "#00853E" : "#f0fdf4",
                  color: msg.role === "user" ? "#fff" : "#1f2937",
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ ...styles.bubble, alignSelf: "flex-start", background: "#f0fdf4", color: "#6b7280" }}>
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Row */}
          <div style={styles.inputRow}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              style={styles.input}
              autoFocus
            />
            <button onClick={sendMessage} disabled={loading} style={styles.sendButton}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!open && (
        <div style={{ position: "relative" }}>
          {/* Pulse ring */}
          <span style={styles.pulse} />
          <button
            onClick={() => setOpen(true)}
            style={styles.fab}
          >
            <span style={{ fontSize: 26 }}>🧭</span>
            <span style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>Navi AI</span>
          </button>
        </div>
      )}

      {open && (
        <button
          onClick={() => setOpen(false)}
          style={styles.fab}
        >
          <span style={{ fontSize: 22 }}>✕</span>
        </button>
      )}

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: 320,
    maxHeight: 460,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    background: "#00853E",
    color: "#fff",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  },
  messagesBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxHeight: 300,
    minHeight: 80,
    padding: "12px 12px 4px 12px",
  },
  bubble: {
    padding: "8px 12px",
    borderRadius: 10,
    fontSize: 13,
    lineHeight: 1.5,
    maxWidth: "85%",
    wordBreak: "break-word",
  },
  inputRow: {
    display: "flex",
    gap: 6,
    padding: "10px 12px",
    borderTop: "1px solid #e5e7eb",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 13,
    outline: "none",
  },
  sendButton: {
    padding: "8px 12px",
    background: "#00853E",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 16,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "#00853E",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0,133,62,0.5)",
    position: "relative",
    zIndex: 1,
  },
  pulse: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "#00853E",
    animation: "pulse-ring 1.5s ease-out infinite",
    zIndex: 0,
  },
};