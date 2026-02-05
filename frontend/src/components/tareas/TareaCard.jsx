import classNames from "classnames";
import { useState } from "react";
import { createPortal } from "react-dom";

function TareaCard({ tarea, onCompletar, isReceptor }) {
  const [showModal, setShowModal] = useState(false);
  const {
    id,
    expediente,
    fecha_limite,
    descripcion,
    estado,
    created_at,
    updated_at,
    asignado_a_nombre,
    asignado_por_nombre,
  } = tarea;

  const isPendiente = estado === "pendiente";
  const vencida = isPendiente && new Date(fecha_limite) < new Date();

  // Mapeo para usar estilos de FirmaCard
  // Pendiente -> 'pendiente', Completada -> 'firmado', Vencida -> 'rechazado' (para usar colores existentes)
  let estadoVisual = "firmado";
  if (isPendiente) {
    estadoVisual = vencida ? "rechazado" : "pendiente";
  }

  const fechaLimiteTexto = fecha_limite
    ? new Date(fecha_limite).toLocaleDateString("es-AR")
    : "Sin fecha";

  const fechaCreacionTexto = created_at
    ? new Date(created_at).toLocaleDateString("es-AR")
    : "-";

  const fechaCompletadaTexto =
    !isPendiente && updated_at
      ? `${new Date(updated_at).toLocaleDateString("es-AR")} ${new Date(updated_at).toLocaleTimeString("es-AR", { hour12: false })} hs.`
      : null;

  const MAX_LENGTH = 60;
  const isLongDescription = descripcion && descripcion.length > MAX_LENGTH;
  const descripcionMostrar = isLongDescription
    ? descripcion.substring(0, MAX_LENGTH) + "..."
    : descripcion;

  return (
    <>
      <div
        className={classNames(
          "firma-card",
          "firma-card-horizontal",
          estadoVisual,
        )}
        onClick={() => setShowModal(true)}
        style={{
          cursor: "pointer",
          display: "flex !important",
          flexDirection: "column !important",
          padding: "1rem 1.5rem",
          borderRadius: "10px",
          marginBottom: "0.5rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="firma-card-main"
          role="button"
          tabIndex={0}
          style={{ outline: "none" }}
        >
          <div
            className="firma-card-row"
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "24px",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {/* Columna 1: Expediente */}
            <div className="firma-card-col expediente">
              <b>Expediente:</b> <b>{expediente}</b>
            </div>

            {/* Columna 2: Personas (Siempre mostramos ambas) */}
            <div className="firma-card-col firmante">
              <div>
                <b>De:</b> {asignado_por_nombre || "Desconocido"}
              </div>
              <div>
                <b>Para:</b> {asignado_a_nombre || "Desconocido"}
              </div>
            </div>

            {/* Columna 3: Fechas */}
            <div className="firma-card-col solicitante">
              <div>
                <b>Creada:</b> {fechaCreacionTexto}
              </div>
              <div>
                <b>Vence:</b>{" "}
                <span
                  style={{
                    color: vencida ? "#ef4444" : "inherit",
                    fontWeight: vencida ? "bold" : "normal",
                  }}
                >
                  {fechaLimiteTexto}
                </span>
              </div>
            </div>

            {/* Columna 4: Contenido */}
            <div className="firma-card-col documentos">
              <b>Tarea:</b>
              <div style={{ fontStyle: "italic", whiteSpace: "normal" }}>
                {descripcionMostrar}
                {isLongDescription && (
                  <span style={{ color: "#60a5fa", fontWeight: 600 }}>
                    {" "}
                    (Click para ver más)
                  </span>
                )}
              </div>
            </div>

            {/* Columna 5: Estado */}
            <div className="firma-card-col estado">
              <span className={classNames("estado", estadoVisual)}>
                {vencida ? "Vencida" : isPendiente ? "Pendiente" : "Completada"}
              </span>
            </div>
          </div>
          {fechaCompletadaTexto && (
            <div className="comentario">
              <b>Completada el:</b> {fechaCompletadaTexto}
            </div>
          )}
        </div>

        {/* Acciones explícitas al pie de la tarjeta, centradas */}
        {isReceptor && isPendiente && onCompletar && (
          <div
            className="acciones"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "0.75rem",
              width: "100%",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompletar(id);
              }}
              className="btn-firmar"
              style={{
                background: "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "7px 0",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                width: "140px",
                textAlign: "center",
              }}
            >
              Marcar como Completada
            </button>
          </div>
        )}
      </div>

      {showModal &&
        createPortal(
          <div
            className="modal-firma-overlay"
            onClick={() => setShowModal(false)}
          >
            <div
              className={`modal-firma modal-firma-centered modal-firma-${estadoVisual}`}
              style={{ color: "#fff" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  Expediente
                </div>
                <div
                  style={{
                    fontSize: "1.7rem",
                    fontWeight: 800,
                    marginBottom: 10,
                  }}
                >
                  {expediente}
                </div>
              </div>
              <div
                style={{
                  marginBottom: 18,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div className={`modal-estado-box ${estadoVisual}`}>
                  {vencida
                    ? "Vencida"
                    : isPendiente
                      ? "Pendiente"
                      : "Completada"}
                </div>
              </div>

              <div style={{ marginBottom: 8, textAlign: "center" }}>
                <span style={{ fontWeight: 600 }}>De: </span>
                <span>{asignado_por_nombre || "Desconocido"}</span>
              </div>
              <div style={{ marginBottom: 8, textAlign: "center" }}>
                <span style={{ fontWeight: 600 }}>Para: </span>
                <span>{asignado_a_nombre || "Desconocido"}</span>
              </div>
              <div style={{ marginBottom: 8, textAlign: "center" }}>
                <span style={{ fontWeight: 600 }}>Creada: </span>
                <span>{fechaCreacionTexto}</span>
              </div>
              <div style={{ marginBottom: 8, textAlign: "center" }}>
                <span style={{ fontWeight: 600 }}>Vence: </span>
                <span
                  style={{
                    color: vencida ? "#ef4444" : "inherit",
                    fontWeight: vencida ? "bold" : "normal",
                  }}
                >
                  {fechaLimiteTexto}
                </span>
              </div>

              {fechaCompletadaTexto && (
                <div
                  className="comentario"
                  style={{ margin: "0 auto 8px auto", textAlign: "left" }}
                >
                  <b>Completada el:</b> {fechaCompletadaTexto}
                </div>
              )}

              <div
                className="comentario"
                style={{ margin: "1rem auto 8px auto", textAlign: "left" }}
              >
                <b>Tarea:</b> <br />
                {descripcion}
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  className="btn-navbar"
                  style={{ marginTop: 20 }}
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default TareaCard;
