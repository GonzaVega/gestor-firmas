import React from "react";

export default function ExpedienteSearch({ value, onChange, placeholder, hidden }) {
  if (hidden) return null;
  return (
    <div className="expediente-search">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder || "Buscar por expediente..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
