// Limpia posibles barras finales para evitar // en las URLs
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

// Si viene VITE_API_URL (prod), usamos https://api.tu-dominio.com/api
// Si no (dev), usamos /api para que el proxy de Vite funcione.
const BASE = API_URL ? `${API_URL}/api` : "/api";

// Helper para manejar fetch + JSON y errores HTTP
async function toJSON(promise) {
  const res = await promise;
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} ${text ? "- " + text : ""}`.trim());
  }
  return res.json();
}

// ---- Endpoints ----
export function getMenu() {
  return toJSON(fetch(`${BASE}/menu`, { credentials: "include" }));
}

// Ejemplos para cuando los necesites:
// export function getData() {
//   return toJSON(fetch(`${BASE}/data`, { credentials: "include" }));
// }
//
// export function login(payload) {
//   return toJSON(fetch(`${BASE}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//     credentials: "include",
//   }));
// }

export { BASE, API_URL };
