const API_BASE = "http://localhost:5000/api"; // Flask backend URL

// Helper for requests
async function request(url, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  return res.json();
}

// ---- Auth ----
export async function loginUser(email, password) {
  return request("/auth/login", "POST", { email, password });
}

export async function registerUser(name, email, password) {
  return request("/auth/register", "POST", { name, email, password });
}

export async function getProfile(token) {
  return request("/user/profile", "GET", null, token);
}

// ---- AI Placeholder APIs ----
export async function recognizeShape(points) {
  return request("/recognize", "POST", { points });
}

export async function smoothStroke(points) {
  return request("/smooth_stroke", "POST", { points });
}
