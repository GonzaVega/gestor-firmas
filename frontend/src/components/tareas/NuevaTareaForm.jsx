import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

import InlineError from "../common/InlineError";

function NuevaTareaForm({ onNueva }) {
  const [usuarios, setUsuarios] = useState([]);
  const [asignadoId, setAsignadoId] = useState("");
  const [expedienteNumero, setExpedienteNumero] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [descripcion, setDescripcion] = useState("");
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
    if (fechaLimite) {
      const limit = new Date(fechaLimite);
      const limitDate = new Date(
        limit.getUTCFullYear(),
        limit.getUTCMonth(),
        limit.getUTCDate(),
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayStr = today.toISOString().split("T")[0];
      if (fechaLimite < todayStr) {
        setFormError("La fecha límite no puede ser anterior a hoy");
        return;
      }
    }
    setLoading(true);
    setFormError("");
    try {
      const res = await axiosInstance.post("/tareas", {
        asignado_a: asignadoId,
        expediente: `P-${expedienteNumero}`,
        fecha_limite: fechaLimite,
        descripcion,
        estado: "pendiente",
      });
      onNueva && onNueva(res.data);
      setAsignadoId("");
      setExpedienteNumero("");
      setFechaLimite("");
      setDescripcion("");
    } catch (err) {
      setFormError("Error al crear tarea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="nueva-solicitud-form">
      <h3>Nueva Tarea</h3>
      <select
        value={asignadoId}
        onChange={(e) => setAsignadoId(e.target.value)}
        required
      >
        <option value="">Asignar a...</option>
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

      <div className="form-group" style={{ marginTop: "1rem" }}>
        <label
          style={{
            display: "block",
            fontSize: "0.9em",
            color: "#666",
            marginBottom: "0.3em",
          }}
        >
          Fecha Límite
        </label>
        <input
          type="date"
          className="date-input"
          value={fechaLimite}
          onChange={(e) => setFechaLimite(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </div>

      <textarea
        placeholder="Descripción de la tarea"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
        rows={3}
      />

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Creando..." : "Crear Tarea"}
      </button>
      <InlineError error={formError} />
    </form>
  );
}

export default NuevaTareaForm;
