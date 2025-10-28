// src/lib/api.js

// Siempre pegamos al backend vía el proxy de Vite en dev y mismo origen en prod
const API = "/api";

// Helper JSON fetch con cookies
async function jfetch(path, opts = {}) {
  const res = await fetch(path.startsWith("http") ? path : `${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });

  if (res.status === 204) return null;

  const ct = res.headers.get("content-type") || "";
  const isJSON = ct.includes("application/json");
  const data = isJSON ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const msg = isJSON ? (data?.error || data?.message) : data;
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return data;
}

/* ---------- AUTH ---------- */
export const auth = {
  me: () => jfetch(`/auth/me`),

  login: ({ phone, password }) =>
    jfetch(`/auth/login`, { method: "POST", body: JSON.stringify({ phone, password }) }),

  logout: () => jfetch(`/auth/logout`, { method: "POST" }),

  changePassword: (payload) =>
    jfetch(`/auth/password`, { method: "PUT", body: JSON.stringify(payload) }),

  deleteAccount: (payload) =>
    jfetch(`/auth/me`, { method: "DELETE", body: JSON.stringify(payload) }),
};

/* ---------- PÚBLICO (platillos) ---------- */
export const dishes = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([, v]) => v != null && v !== "")
      )
    ).toString();
    return jfetch(`/dishes${qs ? `?${qs}` : ""}`);
  },
};

/* ---------- PREFERENCIAS (usuario actual) ---------- */
export const prefs = {
  getMe: () => jfetch(`/preferences/me`),
  updateMe: (payload) => jfetch(`/preferences/me`, { method: "PUT", body: JSON.stringify(payload) }),
};

/* ---------- ADMIN ---------- */
export const admin = {
  listUsers: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([, v]) => v != null && v !== "")
      )
    ).toString();
    // Backend responde { items, count }
    return jfetch(`/users${qs ? `?${qs}` : ""}`);
  },
  deleteUser: (id) => jfetch(`/users/${id}`, { method: "DELETE" }), // 204
};
