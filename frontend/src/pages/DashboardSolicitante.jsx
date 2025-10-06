import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import NuevaSolicitudForm from '../components/NuevaSolicitudForm';
import FirmaCard from '../components/FirmaCard';
import Header from '../components/Header';

function DashboardSolicitante() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/firma_solicitudes').then(res => {
      setSolicitudes(res.data.filter(s => s.solicitante_id));
      setLoading(false);
    });
  }, []);

  const handleNueva = (nueva) => {
    setSolicitudes(solicitudes => [nueva, ...solicitudes]);
  };

  return (
    <div>
      <Header />
      <NuevaSolicitudForm onNueva={handleNueva} />
      <h2>Solicitudes enviadas</h2>
      {loading ? <div>Cargando...</div> : solicitudes.length === 0 ? <div>No hay solicitudes enviadas.</div> : solicitudes.map(s => (
        <FirmaCard key={s.id} solicitud={s} />
      ))}
    </div>
  );
}
export default DashboardSolicitante;
