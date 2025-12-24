import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export default function PrivateRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
