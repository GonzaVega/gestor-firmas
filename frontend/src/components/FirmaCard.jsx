import classNames from 'classnames';

function FirmaCard({ solicitud, onFirmar, onRechazar, esNueva }) {
  return (
    <div className={classNames('firma-card', { nueva: esNueva })}>
      <div><b>Expediente:</b> {solicitud.expediente?.numero}</div>
      <div><b>Documentos:</b> {Array.isArray(solicitud.documentos) ? solicitud.documentos.join(', ') : JSON.stringify(solicitud.documentos)}</div>
      {solicitud.comentario && <div><b>Comentario:</b> {solicitud.comentario}</div>}
      <div><b>Estado:</b> {solicitud.estado}</div>
      {onFirmar && onRechazar && solicitud.estado === 'pendiente' && (
        <div style={{ marginTop: 8 }}>
          <button onClick={() => onFirmar(solicitud.id)}>Firmar</button>
          <button onClick={() => onRechazar(solicitud.id)} style={{ marginLeft: 8 }}>Rechazar</button>
        </div>
      )}
    </div>
  );
}
export default FirmaCard;
