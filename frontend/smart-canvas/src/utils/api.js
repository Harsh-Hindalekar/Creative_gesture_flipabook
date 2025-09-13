const API_URL = "http://localhost:5000/api";

// ---- Auth ----
export async function registerUser(name, email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return await res.json();
  } catch (err) {
    return { msg: "Error connecting to server" };
  }
}

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (err) {
    return { msg: "Error connecting to server" };
  }
}

export async function fetchProfile() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return { msg: "Error connecting to server" };
  }
}

// ---- AI Endpoints ----
export async function recognizeShape(points) {
  try {
    const res = await fetch("http://localhost:5000/api/recognize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points }),
    });
    return await res.json();
  } catch (err) {
    return { msg: "Error connecting to server" };
  }
}

export async function smoothStroke(points) {
  try {
    const res = await fetch("http://localhost:5000/api/smooth_stroke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points }),
    });
    return await res.json();
  } catch (err) {
    return { msg: "Error connecting to server" };
  }
}
