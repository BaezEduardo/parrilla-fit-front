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
  login: (payload) => jfetch(`/auth/login`, { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => jfetch(`/auth/register`, { method: "POST", body: JSON.stringify(payload) }),
  logout: () => jfetch(`/auth/logout`, { method: "POST" }),
};

/* ---------- PROFILE ---------- */
export const profile = {
  changePassword: (payload) => jfetch(`/users/me/password`, { method: "PUT", body: JSON.stringify(payload) }),
  updatePrefs:   (payload) => jfetch(`/users/me/preferences`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteMe:      () =>      jfetch(`/users/me`, { method: "DELETE" }),
};

/* ---------- DISHES (admin) ---------- */
export const dishes = {
  list:   () => jfetch(`/dishes`),
  create: (payload) => jfetch(`/dishes`, { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => jfetch(`/dishes/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  remove: (id) => jfetch(`/dishes/${id}`, { method: "DELETE" }),
};

/* ---------- USERS (admin) ---------- */
export const users = {
  list:   () => jfetch(`/users`),
  remove: (id) => jfetch(`/users/${id}`, { method: "DELETE" }),
  setRole: (id, role) => jfetch(`/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
};
