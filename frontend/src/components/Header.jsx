import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { RoleSelector } from "./RoleSelector";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <nav className="navbar-app">
      <div className="navbar-title">Gestor de Firmas</div>
      <div className="navbar-actions">
        <button className="btn-navbar" onClick={() => navigate("/solicitante")}>
          Solicitar Firma
        </button>
        <button className="btn-navbar" onClick={() => navigate("/firmante")}>
          Firmar Solicitudes
        </button>
      </div>
      <div className="navbar-user">
        <span className="user-name">{user.nombre}</span>
        <RoleSelector />
        <button className="btn-navbar" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
export default Header;
