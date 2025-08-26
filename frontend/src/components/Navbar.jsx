import { Link, useNavigate } from 'react-router-dom';
import { isAuthed, getRole, clearAuth } from '../utils/auth.js';

export default function Navbar() {
  const navigate = useNavigate();
  const authed = isAuthed();
  const role = getRole();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">TrackItRight</Link>
      </div>

      <div className="nav-right">
        <Link to="/">Home</Link>

        {!authed && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}

        {authed && (
          <>
            {role === 'USER' && <Link to="/citizen">Citizen</Link>}
            {role === 'AUTHORITY' && <Link to="/authority">Authority</Link>}
            {role === 'ADMIN' && <Link to="/admin">Admin</Link>}
            <button className="btn-outline" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
