// src/services/api.js
const API_BASE = "http://localhost/wine-shop/backend/public";

/**
 * Helper générique pour tous les appels API
 */
async function apiFetch(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { ...(options.headers || {}) };

  // ⚠️ N’ajoute Content-Type QUE si on envoie un body (évite le préflight)
  if (method !== "GET" && method !== "HEAD" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(API_BASE + path, { ...options, headers });

    if (!res.ok) {
      const text = await res.text();
      return { error: `API error ${res.status}: ${text}` };
    }

    // Essaye de parser du JSON
    return await res.json();
  } catch (err) {
    return { error: err.message || "Erreur réseau" };
  }
}

// =============================
// ===  WINES
// =============================
export async function fetchWines() {
  return apiFetch("/wines");
}

export async function fetchWineById(id) {
  try {
    const data = await apiFetch("/wines");
    if (data?.error) throw new Error(data.error);
    const wines = data?.wines || data;
    return wines.find((w) => String(w.id) === String(id)) || null;
  } catch (err) {
    console.error("fetchWineById error:", err);
    return null;
  }
}

export async function createWine(data) {
  return apiFetch("/wines", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateWine(data) {
  return apiFetch("/wines", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteWine(id) {
  return apiFetch("/wines", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

// =============================
// ===  ALCOHOLS
// =============================
export async function fetchAlcohols() {
  return apiFetch("/alcohols");
}

export async function createAlcohol(data) {
  return apiFetch("/alcohols", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAlcohol(data) {
  return apiFetch("/alcohols", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAlcohol(id) {
  return apiFetch("/alcohols", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

// =============================
// ===  PRODUCTS
// =============================
export async function fetchProducts() {
  return apiFetch("/products");
}

export async function createProduct(data) {
  return apiFetch("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(data) {
  return apiFetch("/products", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id) {
  return apiFetch("/products", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

// =============================
// ===  UPLOAD (images, etc.)
// =============================
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Erreur upload");
    return await res.json();
  } catch (err) {
    return { error: err.message || "Erreur réseau upload" };
  }
}
