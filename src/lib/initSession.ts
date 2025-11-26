import endPoints from "@/services/endpoints";
import api from "./api";

let initialized = false;

export async function initSession() {
  if (!initialized) {
    try {
      await api.get(endPoints.sanctum);
      initialized = true;
    } catch (error) {
      console.warn("No se pudo inicializar la sesión", error);
    }
  }
}

export default initSession;
