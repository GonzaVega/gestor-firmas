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
        estado: "firmado",
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
        estado: "rechazado",
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
      <h2 style={{ paddingLeft: "2rem" }}>Solicitudes para firmar</h2>
      <div style={{ paddingLeft: "2rem", paddingRight: "2rem" }}>
        <ExpedienteSearch
          value={busquedaPendientes}
          onChange={setBusquedaPendientes}
          placeholder="Buscar por expediente..."
          hidden={!hayPendientesBase}
        />
      </div>
      {!hayPendientes && hayPendientesBase && (
        <div className="empty-list" style={{ marginLeft: "2rem" }}>
          No hay solicitudes pendientes para firmar.
        </div>
      )}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      {hayPendientes && (
        <div
          className="firmante-list"
          style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
        >
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

      <h2 style={{ paddingLeft: "2rem", marginTop: "2rem" }}>
        Solicitudes firmadas / rechazadas
      </h2>
      <div style={{ paddingLeft: "2rem", paddingRight: "2rem" }}>
        <ExpedienteSearch
          value={busquedaProcesadas}
          onChange={setBusquedaProcesadas}
          placeholder="Buscar por expediente..."
          hidden={!hayNoPendientesBase}
        />
      </div>
      {noPendientes.length === 0 && hayNoPendientesBase ? (
        <div className="empty-list" style={{ marginLeft: "2rem" }}>
          No hay sin procesar.
        </div>
      ) : noPendientes.length > 0 ? (
        <div
          className="firmante-list"
          style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
        >
          {noPendientes.map((s) => (
            <FirmaCard
              key={s.id}
              solicitud={s}
              onFirmar={handleFirmar}
              onRechazar={handleRechazar}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
export default DashboardFirmante;
