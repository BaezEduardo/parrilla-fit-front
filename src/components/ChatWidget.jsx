// client/src/components/ChatWidget.jsx
import { useEffect, useRef, useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { role: "assistant", text: "Hola 👋 ¿Qué buscas? Puedo recomendarte platillos según gustos o alérgenos." }
  ]);
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [msgs, open]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setMsgs(m => [...m, { role: "user", text }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      setMsgs(m => [...m, { role: "assistant", text: data.reply || "No tengo respuesta ahora." }]);
    } catch {
      setMsgs(m => [...m, { role: "assistant", text: "Hubo un problema al responder." }]);
    }
  }

  return (
    <>
      {/* Burbuja */}
      <button className="chat-bubble" onClick={() => setOpen(v => !v)}>💬</button>

      {/* Panel */}
      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <strong>Asistente</strong>
            <button className="close" onClick={() => setOpen(false)}>✖</button>
          </div>
          <div className="chat-body" ref={boxRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>{m.text}</div>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Pregunta por ingredientes, gustos o alérgenos…"
              onKeyDown={e => e.key === "Enter" && send()}
            />
            <button onClick={send}>Enviar</button>
          </div>
        </div>
      )}
    </>
  );
}
