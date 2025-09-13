import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getProfile } from "../utils/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // redirect to login if no token
        return;
      }
      const res = await getProfile(token);
      if (res.id) {
        setUser(res);
      } else {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
    fetchUser();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      {user ? (
        <>
          <p>Welcome, <strong>{user.name || "User"}</strong>!</p>
          <p>Email: {user.email}</p>

          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li><Link to="/canvas">🖌️ Smart Canvas</Link></li>
              <li><button onClick={() => alert("🤖 AI Drawing feature coming soon!")}>AI Drawing</button></li>
              <li><button onClick={() => alert("📖 Flipbook feature coming soon!")}>Flipbook</button></li>
              <li><Link to="/profile">👤 Profile</Link></li>
              <li><button onClick={handleLogout}>🚪 Logout</button></li>
            </ul>
          </nav>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
