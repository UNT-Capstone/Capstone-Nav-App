"use client";

import { useState } from "react";

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setReply(data.reply || "No response received");
    } catch (err) {
      setReply("Error connecting to AI");
    }
    setLoading(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2">
      {open && (
        <div style={styles.container}>
          <h3 style={{ margin: "0 0 12px 0", color: "#00853E", fontSize: 16, fontWeight: 700 }}>
            🧭 Navi AI
          </h3>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something about UNT..."
            style={styles.input}
          />
          <button onClick={sendMessage} disabled={loading} style={styles.button}>
            {loading ? "Thinking..." : "Send"}
          </button>
          {reply && (
            <div style={styles.replyBox}>
              <strong>Navi:</strong>
              <p style={{ margin: "6px 0 0 0" }}>{reply}</p>
            </div>
          )}
        </div>
      )}

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
    padding: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    width: 320,
    background: "#ffffff",
    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
  },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #d1d5db",
    fontSize: 14,
    boxSizing: "border-box",
  },
  button: {
    padding: "8px 16px",
    background: "#00853E",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  replyBox: {
    marginTop: 12,
    padding: 10,
    background: "#f0fdf4",
    borderRadius: 8,
    fontSize: 14,
    color: "#1f2937",
  },
};