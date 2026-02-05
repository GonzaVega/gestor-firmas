import { useAuth } from "../../context/useAuth";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate, useLocation } from "react-router-dom";
import { RoleSelector } from "./RoleSelector";

function Header() {
  const { user, logout } = useAuth();
  const { counts } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => (location.pathname === path ? "active" : "");
  const totalPendientes = counts.firmas + counts.tareas + counts.notas;

  return (
    <nav className="navbar-app">
      <div className="navbar-title">Gestor de Firmas</div>
      <div className="navbar-actions">
        <button
          className={`btn-navbar ${isActive("/solicitudes")}`}
          onClick={() => navigate("/solicitudes")}
        >
          Mis Solicitudes
        </button>
        <button
          className={`btn-navbar ${isActive("/pendientes")}`}
          onClick={() => navigate("/pendientes")}
          style={{ position: "relative" }}
        >
          Bandeja de Entrada
          {totalPendientes > 0 && (
            <span className="navbar-badge">{totalPendientes}</span>
          )}
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
