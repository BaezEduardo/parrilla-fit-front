import { useEffect, useMemo, useRef, useState } from "react";
import { ai } from "../lib/api";
import { useAuth } from "../context/AuthContext";

// Utilidad mínima para scroll al final
function useAutoScroll(dep) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [dep]);
  return ref;
}

export default function ChatBubble({ dishes = [] }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState(() => [
    {
      role: "assistant",
      content:
        "¡Hola! Soy Chefin, asistente del menú de **La Parrilla Fit**. Solo respondo dudas y recomendaciones sobre los platillos del menú. ¿Qué se te antoja hoy?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useAutoScroll(msgs);

  // Contexto de menú compacto que se envía a n8n
  const menuContext = useMemo(
    () =>
      dishes
        .map((d) => ({
          name: d.Name ?? d.name,
          price: d.Price ?? d.price,
          cat: d.Category ?? d.category,
          desc: d.Description ?? d.description,
          ingredients: d.Ingredients ?? d.ingredients ?? null,
        }))
        .slice(0, 50),
    [dishes]
  );

  async function send() {
    const text = input.trim();
    if (!text) return;

    setInput("");
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await ai.chat({
        query: text,
        user: user
          ? {
              id: user.id,
              name: user.name,
              phone: user.phone,
              role: user.role,
              likes: user.likes || [],
              dislikes: user.dislikes || [],
              allergies: user.allergies || [],
            }
          : null,
        menu: menuContext,
      });

      setMsgs((m) => [
        ...m,
        { role: "assistant", content: res?.answer || "…" },
      ]);
    } catch (e) {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: e.message || "No pude responder ahora.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        className="chat-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir chat"
        title="Recomendaciones"
      >
        💬
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <div>
              <strong>Chefin</strong>
              <div className="chat-sub">
                Solo respondo dudas sobre el menú de La Parrilla Fit
              </div>
            </div>
            <button
              className="btn icon"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="chat-list" ref={listRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                <div
                  className="bubble"
                  dangerouslySetInnerHTML={{ __html: mdSafe(m.content) }}
                />
              </div>
            ))}
            {loading && (
              <div className="msg assistant">
                <div className="bubble">Escribiendo…</div>
              </div>
            )}
          </div>

          <div className="chat-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={2}
              placeholder="Hazme una pregunta sobre el menú…"
            />
            <button
              className="btn primary"
              onClick={send}
              disabled={loading || !input.trim()}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Sanitiza muy básico (negritas y saltos); si ya usas un MD renderer, cámbialo.
function mdSafe(s = "") {
  return String(s)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br/>");
}
