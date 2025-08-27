import { NavLink, Link, useNavigate } from "react-router-dom";
import { isAuthed, getRole, clearAuth } from "../utils/auth.js";
import { FaGithub } from "react-icons/fa";

import "../styles/navbar.css"
export default function Navbar() {
  const navigate = useNavigate();
  const authed = isAuthed();
  const role = getRole();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Left: Logo / Brand */}
      <div className="nav-left">
        <Link to="/" className="brand">
          <span className="brand-badge">🚀</span> tir.
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="nav-center">
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/about" className="nav-link">Why I Built This</NavLink>
        <NavLink to="/contact" className="nav-link">Contact</NavLink>
      </div>

      {/* Right: Auth + GitHub */}
      <div className="nav-right">
        <a
          href="https://github.com/yourusername/TrackItRight"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
          title="View on GitHub"
        >
          <FaGithub size={22} />
        </a>

        {!authed && (
          <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}

        {authed && (
          <>
            {role === "USER" && <NavLink to="/citizen" className="nav-link">Citizen</NavLink>}
            {role === "AUTHORITY" && <NavLink to="/authority" className="nav-link">Authority</NavLink>}
            {role === "ADMIN" && <NavLink to="/admin" className="nav-link">Admin</NavLink>}
            <button className="btn-outline" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>

    </nav>
  );
}
