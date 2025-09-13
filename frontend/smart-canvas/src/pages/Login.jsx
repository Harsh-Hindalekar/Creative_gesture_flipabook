import { useState, useEffect } from "react";
import { loginUser } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🚀 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await loginUser(email, password);
    if (res.access_token) {
      localStorage.setItem("token", res.access_token);
      navigate("/dashboard");
    } else {
      alert(res.msg || "Login failed");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
