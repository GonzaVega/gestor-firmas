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

function DashboardSolicitante() {
  const [mode, setMode] = useState("firmas");
  const [solicitudes, setSolicitudes] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [busquedaPendientes, setBusquedaPendientes] = useState("");
  const [busquedaRealizadas, setBusquedaRealizadas] = useState("");
  
  const { user } = useAuth();

  const fetchFirmas = useCallback(() => {
    setLoading(true);
    axiosInstance
      .get("/firma_solicitudes")
      .then((res) => {
        const data = res.data.filter((s) => s.solicitante_id === user?.id);
        setSolicitudes(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const fetchTareas = useCallback(() => {
    setLoading(true);
    axiosInstance
      .get("/tareas")
      .then((res) => {
        // En backend real: filter por created_by o similar
        const data = res.data.filter(t => !t.solicitante_id || t.solicitante_id === user?.id); 
        setTareas(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const fetchNotas = useCallback(() => {
    setLoading(true);
    axiosInstance
      .get("/notas")
      .then((res) => {
        // En backend real: filter por remitente_id
        const data = res.data.filter(n => !n.remitente_id || n.remitente_id === user?.id); 
        setNotas(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);


  useEffect(() => {
    setBusquedaPendientes("");
    setBusquedaRealizadas("");
    if (mode === "firmas") fetchFirmas();
    if (mode === "tareas") fetchTareas();
    if (mode === "notas") fetchNotas();
  }, [mode, fetchFirmas, fetchTareas, fetchNotas]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2000);
  };

  const handleNueva = (nueva) => {
    if (mode === "firmas") {
        setSolicitudes((prev) => [nueva, ...prev]);
        showToast("success", "Solicitud creada correctamente");
    } else if (mode === "tareas") {
        setTareas((prev) => [nueva, ...prev]);
        showToast("success", "Tarea asignada correctamente");
    } else if (mode === "notas") {
        setNotas((prev) => [nueva, ...prev]);
        showToast("success", "Nota enviada correctamente");
    }
  };

  let pendientes = [];
  let realizadas = [];
  let PendienteComponent = null;
  let RealizadaComponent = null;

  if (mode === "firmas") {
    pendientes = solicitudes.filter(s => (s.estado_firma || s.estado) === "pendiente");
    realizadas = solicitudes.filter(s => (s.estado_firma || s.estado) !== "pendiente");
    PendienteComponent = FirmaCard;
    RealizadaComponent = FirmaCard;
  } else if (mode === "tareas") {
    pendientes = tareas.filter(t => t.estado === "pendiente");
    realizadas = tareas.filter(t => t.estado !== "pendiente");
    PendienteComponent = TareaCard;
    RealizadaComponent = TareaCard;
  } else if (mode === "notas") {
    // Notas enviadas: pendientes (no leidas) y realizadas (leidas)? O simplemente historial?
    // Asumiremos que "pendiente" es no leida por el destinatario, pero para el remitente quizás solo quiere ver historial.
    // Mostraremos historial cronológico. Pero la UI tiene 2 columnas. 
    // Pondremos en "Izquierda" (Pendientes) las No Leídas (esperando lectura) y Derecha las Leídas.
    pendientes = notas.filter(n => n.estado === "no_leida");
    realizadas = notas.filter(n => n.estado !== "no_leida");
    PendienteComponent = NotaCard;
    RealizadaComponent = NotaCard;
  }

  const pendientesFiltradas = filterByExpediente(pendientes, busquedaPendientes);
  const realizadasFiltradas = filterByExpediente(realizadas, busquedaRealizadas);

  const getCardProps = (item) => {
      if (mode === "firmas") return { solicitud: item };
      if (mode === "tareas") return { tarea: item, isReceptor: false };
      if (mode === "notas") return { nota: item, isReceptor: false };
      return {};
  };

  const getSectionTitle = (isPendiente) => {
      if (mode === "firmas") return isPendiente ? "Solicitudes pendientes" : "Solicitudes realizadas";
      if (mode === "tareas") return isPendiente ? "Tareas asignadas (En curso)" : "Tareas completadas";
      if (mode === "notas") return isPendiente ? "Notas enviadas (No leídas)" : "Notas leídas/Archivadas";
  };

  return (
    <div className="dashboard-solicitante">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      
      <ModeSelector currentMode={mode} onModeChange={setMode} />

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
        
        {!loading && pendientesFiltradas.length === 0 && (
           <div className="empty-list">No hay items.</div>
        )}

        <div className="solicitudes-list pendientes" style={{ borderRadius: "8px", padding: "1rem 0" }}>
            {pendientesFiltradas.map((item) => {
                const Cmp = PendienteComponent;
                return Cmp ? <Cmp key={item.id} {...getCardProps(item)} /> : null;
            })}
        </div>

        <h2>{getSectionTitle(false)}</h2>
        <ExpedienteSearch
          value={busquedaRealizadas}
          onChange={setBusquedaRealizadas}
          placeholder="Buscar por expediente..."
          hidden={realizadas.length === 0}
        />
        
        {!loading && realizadasFiltradas.length === 0 && (
           <div className="empty-list">No hay historial.</div>
        )}

        <div className="solicitudes-list realizadas" style={{ borderRadius: "8px", padding: "1rem 0" }}>
            {realizadasFiltradas.map((item) => {
                const Cmp = RealizadaComponent;
                return Cmp ? <Cmp key={item.id} {...getCardProps(item)} /> : null;
            })}
        </div>
      </div>
    </div>
  );
}

export default DashboardSolicitante;
