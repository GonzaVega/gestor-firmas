import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

import InlineError from "../common/InlineError";

function NuevaNotaForm({ onNueva }) {
  const [usuarios, setUsuarios] = useState([]);
  const [destinatarioId, setDestinatarioId] = useState("");
  const [expedienteNumero, setExpedienteNumero] = useState("");
  const [contenido, setContenido] = useState("");
  const [loading, setLoading] = useState(false);
  const [expedienteError, setExpedienteError] = useState("");
  const [formError, setFormError] = useState("");

  const EXPEDIENTE_REGEX = /^\d{1,6}\/\d{2}$/;

  useEffect(() => {
    axiosInstance.get("/users").then((res) => setUsuarios(res.data));
  }, []);

  const handleExpedienteChange = (e) => {
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
    setFormError("");
    try {
      const res = await axiosInstance.post("/notas", {
        destinatario_id: destinatarioId,
        expediente: `P-${expedienteNumero}`,
        contenido,
        estado: "no_leida",
      });
      onNueva && onNueva(res.data);
      setDestinatarioId("");
      setExpedienteNumero("");
      setContenido("");
    } catch (err) {
      setFormError("Error al enviar nota");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="nueva-solicitud-form">
      <h3>Nueva Nota</h3>
      <select
        value={destinatarioId}
        onChange={(e) => setDestinatarioId(e.target.value)}
        required
      >
        <option value="">Enviar a...</option>
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
          placeholder="Expediente (######/##)"
          required
          maxLength={9}
        />
      </div>
      {expedienteError && (
        <div style={{ color: "red", fontSize: "0.8em" }}>{expedienteError}</div>
      )}

      <textarea
        placeholder="Escribe tu nota u observación aquí..."
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        required
        rows={4}
        style={{ marginTop: "1rem" }}
      />

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Enviando..." : "Enviar Nota"}
      </button>
    </form>
  );
  <InlineError error={formError} />;
}

export default NuevaNotaForm;
