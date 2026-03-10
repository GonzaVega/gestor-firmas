import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import NuevaSolicitudForm from "../components/firmas/NuevaSolicitudForm";
import NuevaTareaForm from "../components/tareas/NuevaTareaForm";
import NuevaNotaForm from "../components/notas/NuevaNotaForm";
import FirmaCard from "../components/firmas/FirmaCard";
import TareaCard from "../components/tareas/TareaCard";
import NotaCard from "../components/notas/NotaCard";
import ModeSelector from "../components/common/ModeSelector";
import { useAuth } from "../context/useAuth";
import ExpedienteSearch from "../components/common/ExpedienteSearch";
import { filterByExpediente } from "../utils/filterExpedientes";
import PaginatedList from "../components/common/PaginatedList";

import { useNotifications } from "../context/NotificationContext";

function MisSolicitudes() {
  const [mode, setMode] = useState("tareas");
  const [solicitudes, setSolicitudes] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [busquedaPendientes, setBusquedaPendientes] = useState("");
  const [busquedaRealizadas, setBusquedaRealizadas] = useState("");
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const { user } = useAuth();
  const { counts, refreshCounts } = useNotifications();

  const fetchFirmas = useCallback(
    (silent = false) => {
      if (!silent) setLoading(true);
      axiosInstance
        .get("/firma_solicitudes")
        .then((res) => {
          const data = res.data.filter((s) => s.solicitante_id === user?.id);
          setSolicitudes(data);
        })
        .catch(() => {})
        .finally(() => {
          if (!silent) setLoading(false);
        });
    },
    [user],
  );

  const fetchTareas = useCallback(
    (silent = false) => {
      if (!silent) setLoading(true);
      axiosInstance
        .get("/tareas")
        .then((res) => {
          const data = res.data.filter(
            (t) => !t.solicitante_id || t.solicitante_id === user?.id,
          );
          setTareas(data);
        })
        .catch(() => {})
        .finally(() => {
          if (!silent) setLoading(false);
        });
    },
    [user],
  );

  const fetchNotas = useCallback(
    (silent = false) => {
      if (!silent) setLoading(true);
      axiosInstance
        .get("/notas")
        .then((res) => {
          const userId = String(user?.id);
          const data = res.data.filter(
            (n) => String(n.remitente_id) === userId,
          );
          setNotas(data);
        })
        .catch(() => {})
        .finally(() => {
          if (!silent) setLoading(false);
        });
    },
    [user],
  );

  useEffect(() => {
    setBusquedaPendientes("");
    setBusquedaRealizadas("");
    if (mode === "firmas") fetchFirmas();
    if (mode === "tareas") fetchTareas();
    if (mode === "notas") fetchNotas();
  }, [mode, fetchFirmas, fetchTareas, fetchNotas]);

  // Auto-refresh silencioso cuando cambian los counts sin interrumpir interacción
  useEffect(() => {
    const checkInteraction = () => {
      const hasModal = document.querySelector(".modal-firma-overlay") !== null;
      const hasActiveInput =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT";
      setIsUserInteracting(hasModal || hasActiveInput);
    };

    checkInteraction();
    const intervalCheck = setInterval(checkInteraction, 500);
    return () => clearInterval(intervalCheck);
  }, []);

  // Actualiza el título de la pestaña con las notificaciones también en esta vista
  useEffect(() => {
    const total =
      (counts?.firmas || 0) +
      (counts?.tareas || 0) +
      (counts?.notasBandeja || 0) +
      (counts?.notasMisSolicitudes || 0);
    document.title = total > 0 ? `Gestiona (${total})` : "Gestiona";
  }, [counts]);

  // Silent refresh cuando aumentan los counts sin interrumpir usuario
  useEffect(() => {
    if (!isUserInteracting) {
      if (mode === "firmas") fetchFirmas(true);
      if (mode === "tareas") fetchTareas(true);
      if (mode === "notas") fetchNotas(true);
    }
  }, [
    counts.firmas,
    counts.tareas,
    counts.notasMisSolicitudes,
    isUserInteracting,
    mode,
    fetchFirmas,
    fetchTareas,
    fetchNotas,
  ]);

  // Refresh adicional de notas cuando cambia el contador, independiente del modo actual
  useEffect(() => {
    if (!isUserInteracting) {
      fetchNotas(true);
    }
  }, [counts.notasMisSolicitudes, isUserInteracting, fetchNotas]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2000);
  };

  const handleLeerNotaRespondida = async (id) => {
    try {
      await axiosInstance.patch(`/notas/${id}`, {
        action_type: "marcar_leida_respuesta_remitente",
      });
      setNotas((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, estado_remitente: "archivada" } : n,
        ),
      );
      showToast("success", "Respuesta marcada como leída");
      refreshCounts();
    } catch (error) {
      showToast("error", "Error al actualizar nota");
    }
  };

  const handleNueva = (nueva) => {
    if (mode === "firmas") {
      setSolicitudes((prev) => [nueva, ...prev]);
      showToast("success", "Solicitud creada correctamente");
      fetchFirmas();
    } else if (mode === "tareas") {
      setTareas((prev) => [nueva, ...prev]);
      showToast("success", "Tarea asignada correctamente");
      fetchTareas();
    } else if (mode === "notas") {
      setNotas((prev) => [nueva, ...prev]);
      showToast("success", "Nota enviada correctamente");
      fetchNotas();
    }
  };

  let pendientes = [];
  let realizadas = [];
  let PendienteComponent = null;
  let RealizadaComponent = null;

  if (mode === "firmas") {
    pendientes = solicitudes.filter(
      (s) => (s.estado_firma || s.estado) === "pendiente",
    );
    realizadas = solicitudes.filter(
      (s) => (s.estado_firma || s.estado) !== "pendiente",
    );
    PendienteComponent = FirmaCard;
    RealizadaComponent = FirmaCard;
  } else if (mode === "tareas") {
    pendientes = tareas.filter((t) => t.estado === "pendiente");
    realizadas = tareas.filter((t) => t.estado !== "pendiente");
    PendienteComponent = TareaCard;
    RealizadaComponent = TareaCard;
  } else if (mode === "notas") {
    const estaArchivadaParaRemitente = (n) => {
      const leidaSinRespuesta =
        !n.respuesta &&
        (n.estado_destinatario === "leida" ||
          n.estado_destinatario === "archivada");
      return n.estado_remitente === "archivada" || leidaSinRespuesta;
    };
    pendientes = notas.filter((n) => !estaArchivadaParaRemitente(n));
    realizadas = notas.filter((n) => estaArchivadaParaRemitente(n));
    PendienteComponent = NotaCard;
    RealizadaComponent = NotaCard;
  }

  const pendientesFiltradas = filterByExpediente(
    pendientes,
    busquedaPendientes,
  );
  const realizadasFiltradas = filterByExpediente(
    realizadas,
    busquedaRealizadas,
  );

  const getCardProps = (item) => {
    if (mode === "firmas") return { solicitud: item };
    if (mode === "tareas") return { tarea: item, isReceptor: false };
    if (mode === "notas") {
      return {
        nota: item,
        isReceptor: false,
        onMarcarLeida:
          item.estado_remitente === "respuesta_no_leida"
            ? handleLeerNotaRespondida
            : undefined,
      };
    }
    return {};
  };

  const getSectionTitle = (isPendiente) => {
    if (mode === "firmas")
      return isPendiente ? "Solicitudes pendientes" : "Solicitudes realizadas";
    if (mode === "tareas")
      return isPendiente ? "Tareas asignadas (En curso)" : "Tareas completadas";
    if (mode === "notas")
      return isPendiente ? "Notas pendientes" : "Notas archivadas";
  };

  return (
    <div className="dashboard-solicitante">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <ModeSelector
        currentMode={mode}
        onModeChange={setMode}
        badges={{
          firmas: counts.firmas,
          tareas: counts.tareas,
          notas: counts.notasMisSolicitudes,
        }}
      />

      <div className="solicitante-form-section fade-in" key={`${mode}-form`}>
        {mode === "firmas" && <NuevaSolicitudForm onNueva={handleNueva} />}
        {mode === "tareas" && <NuevaTareaForm onNueva={handleNueva} />}
        {mode === "notas" && <NuevaNotaForm onNueva={handleNueva} />}
      </div>

      <div className="solicitante-list-section fade-in" key={`${mode}-list`}>
        <h2>{getSectionTitle(true)}</h2>
        <ExpedienteSearch
          value={busquedaPendientes}
          onChange={setBusquedaPendientes}
          placeholder="Buscar por expediente..."
          hidden={pendientes.length === 0}
        />

        {loading && <div>Cargando...</div>}

        <PaginatedList
          items={pendientesFiltradas}
          loading={loading}
          emptyMessage="No hay items."
          className="solicitudes-list pendientes"
          style={{ borderRadius: "8px", padding: "1rem 0" }}
          renderItem={(item) => {
            const Cmp = PendienteComponent;
            return Cmp ? <Cmp key={item.id} {...getCardProps(item)} /> : null;
          }}
        />

        <h2>{getSectionTitle(false)}</h2>
        <ExpedienteSearch
          value={busquedaRealizadas}
          onChange={setBusquedaRealizadas}
          placeholder="Buscar por expediente..."
          hidden={realizadas.length === 0}
        />

        <PaginatedList
          items={realizadasFiltradas}
          loading={loading}
          emptyMessage="No hay historial."
          className="solicitudes-list realizadas"
          style={{ borderRadius: "8px", padding: "1rem 0" }}
          renderItem={(item) => {
            const Cmp = RealizadaComponent;
            return Cmp ? <Cmp key={item.id} {...getCardProps(item)} /> : null;
          }}
        />
      </div>
    </div>
  );
}

export default MisSolicitudes;
