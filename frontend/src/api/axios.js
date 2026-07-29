import axios from "axios";

const defaultBackendUrl = typeof window !== "undefined" && window.location.hostname
  ? `http://${window.location.hostname}:8000`
  : "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultBackendUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;