import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <Link to="/canvas">🖊 Freehand Canvas</Link>
        <br />
        <Link to="/profile">👤 Profile</Link>
      </nav>
    </div>
  );
}
