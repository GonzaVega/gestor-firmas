import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "TU_CLIENT_ID_AQUI";

if (clientId === "TU_CLIENT_ID_AQUI") {
  console.warn("VITE_GOOGLE_CLIENT_ID no está configurado");
}

export default function RootWithGoogleProvider() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  );
}
