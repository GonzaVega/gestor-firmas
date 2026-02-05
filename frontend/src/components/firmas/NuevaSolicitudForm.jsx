import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

import InlineError from "../common/InlineError";

function NuevaSolicitudForm({ onNueva }) {
  const [usuarios, setUsuarios] = useState([]);
  const [firmanteId, setFirmanteId] = useState("");
  const [expedienteNumero, setExpedienteNumero] = useState("");
  const [documentos, setDocumentos] = useState("");
  const [todosLosDocumentos, setTodosLosDocumentos] = useState(false);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [expedienteError, setExpedienteError] = useState("");
  const [formError, setFormError] = useState("");

  const EXPEDIENTE_REGEX = /^\d{1,6}\/\d{2}$/;

  useEffect(() => {
    axiosInstance.get("/users").then((res) => setUsuarios(res.data));
  }, []);

  const handleExpedienteChange = (e) => {
    // Solo permitir números, barra y máximo 6+2 dígitos
    let value = e.target.value.replace(/[^\d\/]/g, "");
    setExpedienteNumero(value);
    if (!EXPEDIENTE_REGEX.test(value)) {
      setExpedienteError("Formato: ######/##");
    } else {
      setExpedienteError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!EXPEDIENTE_REGEX.test(expedienteNumero)) {
      setExpedienteError("Formato: ######/##");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/firma_solicitudes", {
        firmante_id: firmanteId,
        expediente_numero: `P-${expedienteNumero}`,
        documentos: todosLosDocumentos
          ? ["*"]
          : documentos
              .split(",")
              .map((d) => d.trim())
              .filter(Boolean),
        comentario,
      });
      onNueva && onNueva(res.data);
      setFirmanteId("");
      setExpedienteNumero("");
      setDocumentos("");
      setTodosLosDocumentos(false);
      setComentario("");
    } catch (err) {
      setFormError("Error al crear solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="nueva-solicitud-form">
      <h3>Nueva Solicitud</h3>
      <select
        value={firmanteId}
        onChange={(e) => setFirmanteId(e.target.value)}
        required
      >
        <option value="">Seleccionar firmante</option>
        {usuarios.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nombre} ({u.rol})
          </option>
        ))}
      </select>
      <div className="input-prefix" data-prefix="P-">
        <input
          className="prefix-input"
          value={expedienteNumero}
          onChange={handleExpedienteChange}
          placeholder="######/##"
          required
          maxLength={9}
        />
      </div>
      {expedienteError && <div style={{ color: "red" }}>{expedienteError}</div>}
      <label className="toggle-row">
        <span>Firmar todos los documentos</span>
        <span className="toggle-switch">
          <input
            type="checkbox"
            checked={todosLosDocumentos}
            onChange={(e) => setTodosLosDocumentos(e.target.checked)}
          />
          <span className="toggle-slider" />
        </span>
      </label>
      <div
        className={`documentos-field ${todosLosDocumentos ? "is-hidden" : "is-visible"}`}
        aria-hidden={todosLosDocumentos}
      >
        <input
          value={documentos}
          onChange={(e) => setDocumentos(e.target.value)}
          placeholder="Documentos (separados por coma)"
          required={!todosLosDocumentos}
          disabled={todosLosDocumentos}
        />
      </div>
      <input
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Comentario (opcional)"
      />
      <button type="submit" disabled={loading}>
        Crear Solicitud
      </button>
      <InlineError error={formError} />
    </form>
  );
}
export default NuevaSolicitudForm;
