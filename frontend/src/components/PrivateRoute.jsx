import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  // En desarrollo, siempre hay usuario de prueba
  if (user) {
    return children;
  }
  return <Navigate to="/login" />;
}
