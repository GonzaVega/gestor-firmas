import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

import InlineError from "../common/InlineError";

function NuevaTareaForm({ onNueva }) {
  const [usuarios, setUsuarios] = useState([]);
  const [asignadoId, setAsignadoId] = useState("");
  const [expedienteNumero, setExpedienteNumero] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [venceHoy, setVenceHoy] = useState(false);
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

  const handleVenceHoyChange = (e) => {
    const isChecked = e.target.checked;
    setVenceHoy(isChecked);
    if (isChecked) {
      // Establece la fecha de hoy en formato YYYY-MM-DD local
      const today = new Date();
      const offset = today.getTimezoneOffset() * 60000;
      const localToday = new Date(today.getTime() - offset).toISOString().split("T")[0];
      setFechaLimite(localToday);
    } else {
      setFechaLimite("");
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
      // Para evitar problemas de zona horaria (UTC atrasando un día), se envía como YYYY-MM-DDT12:00:00
      const fechaConHoraGarantizada = fechaLimite ? `${fechaLimite}T12:00:00` : null;

      const res = await axiosInstance.post("/tareas", {
        asignado_a: asignadoId,
        expediente: `P-${expedienteNumero}`,
        fecha_limite: fechaConHoraGarantizada,
        descripcion,
        estado: "pendiente",
      });
      onNueva && onNueva(res.data);
      setAsignadoId("");
      setExpedienteNumero("");
      setFechaLimite("");
      setVenceHoy(false);
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

      <label className="toggle-row" style={{ marginTop: "0.5rem", marginBottom: "0.25rem" }}>
        <span>Vence hoy</span>
        <span className="toggle-switch">
          <input
            type="checkbox"
            checked={venceHoy}
            onChange={handleVenceHoyChange}
          />
          <span className="toggle-slider" />
        </span>
      </label>

      <div
        className={`documentos-field ${venceHoy ? "is-hidden" : "is-visible"}`}
        aria-hidden={venceHoy}
      >
        <input
          type="date"
          value={fechaLimite}
          onChange={(e) => setFechaLimite(e.target.value)}
          required={!venceHoy}
          disabled={venceHoy}
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
