"use client";

import { useState } from "react";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <div style={styles.container}>
      <h3>Navi AI</h3>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        style={styles.input}
      />

      <button onClick={sendMessage} style={styles.button}>
        Send
      </button>

      {loading && <p>Thinking...</p>}

      {reply && (
        <div style={styles.replyBox}>
          <strong>Reply:</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 16,
    border: "1px solid #ddd",
    borderRadius: 10,
    width: 320,
  },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 10,
  },
  button: {
    padding: "8px 12px",
  },
  replyBox: {
    marginTop: 10,
    padding: 10,
    background: "#f5f5f5",
  },
};