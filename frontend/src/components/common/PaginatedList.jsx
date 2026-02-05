import { useState, useEffect } from "react";

function PaginatedList({
  items,
  renderItem,
  initialLimit = 8,
  className = "",
  style = {},
  emptyMessage = "No hay items.",
  loading = false,
  showSearch = false, // If the search is external, this might not be needed inside, but purely for pagination
}) {
  const [limit, setLimit] = useState(initialLimit);

  // Reset limit when items change (e.g. searching/filtering) ??
  // Actually, if I filter, the list might shrink. If I clear filter, it grows.
  // It's usually better to reset limit when the mode changes or main list changes significantly,
  // but strictly speaking, if 'items' prop updates (due to search), we can keep 'limit' or reset it.
  // Let's keep it simple: if items.length < limit, it just shows all.
  // If I search and find 2 items, limit 10 is fine.
  // If I clear search, I might want to go back to 10? Or stay at 10.
  // Let's leave state management simple for now.

  // Optional: Reset limit if items array reference changes drastically?
  // Probably not needed for simple "View More".

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
