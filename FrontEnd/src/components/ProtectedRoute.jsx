
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../contexts/usercontext'; 

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useUserContext(); 

  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />; 
  }

  return children;
}