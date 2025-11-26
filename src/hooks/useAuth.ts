// hooks/useAuth.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { AxiosError, AxiosResponse } from "axios";
import endPoints from "@/services/endpoints";
import useAuthStore from "@/store/useAuthStore";
import { LoginResponse } from "@/interfaces/user";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setUser, clearAuth } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string[] | Record<string, string[]>>([]);

  const login = async (email: string, password: string): Promise<AxiosResponse<LoginResponse> | undefined> => {
    try {
      setError(null);
      setLoading(true);

      await api.get(endPoints.sanctum);
      const response = await api.post<LoginResponse>(endPoints.user.login, { email, password });
      setLoading(false);
      return response;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;

      const error = err as AxiosError<{ message?: string | Record<string, string[]>; errors?: Record<string, string[]> }>;

      const messages = error.response?.data?.errors
        ? error.response.data.errors // Es un objeto con claves
        : typeof error.response?.data?.message === "object"
        ? Object.values(error.response.data.message).flat() // Es un objeto con valores en arrays
        : typeof error.response?.data?.message === "string"
        ? [error.response.data.message] // Es un solo string
        : ["Ocurrió un error inesperado."];

      setErrorMessage(messages);

      setError(axiosError.response?.data?.message ?? "Login fallido");
      setLoading(false);
      return undefined;
    }
  };

  const logout = async () => {
    try {
      await api.post(endPoints.user.logout);
      clearAuth();
      router.push("/login");
    } catch (e) {
      console.error("Logout fallido", e);
    }
  };

  const currentUser = async () => {
    try {
      await api.get(endPoints.sanctum);
      const { data } = await api.get(endPoints.user.get);
      setUser(data);
      return data;
    } catch (e) {
      clearAuth();
      console.log(e);
      throw new Error("User not authenticated");
    }
  };

  return { error, loading, login, logout, currentUser, errorMessage };
}
