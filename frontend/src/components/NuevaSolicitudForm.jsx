import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function NuevaSolicitudForm({ onNueva }) {
  const [usuarios, setUsuarios] = useState([]);
  const [firmanteId, setFirmanteId] = useState("");
  const [expedienteNumero, setExpedienteNumero] = useState("");
  const [documentos, setDocumentos] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [expedienteError, setExpedienteError] = useState("");

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
        documentos: documentos.split(",").map((d) => d.trim()),
        comentario,
      });
      onNueva && onNueva(res.data);
      setFirmanteId("");
      setExpedienteNumero("");
      setDocumentos("");
      setComentario("");
    } catch (err) {
      alert("Error al crear solicitud");
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
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontWeight: "bold" }}>P-</span>
        <input
          value={expedienteNumero}
          onChange={handleExpedienteChange}
          placeholder="######/##"
          required
          style={{ flex: 1 }}
          maxLength={9}
        />
      </div>
      {expedienteError && <div style={{ color: "red" }}>{expedienteError}</div>}
      <input
        value={documentos}
        onChange={(e) => setDocumentos(e.target.value)}
        placeholder="Documentos (separados por coma)"
        required
      />
      <input
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Comentario (opcional)"
      />
      <button type="submit" disabled={loading}>
        Crear Solicitud
      </button>
    </form>
  );
}
export default NuevaSolicitudForm;
