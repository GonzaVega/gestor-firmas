import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Mantener la lógica de autenticación igual, solo se elimina el selector visual de rol
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axiosInstance.post("/auth/google", {
        id_token: credentialResponse.credential,
      });
      login(res.data.jwt, res.data.user);
      // Redirigir según el rol recibido
      if (res.data.user.rol === "firmante") {
        navigate("/firmante");
      } else {
        navigate("/solicitante");
      }
    } catch (err) {
      alert("Error de autenticación");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card login-card-custom">
        <h1 className="app-title-login">Gestor de Firmas</h1>
        <h2 className="login-title">Iniciar sesión</h2>
        <div className="login-google-wrapper">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert("Error de Google Login")}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
