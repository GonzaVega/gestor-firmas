import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./App.css";
import "./mobile.css";
import "./components/common/Badges.css";
import Login from "./pages/Login";
import BandejaEntrada from "./pages/BandejaEntrada";
import MisSolicitudes from "./pages/MisSolicitudes";
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
            path="/bandejaentrada"
            element={
              <PrivateRoute>
                <BandejaEntrada />
              </PrivateRoute>
            }
          />
          <Route
            path="/solicitudes"
            element={
              <PrivateRoute>
                <MisSolicitudes />
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
