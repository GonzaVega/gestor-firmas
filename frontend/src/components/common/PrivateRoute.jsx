import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function PrivateRoute({ children }) {
  const { user, initialized } = useAuth();
  if (!initialized) {
    return null;
  }
  if (user) {
    return children;
  }
  return <Navigate to="/login" />;
}
