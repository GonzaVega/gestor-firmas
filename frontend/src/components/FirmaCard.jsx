
import classNames from "classnames";
import { useState } from "react";

function FirmaCard({ solicitud, onFirmar, onRechazar, esNueva }) {
  const estado = solicitud.estado_firma || solicitud.estado;
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className={classNames("firma-card", estado, {
          nueva: esNueva,
          "firma-card-horizontal": true,
        })}
        style={{ cursor: "pointer" }}
        onClick={() => setShowModal(true)}
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
            <b>Documentos:</b>{" "}
            {Array.isArray(solicitud.documentos)
              ? solicitud.documentos.join(", ")
              : JSON.stringify(solicitud.documentos)}
          </div>
          <div className={classNames("firma-card-col estado", estado)}>
            <span>{estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
          </div>
        </div>
        {solicitud.comentario && (
          <div className="comentario">
            <b>Comentario:</b> {solicitud.comentario}
          </div>
        )}
        {onFirmar && onRechazar && estado === "pendiente" && (
          <div className="acciones" onClick={e => e.stopPropagation()}>
            <button className="btn-firmar" onClick={() => onFirmar(solicitud.id)}>
              Firmar
            </button>
            <button
              className="btn-rechazar"
              onClick={() => onRechazar(solicitud.id)}
            >
              Rechazar
            </button>
          </div>
        )}
      </div>
      {showModal && (
        <div className="modal-firma-overlay" onClick={() => setShowModal(false)}>
          <div className={`modal-firma modal-firma-centered modal-firma-${estado}`} style={{color: '#fff'}} onClick={e => e.stopPropagation()}>
            <div style={{marginBottom: '1.5rem', textAlign: 'center'}}>
              <div style={{fontSize: '1.2rem', fontWeight: 700, marginBottom: 6}}>Expediente</div>
              <div style={{fontSize: '1.7rem', fontWeight: 800, marginBottom: 10}}>{solicitud.expediente?.numero}</div>
            </div>
            <div style={{marginBottom: 18, display: 'flex', justifyContent: 'center'}}>
              <div className={`modal-estado-box ${estado}`}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </div>
            </div>
            <div style={{marginBottom: 8, textAlign: 'center'}}>
              <span style={{fontWeight: 600}}>Documentos: </span>
              <span>{Array.isArray(solicitud.documentos) ? solicitud.documentos.join(", ") : JSON.stringify(solicitud.documentos)}</span>
            </div>
            <div style={{marginBottom: 8, textAlign: 'center'}}>
              <span style={{fontWeight: 600}}>Firmante: </span>
              <span>{solicitud.firmante?.nombre}</span>
            </div>
            <div style={{marginBottom: 8, textAlign: 'center'}}>
              <span style={{fontWeight: 600}}>Solicitante: </span>
              <span>{solicitud.solicitante?.nombre}</span>
            </div>
            {solicitud.comentario && (
              <div className="comentario" style={{margin: '0 auto 8px auto', textAlign: 'left'}}>
                <b>Comentario:</b> {solicitud.comentario}
              </div>
            )}
            <div style={{textAlign: 'center'}}>
              <button className="btn-navbar" style={{marginTop: 20}} onClick={() => setShowModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default FirmaCard;
