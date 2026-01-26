import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import NuevaSolicitudForm from "../components/NuevaSolicitudForm";
import FirmaCard from "../components/FirmaCard";
import { useAuth } from "../context/useAuth";

function DashboardSolicitante() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();

  const fetchSolicitudes = useCallback(() => {
    setLoading(true);
    axiosInstance
      .get("/firma_solicitudes")
      .then((res) => {
        // Solo mostrar las que creó el usuario actual
        const data = res.data.filter((s) => s.solicitante_id === user?.id);
        setSolicitudes(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const handleNueva = () => {
    fetchSolicitudes();
    setToast({ type: "success", msg: "Solicitud creada correctamente" });
    setTimeout(() => setToast(null), 2000);
  };

  const pendientes = solicitudes.filter(
    (s) => (s.estado_firma || s.estado) === "pendiente",
  );
  const realizadas = solicitudes.filter(
    (s) => (s.estado_firma || s.estado) !== "pendiente",
  );

  return (
    <div className="dashboard-solicitante">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      <div className="solicitante-form-section">
        <NuevaSolicitudForm onNueva={handleNueva} />
      </div>
      <div className="solicitante-list-section">
        <h2>Solicitudes pendientes</h2>
        {loading ? (
          <div>Cargando...</div>
        ) : pendientes.length === 0 ? (
          <div className="empty-list">No hay solicitudes pendientes.</div>
        ) : (
          <div
            className="solicitudes-list pendientes"
            style={{
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            {pendientes.map((s) => (
              <FirmaCard key={s.id} solicitud={s} />
            ))}
          </div>
        )}
        <h2>Solicitudes realizadas</h2>
        {loading ? null : realizadas.length === 0 ? (
          <div className="empty-list">No hay solicitudes realizadas.</div>
        ) : (
          <div
            className="solicitudes-list realizadas"
            style={{
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            {realizadas.map((s) => (
              <FirmaCard key={s.id} solicitud={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default DashboardSolicitante;
