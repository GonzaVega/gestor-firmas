import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import FirmaCard from '../components/FirmaCard';
import Header from '../components/Header';

function DashboardFirmante() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/firma_solicitudes').then(res => {
      setSolicitudes(res.data.filter(s => s.firmante_id));
      setLoading(false);
    });
  }, []);

  const handleFirmar = async (id) => {
    await axiosInstance.patch(`/firma_solicitudes/${id}`, { estado: 'firmado' });
    setSolicitudes(solicitudes => solicitudes.map(s => s.id === id ? { ...s, estado: 'firmado' } : s));
  };
  const handleRechazar = async (id) => {
    await axiosInstance.patch(`/firma_solicitudes/${id}`, { estado: 'rechazado' });
    setSolicitudes(solicitudes => solicitudes.map(s => s.id === id ? { ...s, estado: 'rechazado' } : s));
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <Header />
      <h2>Solicitudes para firmar</h2>
      {solicitudes.length === 0 && <div>No hay solicitudes pendientes.</div>}
      {solicitudes.map(s => (
        <FirmaCard key={s.id} solicitud={s} onFirmar={handleFirmar} onRechazar={handleRechazar} esNueva={s.estado === 'pendiente'} />
      ))}
    </div>
  );
}
export default DashboardFirmante;
