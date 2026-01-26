import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import FirmaCard from "../components/FirmaCard";
import { useAuth } from "../context/useAuth";

function DashboardFirmante() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();

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
    await axiosInstance.patch(`/firma_solicitudes/${id}`, {
      estado: "firmado",
    });
    setSolicitudes((solicitudes) =>
      solicitudes.map((s) =>
        s.id === id ? { ...s, estado: "firmado", estado_firma: "firmado" } : s,
      ),
    );
    setToast({ type: "success", msg: "Solicitud firmada correctamente" });
    setTimeout(() => setToast(null), 2000);
  };
  const handleRechazar = async (id) => {
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
    setToast({ type: "error", msg: "Solicitud rechazada correctamente" });
    setTimeout(() => setToast(null), 2000);
  };

  if (loading) return <div>Cargando...</div>;

  // Ordenar: pendientes primero (más recientes arriba), luego el resto
  const pendientes = solicitudes
    .filter((s) => (s.estado_firma || s.estado) === "pendiente")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const noPendientes = solicitudes
    .filter((s) => (s.estado_firma || s.estado) !== "pendiente")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const ordenadas = [...pendientes, ...noPendientes];

  const hayPendientes = pendientes.length > 0;

  return (
    <div className="dashboard-firmante">
      <h2 style={{ paddingLeft: "2rem" }}>Solicitudes para firmar</h2>
      {!hayPendientes && (
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
      {noPendientes.length === 0 ? (
        <div className="empty-list" style={{ marginLeft: "2rem" }}>
          No hay sin procesar.
        </div>
      ) : (
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
      )}
    </div>
  );
}
export default DashboardFirmante;
