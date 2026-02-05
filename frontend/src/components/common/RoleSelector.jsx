import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/useAuth";
import axiosInstance from "../../api/axiosInstance";

export function RoleSelector() {
  const { user, login } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    loadRoles();
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadRoles = async () => {
    try {
      const response = await axiosInstance.get("/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  const handleRoleChange = async (newRole) => {
    if (!user || newRole === user.rol) return;

    setLoading(true);
    try {
      await axiosInstance.patch(`/users/${user.id}`, { rol: newRole });
      const meResponse = await axiosInstance.get("/users/me");
      login(localStorage.getItem("jwt"), meResponse.data);
      setIsOpen(false);
    } catch (error) {
      console.error("Error al actualizar rol:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="custom-select" ref={containerRef}>
      <button
        type="button"
        className="role-selector"
        onClick={() => !loading && setIsOpen(!isOpen)}
        disabled={loading}
      >
        <span style={{ marginRight: "8px" }}>{user.rol}</span>
        <span
          className="dropdown-arrow"
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="role-options">
          {roles.map((rol) => (
            <div
              key={rol}
              className={`role-option ${rol === user.rol ? "selected" : ""}`}
              onClick={() => handleRoleChange(rol)}
            >
              {rol}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
