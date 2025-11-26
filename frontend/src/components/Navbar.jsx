import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar" id="main-navbar">

      <div className="navbar-content">

        {/* LOGO / TÍTULO */}
        <Link to="/" className="navbar-logo">
          🎯 CampusUC
        </Link>

        {/* MENÚ */}
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/history">Historial</Link>

          {/* Solo admins */}
          {user?.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}

          <button className="logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

      </div>
    </nav>
  );
}
