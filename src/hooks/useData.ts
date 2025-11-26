import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "@/lib/api";

export function useData<T>(url: string, key: string, options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">) {
  return useQuery<T>({
    queryKey: [key],
    queryFn: async () => {
      const res = await api.get(url);
      return res.data;
    },
    initialData: [] as unknown as T,
    ...options,
  });
}
