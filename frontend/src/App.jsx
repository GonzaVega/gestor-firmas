import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import Login from "./pages/Login";
import DashboardFirmante from "./pages/DashboardFirmante";
import DashboardSolicitante from "./pages/DashboardSolicitante";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

function AppContent() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/notfound" ||
    location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Header />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/firmante"
            element={
              <PrivateRoute>
                <DashboardFirmante />
              </PrivateRoute>
            }
          />
          <Route
            path="/solicitante"
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
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
