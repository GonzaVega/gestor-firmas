import { useState, useEffect } from "react";

function PaginatedList({
  items,
  renderItem,
  initialLimit = 8,
  className = "",
  style = {},
  emptyMessage = "No hay items.",
  loading = false,
  showSearch = false,
}) {
  const [limit, setLimit] = useState(initialLimit);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!items || items.length === 0) {
    return <div className="empty-list">{emptyMessage}</div>;
  }

  const visibleItems = items.slice(0, limit);
  const hasMore = limit < items.length;

  return (
    <div className={className} style={style}>
      {visibleItems.map(renderItem)}

      {hasMore && (
        <div style={{ padding: "1rem", textAlign: "center", width: "100%" }}>
          <button
            onClick={() => setLimit((prev) => prev + initialLimit)}
            style={{
              cursor: "pointer",
              background: "transparent",
              border: "1px solid #aaa",
              borderRadius: "20px",
              padding: "0.5rem 1.5rem",
              color: "#555",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#f0f0f0";
              e.target.style.borderColor = "#888";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "transparent";
              e.target.style.borderColor = "#aaa";
            }}
          >
            Ver más ({items.length - limit} restantes)
          </button>
        </div>
      )}
    </div>
  );
}

export default PaginatedList;
