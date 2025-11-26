"use client";

import { useData } from "@/hooks/useData";
import { Load } from "@/interfaces/load";
import endPoints from "@/services/endpoints";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function LoadsListPage() {
  const { slug } = useParams();

  if (!slug || Array.isArray(slug)) {
    throw new Error("Slug inválido");
  }

  const { data, isLoading, error } = useData<Load[]>(endPoints.constructions.loads.all(slug as string), `construction-${slug}-loads`, { enabled: !!slug });

  return (
    <section className="py-12">
      <div className="container">
        <h1 className="text-2xl font-bold mb-6">Cargas registradas</h1>

        {isLoading && <p>Cargando...</p>}
        {error && <p className="text-red-500">Error al cargar cargas</p>}

        {data && data.length > 0 ? (
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Notas</th>
                <th className="border p-2">Tareas</th>
                <th className="border p-2">Asignaciones</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((load) => (
                <tr key={load.id} className="hover:bg-slate-50">
                  <td className="border p-2">{load.date}</td>
                  <td className="border p-2">{load.notes ?? "-"}</td>
                  <td className="border p-2">{load.tasks?.length ?? 0}</td>
                  <td className="border p-2">{load.employee_hours?.length ?? 0}</td>
                  <td className="border p-2">
                    <Link href={`/dashboard/loads/${slug}/${load.id}`} className="text-blue-600 hover:underline">
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !isLoading && data && data.length === 0 && <p>No hay cargas registradas todavía.</p>
        )}
      </div>
    </section>
  );
}
