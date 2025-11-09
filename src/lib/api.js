// api.js
const RUNTIME_API =
  typeof window !== "undefined" && window.__API_BASE__ || null;

const API = RUNTIME_API || (
  import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL || "/api")
    : "/api"
);

if (import.meta.env.PROD) console.log("API base:", API);

// Helper JSON fetch con cookies (robusto ante 401/HTML)
async function jfetch(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${API}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });

  if (res.status === 204) return null;

  const ct = res.headers.get("content-type") || "";
  const isJSON = ct.includes("application/json");
  let data = null;

  if (isJSON) {
    try { data = await res.json(); } catch { data = null; }
  } else {
    data = await res.text().catch(() => null);
  }

  if (!res.ok) {
    const msg = isJSON ? (data?.error || data?.message)
                       : (typeof data === "string" ? data : `HTTP ${res.status}`);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return data;
}

/* ---------- AUTH ---------- */
export const auth = {
  me:       ()            => jfetch(`/auth/me`),
  login:    (payload)     => jfetch(`/auth/login`,    { method: "POST", body: JSON.stringify(payload) }),
  register: (payload)     => jfetch(`/auth/register`, { method: "POST", body: JSON.stringify(payload) }),
  logout:   ()            => jfetch(`/auth/logout`,   { method: "POST" }),
};

/* ---------- PROFILE ---------- */
export const profile = {
  changePassword: (payload) => jfetch(`/users/me/password`,    { method: "PUT",    body: JSON.stringify(payload) }),
  updatePrefs:    (payload) => jfetch(`/users/me/preferences`, { method: "PUT",    body: JSON.stringify(payload) }),
  deleteMe:       ()        => jfetch(`/users/me`,             { method: "DELETE" }),
};

/* ---------- DISHES (admin) ---------- */
export const dishes = {
  list:   ()                 => jfetch(`/dishes`),
  create: (payload)          => jfetch(`/dishes`,        { method: "POST",   body: JSON.stringify(payload) }),
  update: (id, payload)      => jfetch(`/dishes/${id}`,  { method: "PATCH",  body: JSON.stringify(payload) }),
  remove: (id)               => jfetch(`/dishes/${id}`,  { method: "DELETE" }),
};

/* ---------- USERS (admin) ---------- */
export const users = {
  list:    ()               => jfetch(`/users`),
  remove:  (id)             => jfetch(`/users/${id}`,          { method: "DELETE" }),
  setRole: (id, role)       => jfetch(`/users/${id}/role`,     { method: "PATCH", body: JSON.stringify({ role }) }),
};

/* ---------- AI CHAT ---------- */
export const ai = {
  chat: (payload) => jfetch(`/ai/chat`, { method: "POST", body: JSON.stringify(payload) }),
};

export { API }; // opcional si quieres inspeccionarlo en otros módulos
