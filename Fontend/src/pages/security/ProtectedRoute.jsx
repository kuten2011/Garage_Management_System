import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getStoredAuth, isAuthenticated } from "../../utils/authStorage";

export default function ProtectedRoute({ children }) {
  const { token, refreshToken } = getStoredAuth();

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded?.exp && decoded.exp * 1000 < Date.now() && !refreshToken) {
        return <Navigate to="/login" replace />;
      }
    } catch {
      if (!refreshToken) {
        return <Navigate to="/login" replace />;
      }
    }
  }

  return children;
}
