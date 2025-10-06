import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <header className="header">
      <span>{user.nombre} ({user.rol})</span>
      <button onClick={logout}>Cerrar sesión</button>
    </header>
  );
}
export default Header;
