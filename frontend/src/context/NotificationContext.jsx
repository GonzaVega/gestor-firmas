import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./useAuth";

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    firmas: 0,
    tareas: 0,
    notasBandeja: 0,
    notasMisSolicitudes: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchCounts = useCallback(async () => {
    if (!user) return;

    try {
      const [firmasRes, tareasRes, notasRes] = await Promise.allSettled([
        axiosInstance.get("/firma_solicitudes"),
        axiosInstance.get("/tareas"),
        axiosInstance.get("/notas"),
      ]);

      let nuevasFirmas = 0;
      let nuevasTareas = 0;
      let notasBandeja = 0;
      let notasMisSolicitudes = 0;

      if (firmasRes.status === "fulfilled") {
        nuevasFirmas = firmasRes.value.data.filter(
          (s) =>
            s.firmante_id === user.id &&
            (s.estado_firma || s.estado) === "pendiente",
        ).length;
      }

      if (tareasRes.status === "fulfilled") {
        nuevasTareas = tareasRes.value.data.filter(
          (t) =>
            String(t.asignado_a) === String(user.id) &&
            t.estado === "pendiente",
        ).length;
      }

      if (notasRes.status === "fulfilled") {
        const notasData = notasRes.value.data;
        notasBandeja = notasData.filter(
          (n) =>
            String(n.destinatario_id) === String(user.id) &&
            n.estado_destinatario === "no_leida",
        ).length;

        notasMisSolicitudes = notasData.filter((n) => {
          const esRemitente = String(n.remitente_id) === String(user.id);
          const leidaSinRespuesta =
            !n.respuesta &&
            (n.estado_destinatario === "leida" ||
              n.estado_destinatario === "archivada");
          return (
            esRemitente &&
            !leidaSinRespuesta &&
            n.estado_remitente === "respuesta_no_leida"
          );
        }).length;
      }

      setCounts({
        firmas: nuevasFirmas,
        tareas: nuevasTareas,
        notasBandeja,
        notasMisSolicitudes,
      });
    } catch (error) {
      console.error("Error fetching notification counts", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchCounts();
      const interval = setInterval(fetchCounts, 30000);
      return () => clearInterval(interval);
    } else {
      setCounts({
        firmas: 0,
        tareas: 0,
        notasBandeja: 0,
        notasMisSolicitudes: 0,
      });
    }
  }, [user, fetchCounts]);

  const refreshCounts = () => {
    fetchCounts();
  };

  return (
    <NotificationContext.Provider value={{ counts, refreshCounts }}>
      {children}
    </NotificationContext.Provider>
  );
}
