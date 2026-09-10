
import { Navigate,useLocation,Outlet } from 'react-router-dom';
import { useUserContext } from '../../contexts/UserContext.jsx'; 

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user ,loading } = useUserContext();
  const location=useLocation 

  if(loading){
    return <div>Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" replace state={{from:location}} />;
  }

  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />; 
  }

  return children ? children :<Outlet/>;
}