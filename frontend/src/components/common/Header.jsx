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
  const totalBandeja = (counts.firmas || 0) + (counts.tareas || 0) + (counts.notasBandeja || 0);
  const totalMisSolicitudes = counts.notasMisSolicitudes || 0;

  return (
    <nav className="navbar-app">
      <div className="navbar-title">Gestiona</div>
      <div className="navbar-actions">
        <button
          className={`btn-navbar ${isActive("/solicitudes")}`}
          onClick={() => navigate("/solicitudes")}
          style={{ position: "relative" }}
        >
          Mis Solicitudes
          {totalMisSolicitudes > 0 && (
            <span className="navbar-badge">{totalMisSolicitudes}</span>
          )}
        </button>
        <button
          className={`btn-navbar ${isActive("/bandejaentrada")}`}
          onClick={() => navigate("/bandejaentrada")}
          style={{ position: "relative" }}
        >
          Bandeja de Entrada
          {totalBandeja > 0 && (
            <span className="navbar-badge">{totalBandeja}</span>
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
