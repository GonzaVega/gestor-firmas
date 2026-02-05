// import classNames from "classnames";
// import { useState } from "react";

// function FirmaCard({ solicitud, onFirmar, onRechazar, esNueva }) {
//   const estado = solicitud.estado_firma || solicitud.estado;
//   const [showModal, setShowModal] = useState(false);
//   const documentos = solicitud.documentos;
//   const tieneTodos = Array.isArray(documentos) && documentos.includes("*");
//   const documentosTexto = tieneTodos
//     ? estado === "pendiente"
//       ? "Firmar todos"
//       : estado === "rechazado" || estado === "rechazada"
//         ? "Firma rechazada"
//         : "Todos firmados"
//     : Array.isArray(documentos)
//       ? documentos.join(", ")
//       : JSON.stringify(documentos);
//   const updatedAtTexto = solicitud.updated_at
//     ? `${new Date(solicitud.updated_at).toLocaleDateString("es-AR")} ${new Date(solicitud.updated_at).toLocaleTimeString("es-AR", { hour12: false })} hs.`
//     : null;

//   const handleOpenModal = () => setShowModal(true);
//   const handleCloseModal = () => setShowModal(false);
//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" || event.key === " ") {
//       event.preventDefault();
//       setShowModal(true);
//     }
//   };

//   return (
//     <>
//       <div
//         className={classNames("firma-card", estado, {
//           nueva: esNueva,
//           "firma-card-horizontal": true,
//         })}
//       >
//         <div
//           className="firma-card-main"
//           role="button"
//           tabIndex={0}
//           onClick={handleOpenModal}
//           onKeyDown={handleKeyDown}
//         >
//           <div className="firma-card-row">
//             <div className="firma-card-col expediente">
//               <b>Expediente:</b> <b>{solicitud.expediente?.numero}</b>
//             </div>
//             <div className="firma-card-col firmante">
//               <div>
//                 <b>Firmante</b>
//               </div>
//               <div>{solicitud.firmante?.nombre}</div>
//             </div>
//             <div className="firma-card-col solicitante">
//               <div>
//                 <b>Solicitante</b>
//               </div>
//               <div>{solicitud.solicitante?.nombre}</div>
//             </div>
//             <div className="firma-card-col documentos">
//               <b>Documentos:</b>
//               <div style={{ fontStyle: "italic" }}>{documentosTexto}</div>
//             </div>
//             <div className={classNames("firma-card-col estado", estado)}>
//               <span>{estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
//             </div>
//           </div>

//           {solicitud.comentario && (
//             <div className="comentario">
//               <b>Comentario:</b> {solicitud.comentario}
//             </div>
//           )}

//           {updatedAtTexto && (
//             <div className="comentario">
//               <b>Última modificación:</b> {updatedAtTexto}
//             </div>
//           )}
//         </div>

//         {onFirmar && onRechazar && estado === "pendiente" && (
//           <div className="acciones">
//             <button
//               className="btn-firmar"
//               onClick={() => onFirmar(solicitud.id)}
//             >
//               Firmar
//             </button>
//             <button
//               className="btn-rechazar"
//               onClick={() => onRechazar(solicitud.id)}
//             >
//               Rechazar
//             </button>
//           </div>
//         )}
//       </div>

//       {showModal && (
//         <div className="modal-firma-overlay" onClick={handleCloseModal}>
//           <div
//             className={`modal-firma modal-firma-centered modal-firma-${estado}`}
//             style={{ color: "#fff" }}
//             onClick={(event) => event.stopPropagation()}
//           >
//             <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
//               <div
//                 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 6 }}
//               >
//                 Expediente
//               </div>
//               <div
//                 style={{
//                   fontSize: "1.7rem",
//                   fontWeight: 800,
//                   marginBottom: 10,
//                 }}
//               >
//                 {solicitud.expediente?.numero}
//               </div>
//             </div>
//             <div
//               style={{
//                 marginBottom: 18,
//                 display: "flex",
//                 justifyContent: "center",
//               }}
//             >
//               <div className={`modal-estado-box ${estado}`}>
//                 {estado.charAt(0).toUpperCase() + estado.slice(1)}
//               </div>
//             </div>
//             <div style={{ marginBottom: 8, textAlign: "center" }}>
//               <span style={{ fontWeight: 600 }}>Documentos: </span>
//               <div style={{ fontStyle: "italic" }}>{documentosTexto}</div>
//             </div>
//             <div style={{ marginBottom: 8, textAlign: "center" }}>
//               <span style={{ fontWeight: 600 }}>Firmante: </span>
//               <span>{solicitud.firmante?.nombre}</span>
//             </div>
//             <div style={{ marginBottom: 8, textAlign: "center" }}>
//               <span style={{ fontWeight: 600 }}>Solicitante: </span>
//               <span>{solicitud.solicitante?.nombre}</span>
//             </div>
//             {solicitud.comentario && (
//               <div
//                 className="comentario"
//                 style={{ margin: "0 auto 8px auto", textAlign: "left" }}
//               >
//                 <b>Comentario:</b> {solicitud.comentario}
//               </div>
//             )}
//             {updatedAtTexto && (
//               <div
//                 className="comentario"
//                 style={{ margin: "0 auto 8px auto", textAlign: "left" }}
//               >
//                 <b>Última modificación:</b> {updatedAtTexto}
//               </div>
//             )}
//             <div style={{ textAlign: "center" }}>
//               <button
//                 className="btn-navbar"
//                 style={{ marginTop: 20 }}
//                 onClick={handleCloseModal}
//               >
//                 Cerrar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default FirmaCard;

import classNames from "classnames";
import { useState } from "react";
import { createPortal } from "react-dom";
import ConfirmacionRechazo from "../common/ConfirmacionRechazo";

function FirmaCard({ solicitud, onFirmar, onRechazar, esNueva }) {
  const estado = solicitud.estado_firma || solicitud.estado;
  const [showModal, setShowModal] = useState(false);
  const [showConfirmRechazo, setShowConfirmRechazo] = useState(false);
  const documentos = solicitud.documentos;
  const tieneTodos = Array.isArray(documentos) && documentos.includes("*");
  const documentosTexto = tieneTodos
    ? estado === "pendiente"
      ? "Firmar todos"
      : estado === "rechazado" || estado === "rechazada"
        ? "Firma rechazada"
        : "Todos firmados"
    : Array.isArray(documentos)
      ? documentos.join(", ")
      : JSON.stringify(documentos);
  const updatedAtTexto = solicitud.updated_at
    ? `${new Date(solicitud.updated_at).toLocaleDateString("es-AR")} ${new Date(solicitud.updated_at).toLocaleTimeString("es-AR", { hour12: false })} hs.`
    : null;

  const MAX_LENGTH = 60;
  const comentario = solicitud.comentario;
  const isLongComentario = comentario && comentario.length > MAX_LENGTH;
  const comentarioMostrar = isLongComentario
    ? comentario.substring(0, MAX_LENGTH) + "..."
    : comentario;

  return (
    <>
      <div
        className={classNames("firma-card", "firma-card-horizontal", estado, {
          nueva: esNueva,
        })}
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
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      >
        <div className="firma-card-row">
          <div className="firma-card-col expediente">
            <b>Expediente:</b> <b>{solicitud.expediente?.numero}</b>
          </div>
          <div className="firma-card-col firmante">
            <div>
              <b>Firmante</b>
            </div>
            <div>{solicitud.firmante?.nombre}</div>
          </div>
          <div className="firma-card-col solicitante">
            <div>
              <b>Solicitante</b>
            </div>
            <div>{solicitud.solicitante?.nombre}</div>
          </div>
          <div className="firma-card-col documentos">
            <b>Documentos:</b>
            <div style={{ fontStyle: "italic" }}>{documentosTexto}</div>
          </div>
          <div className={classNames("firma-card-col estado", estado)}>
            <span>{estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
          </div>
        </div>

        {solicitud.comentario && (
          <div
            className="comentario"
            style={{ marginBottom: updatedAtTexto ? "4px" : undefined }}
          >
            <b>Comentario:</b> {comentarioMostrar}
            {isLongComentario && (
              <span style={{ color: "#60a5fa", fontWeight: 600 }}>
                {" "}
                (Click para ver más)
              </span>
            )}
          </div>
        )}
        {updatedAtTexto && (
          <div className="comentario">
            <b>Última modificación:</b> {updatedAtTexto}
          </div>
        )}
        {onFirmar && onRechazar && estado === "pendiente" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "100%",
              height: "40px",
              alignItems: "center",
            }}
          >
            {showConfirmRechazo ? (
              <ConfirmacionRechazo
                onConfirm={(e) => {
                  e.stopPropagation();
                  onRechazar(solicitud.id);
                  setShowConfirmRechazo(false);
                }}
                onCancel={(e) => {
                  e.stopPropagation();
                  setShowConfirmRechazo(false);
                }}
              />
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmRechazo(true);
                }}
                style={{
                  background: "#ef4444",
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
                Rechazar
              </button>
            )}

            {!showConfirmRechazo && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFirmar(solicitud.id);
                }}
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
                Firmar
              </button>
            )}
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
              className={`modal-firma modal-firma-centered modal-firma-${estado}`}
              style={{ color: "#fff" }}
              onClick={(e) => e.stopPropagation()}
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
                  {solicitud.expediente?.numero}
                </div>
              </div>
              <div
                style={{
                  marginBottom: 18,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div className={`modal-estado-box ${estado}`}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </div>
              </div>
              <div style={{ marginBottom: 8, textAlign: "center" }}>
                <span style={{ fontWeight: 600 }}>Documentos: </span>
                <div style={{ fontStyle: "italic" }}>{documentosTexto}</div>
              </div>
              <div style={{ marginBottom: 8, textAlign: "center" }}>
                <span style={{ fontWeight: 600 }}>Firmante: </span>
                <span>{solicitud.firmante?.nombre}</span>
              </div>
              <div style={{ marginBottom: 8, textAlign: "center" }}>
                <span style={{ fontWeight: 600 }}>Solicitante: </span>
                <span>{solicitud.solicitante?.nombre}</span>
              </div>
              {solicitud.comentario && (
                <div
                  className="comentario"
                  style={{ margin: "0 auto 8px auto", textAlign: "left" }}
                >
                  <b>Comentario:</b> {solicitud.comentario}
                </div>
              )}
              {updatedAtTexto && (
                <div
                  className="comentario"
                  style={{ margin: "0 auto 8px auto", textAlign: "left" }}
                >
                  <b>Última modificación:</b> {updatedAtTexto}
                </div>
              )}
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
export default FirmaCard;
