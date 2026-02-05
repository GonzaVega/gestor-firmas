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
  const [counts, setCounts] = useState({ firmas: 0, tareas: 0, notas: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCounts = useCallback(async () => {
    if (!user) return;

    // Si no es firmante, quizás no necesite ver badges en "Bandeja de Entrada".
    // Pero el usuario pidió badges. Asumiremos que cualquier user puede tener cosas pendientes.
    // Aunque el DashboardFirmante filtra por "firmante_id", "asignado_a", "destinatario_id".

    try {
      // Ejecutamos en paralelo
      const [firmasRes, tareasRes, notasRes] = await Promise.allSettled([
        axiosInstance.get("/firma_solicitudes"),
        axiosInstance.get("/tareas"),
        axiosInstance.get("/notas"),
      ]);

      let nuevasFirmas = 0;
      let nuevasTareas = 0;
      let nuevasNotas = 0;

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
        nuevasNotas = notasRes.value.data.filter(
          (n) =>
            String(n.destinatario_id) === String(user.id) &&
            n.estado === "no_leida",
        ).length;
      }

      setCounts({
        firmas: nuevasFirmas,
        tareas: nuevasTareas,
        notas: nuevasNotas,
      });
    } catch (error) {
      console.error("Error fetching notification counts", error);
    }
  }, [user]);

  // Cargar al inicio y cuando cambia el usuario
  useEffect(() => {
    if (user) {
      fetchCounts();
      // Opcional: Polling cada 30s
      const interval = setInterval(fetchCounts, 30000);
      return () => clearInterval(interval);
    } else {
      setCounts({ firmas: 0, tareas: 0, notas: 0 });
    }
  }, [user, fetchCounts]);

  // Función para forzar recarga (ej. tras firmar)
  const refreshCounts = () => {
    fetchCounts();
  };

  return (
    <NotificationContext.Provider value={{ counts, refreshCounts }}>
      {children}
    </NotificationContext.Provider>
  );
}
