import { Navigate } from 'react-router-dom';
import { isAuthed, getRole } from '../utils/auth.js';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;

  const role = getRole();
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    const target =
      role === 'USER' ? '/citizen' :
      role === 'AUTHORITY' ? '/authority' : '/admin';
    return <Navigate to={target} replace />;
  }
  return children;
}
