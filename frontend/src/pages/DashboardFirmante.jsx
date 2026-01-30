import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import FirmaCard from "../components/FirmaCard";
import { useAuth } from "../context/useAuth";
import ExpedienteSearch from "../components/ExpedienteSearch";
import { filterByExpediente } from "../utils/filterExpedientes";

function DashboardFirmante() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [busquedaPendientes, setBusquedaPendientes] = useState("");
  const [busquedaProcesadas, setBusquedaProcesadas] = useState("");
  const { user } = useAuth();

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    axiosInstance
      .get("/firma_solicitudes")
      .then((res) => {
        // Solo mostrar las que debe firmar el usuario actual
        const data = res.data.filter((s) => s.firmante_id === user?.id);
        setSolicitudes(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [user]);

  const handleFirmar = async (id) => {
    try {
      await axiosInstance.patch(`/firma_solicitudes/${id}`, {
        estado_firma: "firmado",
        estado: "firmado",
        firma_solicitud: { estado_firma: "firmado" },
      });
      setSolicitudes((solicitudes) =>
        solicitudes.map((s) =>
          s.id === id
            ? { ...s, estado: "firmado", estado_firma: "firmado" }
            : s,
        ),
      );
      showToast("success", "Solicitud firmada correctamente");
    } catch (error) {
      showToast("error", "No se pudo firmar la solicitud");
    }
  };
  const handleRechazar = async (id) => {
    try {
      await axiosInstance.patch(`/firma_solicitudes/${id}`, {
        estado_firma: "rechazado",
        estado: "rechazado",
        firma_solicitud: { estado_firma: "rechazado" },
      });
      setSolicitudes((solicitudes) =>
        solicitudes.map((s) =>
          s.id === id
            ? { ...s, estado: "rechazado", estado_firma: "rechazado" }
            : s,
        ),
      );
      showToast("error", "Solicitud rechazada correctamente");
    } catch (error) {
      showToast("error", "No se pudo rechazar la solicitud");
    }
  };

  if (loading) return <div>Cargando...</div>;

  // Ordenar: pendientes primero (más recientes arriba), luego el resto
  const pendientesBase = solicitudes
    .filter((s) => (s.estado_firma || s.estado) === "pendiente")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const noPendientesBase = solicitudes
    .filter((s) => (s.estado_firma || s.estado) !== "pendiente")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const pendientes = filterByExpediente(pendientesBase, busquedaPendientes);
  const noPendientes = filterByExpediente(noPendientesBase, busquedaProcesadas);
  const hayPendientes = pendientes.length > 0;
  const hayPendientesBase = pendientesBase.length > 0;
  const hayNoPendientesBase = noPendientesBase.length > 0;

  return (
    <div className="dashboard-firmante">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      <div className="firmante-list-section">
        <h2>Solicitudes pendientes</h2>
        <ExpedienteSearch
          value={busquedaPendientes}
          onChange={setBusquedaPendientes}
          placeholder="Buscar por expediente..."
          hidden={!hayPendientesBase}
        />
        {pendientes.length === 0 ? (
          <div className="empty-list">No hay solicitudes pendientes.</div>
        ) : (
          <div className="firmante-list">
            {pendientes.map((s) => (
              <FirmaCard
                key={s.id}
                solicitud={s}
                onFirmar={handleFirmar}
                onRechazar={handleRechazar}
              />
            ))}
          </div>
        )}

        <h2>Solicitudes realizadas</h2>
        <ExpedienteSearch
          value={busquedaProcesadas}
          onChange={setBusquedaProcesadas}
          placeholder="Buscar por expediente..."
          hidden={!hayNoPendientesBase}
        />
        {noPendientes.length === 0 ? (
          <div className="empty-list">No hay solicitudes realizadas.</div>
        ) : (
          <div className="firmante-list">
            {noPendientes.map((s) => (
              <FirmaCard
                key={s.id}
                solicitud={s}
                onFirmar={handleFirmar}
                onRechazar={handleRechazar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default DashboardFirmante;
