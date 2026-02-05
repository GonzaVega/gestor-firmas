import NuevaSolicitudForm from "../components/NuevaSolicitudForm";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import FirmaCard from "../components/FirmaCard";

export default function SolicitarFirma() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/firma_solicitudes")
      .then((res) => setSolicitudes(res.data));
  }, []);

  const handleNueva = (nueva) => {
    setSolicitudes([nueva, ...solicitudes]);
    setToast({ type: "success", msg: "Solicitud creada correctamente" });
    setTimeout(() => setToast(null), 2000);
  };

  const ordenadas = [...solicitudes].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  return (
    <div className="solicitar-firma-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      <NuevaSolicitudForm onNueva={handleNueva} />
      <h3 style={{ marginTop: 32 }}>Solicitudes realizadas</h3>
      <div className="solicitudes-list">
        {ordenadas.length === 0 && <div>No hay solicitudes aún.</div>}
        {ordenadas.map((s) => (
          <FirmaCard key={s.id} solicitud={s} />
        ))}
      </div>
    </div>
  );
}
