import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import FirmaCard from "../components/firmas/FirmaCard";
import TareaCard from "../components/tareas/TareaCard";
import NotaCard from "../components/notas/NotaCard";
import ModeSelector from "../components/common/ModeSelector";
import { useAuth } from "../context/useAuth";
import { useNotifications } from "../context/NotificationContext";
import ExpedienteSearch from "../components/common/ExpedienteSearch";
import { filterByExpediente } from "../utils/filterExpedientes";
import PaginatedList from "../components/common/PaginatedList";

function BandejaEntrada() {
  const [mode, setMode] = useState("tareas");
  const [solicitudes, setSolicitudes] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [busquedaPendientes, setBusquedaPendientes] = useState("");
  const [busquedaProcesadas, setBusquedaProcesadas] = useState("");
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const { user } = useAuth();
  const { refreshCounts, counts } = useNotifications();
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2000);
  };

  const fetchFirmas = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    axiosInstance
      .get("/firma_solicitudes")
      .then((res) => {
        const data = res.data.filter((s) => s.firmante_id === user?.id);
        setSolicitudes(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, [user]);

  const fetchTareas = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    axiosInstance
      .get("/tareas")
      .then((res) => {
        const data = res.data.filter(
          (t) => String(t.asignado_a) === String(user?.id),
        );
        setTareas(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, [user]);

  const fetchNotas = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    axiosInstance
      .get("/notas")
      .then((res) => {
        const userId = String(user?.id);
        const data = res.data.filter(
          (n) => String(n.destinatario_id) === userId,
        );
        setNotas(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    setBusquedaPendientes("");
    setBusquedaProcesadas("");
    if (mode === "firmas") fetchFirmas();
    if (mode === "tareas") fetchTareas();
    if (mode === "notas") fetchNotas();
  }, [mode, fetchFirmas, fetchTareas, fetchNotas]);

  // Auto-refresh silencioso cuando cambian los counts sin interrumpir interacción
  useEffect(() => {
    const checkInteraction = () => {
      const hasModal = document.querySelector('.modal-firma-overlay') !== null;
      const hasActiveInput = document.activeElement?.tagName === 'INPUT' ||
                            document.activeElement?.tagName === 'TEXTAREA' ||
                            document.activeElement?.tagName === 'SELECT';
      setIsUserInteracting(hasModal || hasActiveInput);
    };

    checkInteraction();
    const intervalCheck = setInterval(checkInteraction, 500);
    return () => clearInterval(intervalCheck);
  }, []);

  // Actualiza el título de la pestaña y hace polling (background) de notificaciones
  useEffect(() => {
    const total = (counts?.firmas || 0) + (counts?.tareas || 0) + (counts?.notasBandeja || 0) + (counts?.notasMisSolicitudes || 0);
    document.title = total > 0 ? `Gestiona (${total})` : "Gestiona";

    const intervalId = setInterval(() => {
      refreshCounts();
    }, 90000);

    return () => {
      clearInterval(intervalId);
    };
  }, [counts, refreshCounts]);

  // Silent refresh cuando aumentan los counts sin interrumpir usuario
  useEffect(() => {
    if (!isUserInteracting) {
      if (mode === "firmas") fetchFirmas(true);
      if (mode === "tareas") fetchTareas(true);
      if (mode === "notas") fetchNotas(true);
    }
  }, [counts.firmas, counts.tareas, counts.notasBandeja, isUserInteracting, mode, fetchFirmas, fetchTareas, fetchNotas]);

  const handleFirmar = async (id) => {
    try {
      await axiosInstance.patch(`/firma_solicitudes/${id}`, {
        estado_firma: "firmado",
        estado: "firmado",
        firma_solicitud: { estado_firma: "firmado" },
      });
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, estado: "firmado", estado_firma: "firmado" }
            : s,
        ),
      );
      showToast("success", "Solicitud firmada correctamente");
      refreshCounts();
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
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, estado: "rechazado", estado_firma: "rechazado" }
            : s,
        ),
      );
      showToast("error", "Solicitud rechazada correctamente");
      refreshCounts();
    } catch (error) {
      showToast("error", "No se pudo rechazar la solicitud");
    }
  };

  const handleCompletarTarea = async (id) => {
    try {
      await axiosInstance.patch(`/tareas/${id}`, { estado: "completada" });
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, estado: "completada" } : t)),
      );
      showToast("success", "Tarea marcada como completada");
      refreshCounts();
    } catch (error) {
      showToast("error", "Error al actualizar tarea");
    }
  };

  const handleLeerNota = async (id) => {
    try {
      await axiosInstance.patch(`/notas/${id}`, {
        action_type: "marcar_leida_destinatario",
      });
      setNotas((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                estado_destinatario: "leida",
                estado_remitente: "archivada",
              }
            : n,
        ),
      );
      showToast("success", "Nota marcada como leída");
      refreshCounts();
    } catch (error) {
      showToast("error", "Error al actualizar nota");
    }
  };

  const handleResponderNota = async (id, respuesta) => {
    try {
      await axiosInstance.patch(`/notas/${id}`, {
        action_type: "responder",
        respuesta,
      });
      setNotas((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                respuesta,
                estado_destinatario: "archivada",
                estado_remitente: "respuesta_no_leida",
                respondida_el: new Date().toISOString(),
              }
            : n,
        )
      );
      showToast("success", "Respuesta enviada correctamente");
      refreshCounts();
    } catch (error) {
      showToast("error", "Error al enviar la respuesta");
    }
  };

  if (
    loading &&
    solicitudes.length === 0 &&
    tareas.length === 0 &&
    notas.length === 0
  )
    return <div>Cargando...</div>;

  let pendientesBase = [];
  let noPendientesBase = [];
  let PendienteComponent = null;

  if (mode === "firmas") {
    pendientesBase = solicitudes
      .filter((s) => (s.estado_firma || s.estado) === "pendiente")
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    noPendientesBase = solicitudes
      .filter((s) => (s.estado_firma || s.estado) !== "pendiente")
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    PendienteComponent = FirmaCard;
  } else if (mode === "tareas") {
    pendientesBase = tareas
      .filter((t) => t.estado === "pendiente")
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    noPendientesBase = tareas
      .filter((t) => t.estado !== "pendiente")
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    PendienteComponent = TareaCard;
  } else if (mode === "notas") {
    pendientesBase = notas
      .filter((n) => n.estado_destinatario === "no_leida")
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    noPendientesBase = notas
      .filter((n) => n.estado_destinatario !== "no_leida")
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    PendienteComponent = NotaCard;
  }

  const pendientes = filterByExpediente(pendientesBase, busquedaPendientes);
  const noPendientes = filterByExpediente(noPendientesBase, busquedaProcesadas);

  const getCardProps = (item) => {
    if (mode === "firmas")
      return {
        solicitud: item,
        onFirmar: handleFirmar,
        onRechazar: handleRechazar,
      };
    if (mode === "tareas")
      return {
        tarea: item,
        isReceptor: true,
        onCompletar: handleCompletarTarea,
      };
    if (mode === "notas")
      return { nota: item, isReceptor: true, onMarcarLeida: handleLeerNota, onResponder: handleResponderNota };
    return {};
  };

  const getSectionTitle = (isPendiente) => {
    if (mode === "firmas")
      return isPendiente ? "Solicitudes pendientes" : "Historial";
    if (mode === "tareas")
      return isPendiente ? "Tareas pendientes" : "Tareas completadas";
    if (mode === "notas")
      return isPendiente ? "Notas nuevas" : "Notas archivadas";
  };

  return (
    <div className="dashboard-firmante">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <ModeSelector 
        currentMode={mode} 
        onModeChange={setMode} 
        badges={{
          firmas: counts.firmas,
          tareas: counts.tareas,
          notas: counts.notasBandeja,
        }} 
      />

      <div className="firmante-list-section fade-in" key={mode}>
        <h2>{getSectionTitle(true)}</h2>
        <ExpedienteSearch
          value={busquedaPendientes}
          onChange={setBusquedaPendientes}
          placeholder="Buscar por expediente..."
          hidden={pendientesBase.length === 0}
        />

        <PaginatedList
          items={pendientes}
          emptyMessage="No hay pendientes."
          className="solicitudes-list pendientes"
          renderItem={(item) => (
            <div key={item.id}>
              {mode === "firmas" ? (
                <FirmaCard
                  solicitud={item}
                  onFirmar={handleFirmar}
                  onRechazar={handleRechazar}
                />
              ) : mode === "tareas" ? (
                <TareaCard {...getCardProps(item)} />
              ) : (
                <NotaCard {...getCardProps(item)} />
              )}
            </div>
          )}
        />

        <h2>{getSectionTitle(false)}</h2>
        <ExpedienteSearch
          value={busquedaProcesadas}
          onChange={setBusquedaProcesadas}
          placeholder="Buscar por expediente..."
          hidden={noPendientesBase.length === 0}
        />

        <PaginatedList
          items={noPendientes}
          emptyMessage="No hay historial."
          className="solicitudes-list procesadas"
          renderItem={(item) => (
            <div key={item.id}>
              {mode === "firmas" ? (
                <FirmaCard solicitud={item} />
              ) : mode === "tareas" ? (
                <TareaCard {...getCardProps(item)} />
              ) : (
                <NotaCard {...getCardProps(item)} />
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default BandejaEntrada;
