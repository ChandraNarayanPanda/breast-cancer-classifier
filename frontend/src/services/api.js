const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Cannot reach the server. Please check that the backend is running.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Response had no JSON body
  }

  if (!response.ok) {
    const error = new Error("Request failed");
    error.status = response.status;
    error.details = data?.detail ?? null;
    throw error;
  }
  return data;
}

export const getHealth = () => request("/health");
export const getModelInfo = () => request("/model-info");
export const predict = (features) =>
  request("/predict", { method: "POST", body: JSON.stringify(features) });