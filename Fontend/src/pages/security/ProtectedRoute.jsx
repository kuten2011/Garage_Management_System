import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!token && !refreshToken) return <Navigate to="/login" replace />;

  try {
    if (token) {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now() && !refreshToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return <Navigate to="/login" replace />;
      }
    }
  } catch (err) {
    if (!refreshToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
