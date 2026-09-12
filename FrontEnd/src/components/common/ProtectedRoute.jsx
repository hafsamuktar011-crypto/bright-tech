
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../../contexts/UseUserContext'; 

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useUserContext(); 

  
  if (!user) {
    return <Navigate to="/login" replace state={{from:location}} />;
  }

  const roles = allowedRoles ?? (adminOnly ? ["admin"] : null);

  if (roles && !roles.includes(user.role)) {
    if (user.role === "student") {
      return <Navigate to={getStudentDashboardPath(user)} replace />;
    }
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children ? children :<Outlet/>;
}
