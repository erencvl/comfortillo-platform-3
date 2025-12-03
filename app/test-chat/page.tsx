"use client"
import { useState } from "react"

export default function TestChatPage() {
  const [input, setInput] = useState("")
  const [reply, setReply] = useState("")

  const handleSend = async () => {
    const message = input
    setInput("")
    setReply("Bekleniyor...")

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: message }],
      }),
    })

    if (!res.body) {
      setReply("Yanıt alınamadı.")
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let aiResponse = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      console.log("AI'dan gelen chunk:", chunk)
      aiResponse += chunk
      setReply(aiResponse)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🧠 Comfortillo Test Chat</h1>
      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Mesajını yaz..."
        style={{ width: "100%", marginBottom: 12 }}
      />
      <button onClick={handleSend} style={{ padding: 8 }} disabled={!input.trim()}>
        Gönder
      </button>

      <div style={{ marginTop: 20 }}>
        <strong>AI cevabı:</strong>
        <p>{reply}</p>
      </div>
    </div>
  )
}