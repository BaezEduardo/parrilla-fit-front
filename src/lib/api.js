// src/lib/api.js
//
// Cliente HTTP minimalista para el frontend de Parrilla Fit.
// - Usa fetch con credentials: "include" para que viajen las cookies (JWT).
// - Tolera paths con o sin prefijo /api.
// - Parsea JSON cuando corresponde y propaga mensajes de error legibles.
//
// Cómo usar:
//   import { auth, dishes, users } from "../lib/api";
//   const me = await auth.me();
//   const lista = await dishes.list({ q: "pollo", limit: 20 });
//
// NOTA: En dev, Vite proxya /api hacia tu backend. En prod, mismo origen.
//       Puedes forzar dominio del backend con VITE_API_URL, si lo necesitas.

const API_BASE = import.meta?.env?.VITE_API_URL || "/api";

/** Construye la URL final tolerando:
 *  - "http(s)://..."  → se usa tal cual
 *  - "/api/..."       → se usa tal cual
 *  - "/auth/me"       → se convierte a `${API_BASE}/auth/me`
 *  - "auth/me"        → se convierte a `${API_BASE}/auth/me`
 */
function buildUrl(path) {
  if (!path) throw new Error("Path requerido");
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/api/")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${clean}`;
}

/** Serializa un objeto a querystring (ignora null/undefined/""/NaN). */
function qs(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    if (typeof v === "string" && v.trim() === "") return;
    if (Number.isNaN(v)) return;
    if (Array.isArray(v)) {
      v.forEach((item) => sp.append(k, item));
    } else {
      sp.set(k, String(v));
    }
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** fetch JSON helper con manejo de errores y cookies. */
export async function jfetch(path, opts = {}) {
  const url = buildUrl(path);

  const headers = new Headers(opts.headers || {});
  const hasBody = opts.body !== undefined && opts.body !== null;

  // Si el body es un objeto plano, lo enviamos como JSON
  let body = opts.body;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (hasBody && !isFormData && typeof body === "object") {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const res = await fetch(url, {
    credentials: "include",
    ...opts,
    headers,
    body,
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

/* =========================
 *        AUTH API
 * ========================= */
export const auth = {
  /** GET /auth/me */
  async me() {
    return jfetch("/auth/me");
  },

  /** POST /auth/login  -> { phone, password } */
  async login({ phone, password }) {
    return jfetch("/auth/login", {
      method: "POST",
      body: { phone, password },
    });
  },

  /** POST /auth/logout */
  async logout() {
    return jfetch("/auth/logout", { method: "POST" });
  },

  /** POST /auth/register -> { name, phone, password } */
  async register({ name, phone, password }) {
    return jfetch("/auth/register", {
      method: "POST",
      body: { name, phone, password },
    });
  },

  /** POST /auth/change-password -> { currentPassword, newPassword } */
  async changePassword({ currentPassword, newPassword }) {
    return jfetch("/auth/change-password", {
      method: "POST",
      body: { currentPassword, newPassword },
    });
  },
};

/* =========================
 *       DISHES API
 * ========================= */
export const dishes = {
  /** GET /dishes?q=&category=&limit=&offset=  */
  async list({ q, category, limit, offset } = {}) {
    return jfetch(`/dishes${qs({ q, category, limit, offset })}`);
  },

  /** GET /dishes/:id */
  async get(id) {
    if (!id) throw new Error("id requerido");
    return jfetch(`/dishes/${encodeURIComponent(id)}`);
  },

  /** POST /dishes  -> dish */
  async create(dish) {
    if (!dish) throw new Error("payload requerido");
    return jfetch("/dishes", { method: "POST", body: dish });
  },

  /** PATCH /dishes/:id  -> partial dish */
  async update(id, patch) {
    if (!id) throw new Error("id requerido");
    if (!patch) throw new Error("payload requerido");
    return jfetch(`/dishes/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: patch,
    });
  },

  /** DELETE /dishes/:id */
  async remove(id) {
    if (!id) throw new Error("id requerido");
    return jfetch(`/dishes/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};

/* =========================
 *        USERS API
 * ========================= */
export const users = {
  /** GET /users?role=&q=&limit=&offset= */
  async list({ role, q, limit, offset } = {}) {
    return jfetch(`/users${qs({ role, q, limit, offset })}`);
  },

  /** GET /users/:id */
  async get(id) {
    if (!id) throw new Error("id requerido");
    return jfetch(`/users/${encodeURIComponent(id)}`);
  },

  /** POST /users -> { name, phone, password, role } */
  async create(payload) {
    if (!payload) throw new Error("payload requerido");
    return jfetch("/users", { method: "POST", body: payload });
  },

  /** PATCH /users/:id -> partial user */
  async update(id, patch) {
    if (!id) throw new Error("id requerido");
    if (!patch) throw new Error("payload requerido");
    return jfetch(`/users/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: patch,
    });
  },

  /** DELETE /users/:id */
  async remove(id) {
    if (!id) throw new Error("id requerido");
    return jfetch(`/users/${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  /** PATCH /users/me -> { Likes, Dislikes, Allergies, ... } */
  me: {
    async patch(patch) {
      if (!patch) throw new Error("payload requerido");
      return jfetch("/users/me", { method: "PATCH", body: patch });
    },
  },
};

/* =========================
 *       UTILIDADES
 * ========================= */

/** Healthcheck opcional: GET /__air o /health (según tu backend) */
export const util = {
  async health() {
    // Ajusta a tu endpoint real de salud si lo tienes.
    // return jfetch("/health");
    return jfetch("/__air").catch(() => ({ ok: false }));
  },
};
