import endPoints from "@/services/endpoints";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_BACKEND,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const cookie = document.cookie.split("; ").find((c) => c.startsWith("XSRF-TOKEN="));

  if (cookie) {
    const xsrfToken = decodeURIComponent(cookie.split("=")[1]);
    config.headers["X-XSRF-TOKEN"] = xsrfToken;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig;

    if (error.response?.status === 419 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.get(endPoints.sanctum);
        return api(originalRequest);
      } catch (e) {
        console.warn("⚠️ No se pudo renovar el token CSRF.", e);
      }
    }

    if (error.response?.status === 401) {
      console.warn("🔐 Sesión expirada o usuario no autenticado.");
    }

    return Promise.reject(error);
  }
);

export default api;
