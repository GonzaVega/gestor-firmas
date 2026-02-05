import "./ModeSelector.css";

export default function ModeSelector({
  currentMode,
  onModeChange,
  badges = {},
}) {
  const modes = [
    { id: "tareas", label: "Tareas" },
    { id: "firmas", label: "Firmas" },
    { id: "notas", label: "Notas" },
  ];

  return (
    <div className="mode-selector-container">
      {modes.map((mode) => (
        <button
          key={mode.id}
          className={`mode-button ${currentMode === mode.id ? "active" : ""}`}
          onClick={() => onModeChange(mode.id)}
        >
          {mode.label}
          {badges[mode.id] > 0 && (
            <span className="mode-badge">{badges[mode.id]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
