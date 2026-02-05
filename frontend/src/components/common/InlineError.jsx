import { useState, useEffect } from "react";

function InlineError({ error }) {
  if (!error) return null;
  return (
    <div
      style={{
        color: "#ef4444",
        background: "#fee2e2",
        border: "1px solid #fecaca",
        padding: "0.5rem",
        borderRadius: "6px",
        fontSize: "0.9rem",
        marginTop: "0.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span>⚠️</span>
      <span>{error}</span>
    </div>
  );
}

export default InlineError;
