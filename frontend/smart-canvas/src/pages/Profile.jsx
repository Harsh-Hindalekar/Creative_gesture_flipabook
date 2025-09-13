import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../utils/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect to login if no token
        return;
      }

      const res = await getProfile(token);
      if (res.id) {
        setUser(res);
      } else {
        localStorage.removeItem("token");
        navigate("/"); // If token invalid → back to login
      }
    }

    fetchProfile();
  }, [navigate]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Profile</h2>
      {user ? (
        <>
          <p><b>Name:</b> {user.name || "N/A"}</p>
          <p><b>Email:</b> {user.email}</p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
