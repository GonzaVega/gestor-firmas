import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import NuevaSolicitudForm from "../components/NuevaSolicitudForm";
import FirmaCard from "../components/FirmaCard";
import { useAuth } from "../context/useAuth";
import ExpedienteSearch from "../components/ExpedienteSearch";
import { filterByExpediente } from "../utils/filterExpedientes";

function DashboardSolicitante() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [busquedaPendientes, setBusquedaPendientes] = useState("");
  const [busquedaRealizadas, setBusquedaRealizadas] = useState("");
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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchSolicitudes();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchSolicitudes]);

  const handleNueva = (nueva) => {
    if (nueva) {
      setSolicitudes((prev) => [nueva, ...prev]);
    }
    setToast({ type: "success", msg: "Solicitud creada correctamente" });
    setTimeout(() => setToast(null), 2000);
  };

  const pendientes = solicitudes.filter(
    (s) => (s.estado_firma || s.estado) === "pendiente",
  );
  const realizadas = solicitudes.filter(
    (s) => (s.estado_firma || s.estado) !== "pendiente",
  );

  const pendientesFiltradas = filterByExpediente(
    pendientes,
    busquedaPendientes,
  );
  const realizadasFiltradas = filterByExpediente(
    realizadas,
    busquedaRealizadas,
  );

  return (
    <div className="dashboard-solicitante">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      <div className="solicitante-form-section">
        <NuevaSolicitudForm onNueva={handleNueva} />
      </div>
      <div className="solicitante-list-section">
        <h2>Solicitudes pendientes</h2>
        <ExpedienteSearch
          value={busquedaPendientes}
          onChange={setBusquedaPendientes}
          placeholder="Buscar por expediente..."
          hidden={pendientes.length === 0}
        />
        {loading ? (
          <div>Cargando...</div>
        ) : pendientesFiltradas.length === 0 ? (
          <div className="empty-list">No hay solicitudes pendientes.</div>
        ) : (
          <div
            className="solicitudes-list pendientes"
            style={{
              borderRadius: "8px",
              padding: "1rem 0",
            }}
          >
            {pendientesFiltradas.map((s) => (
              <FirmaCard key={s.id} solicitud={s} />
            ))}
          </div>
        )}
        <h2>Solicitudes realizadas</h2>
        <ExpedienteSearch
          value={busquedaRealizadas}
          onChange={setBusquedaRealizadas}
          placeholder="Buscar por expediente..."
          hidden={realizadas.length === 0}
        />
        {loading ? null : realizadasFiltradas.length === 0 ? (
          <div className="empty-list">No hay solicitudes realizadas.</div>
        ) : (
          <div
            className="solicitudes-list realizadas"
            style={{
              borderRadius: "8px",
              padding: "1rem 0",
            }}
          >
            {realizadasFiltradas.map((s) => (
              <FirmaCard key={s.id} solicitud={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default DashboardSolicitante;
