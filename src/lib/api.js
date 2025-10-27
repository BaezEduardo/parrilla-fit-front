// src/lib/api.js
export const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/,'') || "";

function adminHeaders() {
  const k = localStorage.getItem("pf_admin_key") || "";
  return k ? { "x-admin-key": k } : {};
}

async function request(path, { method = "GET", headers = {}, body } = {}) {
  const url = `${API_BASE}${path}`;
  const opts = {
    method,
    headers: { "Content-Type": "application/json", ...headers },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const isJSON = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJSON ? await res.json() : await res.text();
  if (!res.ok) throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  return data;
}

export const api = {
  // público
  listDishes: (params = {}) => {
    const q = new URLSearchParams({
      available: "true",
      ...(params.category ? { category: params.category } : {}),
      ...(params.tag ? { tag: params.tag } : {}),
      ...(params.q ? { q: params.q } : {}),
      sortBy: "Name", sortDir: "asc",
    }).toString();
    return request(`/api/dishes${q ? `?${q}` : ""}`);
  },

  adminListUsers: async ({ role, q, limit } = {}) => {
    const qs = new URLSearchParams({
      ...(role ? { role } : {}),
      ...(q ? { q } : {}),
      ...(limit ? { limit } : {}),
    }).toString();
    const url = `/api/users${qs ? `?${qs}` : ""}`;
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        "x-admin-key": import.meta.env.VITE_ADMIN_KEY || "clave-admin-local",
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Error listando usuarios");
    return data;
  },

  adminDeleteUser: async (id) => {
    const res = await fetch(`${API_BASE}/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-key": import.meta.env.VITE_ADMIN_KEY || "clave-admin-local",
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Error eliminando usuario");
    return data;
  },

  // admin: platillos
  adminListDishes: () => request(`/api/dishes`, { headers: adminHeaders() }), // trae todos
  adminCreateDish: (fields) => request(`/api/dishes`, { method: "POST", headers: adminHeaders(), body: fields }),
  adminUpdateDish: (id, fields) => request(`/api/dishes/${id}`, { method: "PATCH", headers: adminHeaders(), body: fields }),
  adminDeleteDish: (id) => request(`/api/dishes/${id}`, { method: "DELETE", headers: adminHeaders() }),
  adminAttachImageUrl: (id, imageUrl) =>
    request(`/api/dishes/${id}/image`, { method: "POST", headers: adminHeaders(), body: { imageUrl } }),

  // admin: usuarios
  adminListUsers: (q="") => {
    const qs = q ? `?q=${encodeURIComponent(q)}` : "";
    return request(`/api/users${qs}`, { headers: adminHeaders() });
  },
  adminDeleteUser: (id) => request(`/api/users/${id}`, { method: "DELETE", headers: adminHeaders() }),
};