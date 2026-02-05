import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./App.css";
import "./components/common/Badges.css"; // Importar estilos de badges
import Login from "./pages/Login";
import DashboardFirmante from "./pages/DashboardFirmante";
import DashboardSolicitante from "./pages/DashboardSolicitante";
import NotFound from "./pages/NotFound";
import Header from "./components/common/Header";
import PrivateRoute from "./components/common/PrivateRoute";

function AppContent() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/notfound" ||
    location.pathname === "/";

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      {!hideNavbar && <Header />}
      <div className={`main-content ${hideNavbar ? "no-header" : ""}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/pendientes"
            element={
              <PrivateRoute>
                <DashboardFirmante />
              </PrivateRoute>
            }
          />
          <Route
            path="/solicitudes"
            element={
              <PrivateRoute>
                <DashboardSolicitante />
              </PrivateRoute>
            }
          />
          {/* Ruta /solicitar-firma eliminada por duplicidad, solo queda DashboardSolicitante */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
