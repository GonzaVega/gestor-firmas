import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://devoted-trisha-gonzavega-6d2ef323.koyeb.app/api/v1",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  },
);

export default instance;
