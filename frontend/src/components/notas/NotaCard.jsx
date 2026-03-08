import classNames from "classnames";
import { useState } from "react";
import { createPortal } from "react-dom";

function NotaCard({ nota, onMarcarLeida, onResponder, isReceptor }) {
  const [showModal, setShowModal] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [respuestaText, setRespuestaText] = useState("");
  const {
    id,
    expediente,
    contenido,
    estado,
    estado_destinatario,
    estado_remitente,
    created_at,
    updated_at,
    remitente_nombre,
    destinatario_nombre,
    respuesta,
    respondida_el,
  } = nota;

  const estadoDestinatarioActual = estado_destinatario || estado;
  const estadoRemitenteActual = estado_remitente || estado;
  const hasRespuesta = !!respuesta;
  const isNoLeida = isReceptor
    ? estadoDestinatarioActual === "no_leida"
    : estadoRemitenteActual === "respuesta_no_leida";
  
  // Para remitente: si no hay respuesta y destinatario ya leyó → mostrar como completado
  const notaLeidaSinRespuesta = 
    !isReceptor && 
    !hasRespuesta && 
    (estadoDestinatarioActual === "leida" || estadoDestinatarioActual === "archivada");
  
  const isPendienteRemitente =
    estadoRemitenteActual === "respuesta_no_leida" ||
    (estadoRemitenteActual === "pendiente" && !notaLeidaSinRespuesta);

  const estadoVisual = isReceptor
    ? estadoDestinatarioActual === "no_leida"
      ? "pendiente"
      : "firmado"
    : isPendienteRemitente
      ? "pendiente"
      : "firmado";

  const estadoTexto = isReceptor
    ? isNoLeida
      ? "Nueva"
      : "Leída"
    : hasRespuesta
      ? isNoLeida
        ? "Nueva respuesta"
        : "Respuesta leída"
      : estadoRemitenteActual === "archivada"
        ? "Leída / Sin respuesta"
        : "En espera";

  const fechaCreacionTexto = created_at
    ? new Date(created_at).toLocaleDateString("es-AR")
    : "-";

  const mostrarFechaLeida = isReceptor
    ? estadoDestinatarioActual !== "no_leida"
    : estadoRemitenteActual === "archivada";

  const fechaLeidaTexto =
    mostrarFechaLeida && updated_at
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
            <div className="firma-card-col documentos" style={{ minWidth: 0, overflow: "hidden" }}>
              <b>Nota:</b>
              <div 
                style={{ 
                  fontStyle: "italic", 
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  wordWrap: "break-word"
                }}
              >
                "{contenidoMostrar}"
                {isLongContenido && (
                  <span style={{ color: "#60a5fa", fontWeight: 600, display: "inline-block", marginTop: "4px", fontSize: "0.85rem" }}>
                    {" "}Ver más...
                  </span>
                )}
              </div>
            </div>

            {/* Columna 5: Estado */}
            <div className="firma-card-col estado">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                <span className={classNames("estado", estadoVisual)}>
                  {estadoTexto}
                </span>
                {hasRespuesta && (
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "#3b82f6",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: "#eff6ff",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    <span>↩</span> Respondida
                  </span>
                )}
                {notaLeidaSinRespuesta && (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#9ca3af",
                      fontWeight: "500",
                      fontStyle: "italic",
                    }}
                  >
                    Sin respuesta
                  </span>
                )}
              </div>
            </div>
          </div>
          {fechaLeidaTexto && (
            <div className="comentario">
              <b>Leída el:</b> {fechaLeidaTexto}
            </div>
          )}
        </div>

        {/* Acciones explícitas al pie de la tarjeta, centradas */}
        {(isReceptor || (!isReceptor && hasRespuesta && isNoLeida && onMarcarLeida)) && (
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
            {isNoLeida && onMarcarLeida && (
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
                {isReceptor ? "Marcar como Leída" : "Marcar respuesta como Leída"}
              </button>
            )}

            {isReceptor && !hasRespuesta && onResponder && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                  setIsReplying(true);
                }}
                className="btn-firmar"
                style={{
                  background: "#3b82f6",
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
                Responder
              </button>
            )}
          </div>
        )}
      </div>

      {showModal &&
        createPortal(
          <div
            className="modal-firma-overlay"
            onClick={() => {
              setShowModal(false);
              setIsReplying(false);
            }}
          >
            <div
              className={`modal-firma modal-firma-centered modal-firma-${estadoVisual} ${isReplying || hasRespuesta ? "modal-firma-wide" : ""}`}
              style={{
                color: "#fff",
                maxHeight: "90vh",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
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
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <div className={`modal-estado-box ${estadoVisual}`}>
                  {estadoTexto}
                </div>
                {notaLeidaSinRespuesta && (
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#94a3b8",
                      fontWeight: "500",
                      fontStyle: "italic",
                    }}
                  >
                    Sin respuesta
                  </div>
                )}
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

              {/* Contenedor Flex para Desktop */}
              <div className="nota-content-wrapper">
                {/* Columna Izquierda: Nota Original */}
                <div className="nota-original-col">
                  <div
                    className="comentario"
                    style={{
                      margin: "1rem auto 8px auto",
                      textAlign: "left",
                      maxHeight:
                        "35vh" /* Un límite razonable para no ocupar toda la altura si la nota es muuuy larga */,
                      overflowY: "auto",
                      paddingRight: "8px",
                      wordBreak: "break-word",
                    }}
                  >
                    <b style={{ color: "#e2e8f0" }}>
                      Nota Original (De: {remitente_nombre || "Desconocido"}):
                    </b>{" "}
                    <br />"{contenido}"
                  </div>
                </div>

                {/* Columna Derecha: Respuesta o Formulario */}
                {(hasRespuesta || isReplying) && (
                  <div className="nota-respuesta-col">
                    {hasRespuesta ? (
                      <div
                        className="comentario"
                        style={{
                          margin: "1rem auto 8px auto",
                          textAlign: "left",
                          backgroundColor: "#eff6ff",
                          padding: "1rem",
                          borderRadius: "8px",
                          border: "1px solid #bfdbfe",
                          color: "#1e3a8a",
                          maxHeight: "35vh",
                          overflowY: "auto",
                          wordBreak: "break-word",
                        }}
                      >
                        <b style={{ color: "#1e40af" }}>
                          Respuesta (De: {destinatario_nombre || "Desconocido"}
                          ):
                        </b>
                        {respondida_el && (
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "#6b7280",
                              marginBottom: "8px",
                            }}
                          >
                            Enviada el:{" "}
                            {new Date(respondida_el).toLocaleDateString(
                              "es-AR",
                            )}{" "}
                            {new Date(respondida_el).toLocaleTimeString(
                              "es-AR",
                              { hour12: false },
                            )}{" "}
                            hs.
                          </div>
                        )}
                        <div
                          style={{ whiteSpace: "pre-wrap", marginTop: "4px" }}
                        >
                          "{respuesta}"
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          marginTop: "1rem",
                          textAlign: "center",
                          width: "100%",
                          flexShrink: 0,
                        }}
                      >
                        <label
                          style={{
                            display: "block",
                            marginBottom: "4px",
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                            color: "#fca5a5",
                          }}
                        >
                          Solo se permite una respuesta por nota
                        </label>
                        <textarea
                          value={respuestaText}
                          onChange={(e) => setRespuestaText(e.target.value)}
                          placeholder="Escribe tu respuesta aquí..."
                          style={{
                            width: "100%",
                            minHeight:
                              "150px" /* Un poco más alto al tener su propia columna */,
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #475569",
                            resize: "vertical",
                            color:
                              "#f8fafc" /* Gris muy clarito / casi blanco */,
                            backgroundColor:
                              "#1e293b" /* Fondo oscuro para que contraste con el texto claro */,
                            display: "block",
                            boxSizing: "border-box",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "center",
                            marginTop: "10px",
                          }}
                        >
                          <button
                            className="btn-rechazar"
                            onClick={() => setIsReplying(false)}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "6px",
                              border: "none",
                              backgroundColor: "#ef4444",
                              color: "white",
                              cursor: "pointer",
                            }}
                          >
                            Cancelar
                          </button>
                          <button
                            className="btn-firmar"
                            onClick={() => {
                              if (!respuestaText.trim()) return;
                              onResponder(id, respuestaText);
                              setShowModal(false);
                              setIsReplying(false);
                            }}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "6px",
                              border: "none",
                              backgroundColor: "#3b82f6",
                              color: "white",
                              cursor: "pointer",
                            }}
                            disabled={!respuestaText.trim()}
                          >
                            Enviar Respuesta
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                  className="btn-navbar"
                  onClick={() => {
                    setShowModal(false);
                    setIsReplying(false);
                  }}
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
