import classNames from "classnames";
import { useState } from "react";
import { createPortal } from "react-dom";

function NotaCard({ nota, onMarcarLeida, isReceptor }) {
  const [showModal, setShowModal] = useState(false);
  const {
    id,
    expediente,
    contenido,
    estado,
    created_at,
    updated_at,
    remitente_nombre,
    destinatario_nombre,
  } = nota;

  const isNoLeida = estado === "no_leida";

  const estadoVisual = isNoLeida ? "pendiente" : "firmado";

  const fechaCreacionTexto = created_at
    ? new Date(created_at).toLocaleDateString("es-AR")
    : "-";

  const fechaLeidaTexto =
    !isNoLeida && updated_at
      ? `${new Date(updated_at).toLocaleDateString("es-AR")} ${new Date(updated_at).toLocaleTimeString("es-AR", { hour12: false })} hs.`
      : null;

  const MAX_LENGTH = 60;
  const isLongContenido = contenido && contenido.length > MAX_LENGTH;
  const contenidoMostrar = isLongContenido
    ? contenido.substring(0, MAX_LENGTH) + "..."
    : contenido;

  return (
    <>
      <div
        className={classNames(
          "firma-card",
          "firma-card-horizontal",
          estadoVisual,
        )}
        onClick={() => setShowModal(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowModal(true);
          }
        }}
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
        <div className="firma-card-main" style={{ outline: "none" }}>
          <div className="firma-card-row">
            {/* Columna 1: Expediente */}
            <div className="firma-card-col expediente">
              <b>Expediente:</b> <b>{expediente}</b>
            </div>

            {/* Columna 2: Personas (De / Para) */}
            <div className="firma-card-col firmante">
              <div>
                <b>De:</b> {remitente_nombre || "Desconocido"}
              </div>
              <div>
                <b>Para:</b> {destinatario_nombre || "Desconocido"}
              </div>
            </div>

            {/* Columna 3: Fechas (Creada) */}
            <div className="firma-card-col solicitante">
              <div>
                <b>Creada:</b>
              </div>
              <div>{fechaCreacionTexto}</div>
            </div>

            {/* Columna 4: Contenido */}
            <div className="firma-card-col documentos">
              <b>Nota:</b>
              <div style={{ fontStyle: "italic", whiteSpace: "normal" }}>
                "{contenidoMostrar}"
                {isLongContenido && (
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
                {isNoLeida ? "Nueva" : "Leída"}
              </span>
            </div>
          </div>
          {fechaLeidaTexto && (
            <div className="comentario">
              <b>Leída el:</b> {fechaLeidaTexto}
            </div>
          )}
        </div>

        {/* Acciones explícitas al pie de la tarjeta, centradas */}
        {isReceptor && isNoLeida && onMarcarLeida && (
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
                onMarcarLeida(id);
              }}
              className="btn-firmar"
              style={{
                background: "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "7px 16px",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                width: "auto",
                minWidth: "140px",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              Marcar como Leída
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
                  {isNoLeida ? "Nueva" : "Leída"}
                </div>
              </div>

              <div style={{ marginBottom: 8, textAlign: "center" }}>
                <span style={{ fontWeight: 600 }}>De: </span>
                <span>{remitente_nombre || "Desconocido"}</span>
              </div>
              <div style={{ marginBottom: 8, textAlign: "center" }}>
                <span style={{ fontWeight: 600 }}>Para: </span>
                <span>{destinatario_nombre || "Desconocido"}</span>
              </div>
              <div style={{ marginBottom: 8, textAlign: "center" }}>
                <span style={{ fontWeight: 600 }}>Creada: </span>
                <span>{fechaCreacionTexto}</span>
              </div>
              {fechaLeidaTexto && (
                <div
                  className="comentario"
                  style={{ margin: "0 auto 8px auto", textAlign: "left" }}
                >
                  <b>Leída el:</b> {fechaLeidaTexto}
                </div>
              )}

              <div
                className="comentario"
                style={{ margin: "1rem auto 8px auto", textAlign: "left" }}
              >
                <b>Nota:</b> <br />"{contenido}"
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

export default NotaCard;
