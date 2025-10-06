import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axiosInstance.post('/auth/google', {
        id_token: credentialResponse.credential,
      });
      login(res.data.jwt, res.data.user);
      if (res.data.user.rol === 'Fiscal' || res.data.user.rol === 'Fiscal Jefe' || res.data.user.rol === 'Ayudante Fiscal') {
        navigate('/firmante');
      } else {
        navigate('/solicitante');
      }
    } catch (err) {
      alert('Error de autenticación');
    }
  };

  return (
    <div className="login-page">
      <h2>Iniciar sesión</h2>
      <GoogleLogin onSuccess={handleSuccess} onError={() => alert('Error de Google Login')} />
    </div>
  );
}

export default Login;
