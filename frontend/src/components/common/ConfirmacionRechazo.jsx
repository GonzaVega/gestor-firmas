function ConfirmacionRechazo({ onConfirm, onCancel }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffeaea", // Light red background similar to 'rechazado' badge
        padding: "8px 16px",
        borderRadius: "8px",
        border: "1px solid #c00", // Red border
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <span style={{ color: "#c00", fontWeight: "600", marginBottom: "6px" }}>
        ¿Rechazar solicitud?
      </span>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={onConfirm}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "4px 12px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "0.9em",
            minWidth: "60px",
          }}
        >
          Sí
        </button>
        <button
          onClick={onCancel}
          style={{
            background: "#fff",
            color: "#555",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "4px 12px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "0.9em",
            minWidth: "60px",
          }}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default ConfirmacionRechazo;
