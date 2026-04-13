"use client";

import { useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

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
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2">
      {open && (
        <div style={styles.container}>
          {/* Header */}
          <h3 style={{ margin: "0 0 10px 0", color: "#00853E", fontSize: 15, fontWeight: 700 }}>
            🧭 Navi AI
          </h3>

          {/* Messages */}
          <div style={styles.messagesBox}>
            {messages.length === 0 && (
              <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", marginTop: 20 }}>
                Ask me anything about UNT!
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
          </div>

          {/* Input Row */}
          <div style={styles.inputRow}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              style={styles.input}
            />
            <button onClick={sendMessage} disabled={loading} style={styles.button}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-white px-4 py-2 rounded-xl shadow font-bold text-[#00853E] border border-gray-200"
      >
        {open ? "Hide Navi AI" : "Ask Navi AI 🧭"}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: 320,
    maxHeight: 480,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  messagesBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxHeight: 320,
    minHeight: 80,
    paddingRight: 4,
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
    marginTop: 4,
  },
  input: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 13,
    outline: "none",
  },
  button: {
    padding: "8px 12px",
    background: "#00853E",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    whiteSpace: "nowrap",
  },
};