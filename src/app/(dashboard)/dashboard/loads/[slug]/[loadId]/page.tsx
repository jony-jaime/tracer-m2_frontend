"use client";

import { useData } from "@/hooks/useData";
import { Load } from "@/interfaces/load";
import endPoints from "@/services/endpoints";
import { useParams } from "next/navigation";

export default function LoadDetailPage() {
  const { slug, loadId } = useParams();

  if (!slug || Array.isArray(slug) || !loadId || Array.isArray(loadId)) {
    throw new Error("Parámetros inválidos");
  }

  const { data: load, isLoading, error } = useData<Load>(endPoints.constructions.loads.one(slug as string, loadId as string), `construction-${slug}-load-${loadId}`, { enabled: !!slug && !!loadId });

  if (isLoading) return <p className="p-6">Cargando detalle...</p>;
  if (error) return <p className="p-6 text-red-500">Error al cargar detalle</p>;
  if (!load) return <p className="p-6">No se encontró la carga</p>;

  return (
    <section className="py-12">
      <div className="container max-w-[1200px]">
        <div className="flex gap-2 flex-col lg:flex-row items-start justify-between text-center w-full mb-8">
          <div className="border border-black/10 p-3 lg:p-4 rounded-md w-full lg:w-[33%] flex flex-col h-full justify-center">
            <h3 className="text-2xl">{Number(load.m2_total).toFixed(2)}</h3>
            <p className="text-xs">
              m<sup>2</sup> del día
            </p>
          </div>
          <div className="border border-black/10 p-3 lg:p-4 rounded-md w-full lg:w-[33%] flex flex-col h-full justify-center">
            <h3 className="text-2xl">{Number(load.points_total).toFixed(2)}</h3>
            <p className="text-xs">Puntos del día</p>
          </div>
          <div className="border border-black/10 p-3 lg:p-4 rounded-md w-full lg:w-[33%] flex flex-col h-full justify-center">
            <h3 className="text-2xl">{Number(load.ratio).toFixed(2)} </h3>
            <p className="text-xs">
              Puntos por m<sup>2</sup>
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold mb-4">Detalle de carga</h1>

          <div className="border rounded-lg p-4 space-y-2">
            <p>
              <strong>Fecha:</strong> {load.date}
            </p>
            {load.notes && (
              <p>
                <strong>Notas generales:</strong> {load.notes}
              </p>
            )}

            {load.images && (
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <h3 className="col-span-2 lg:col-span-6 text-base font-semibold">Im&aacute;genes globales:</h3>
                {load.images?.map((image, index) => (
                  <picture key={index}>
                    <img src={process.env.NEXT_PUBLIC_BASE_URL_STORAGE + "/" + image} className={"w-full object-cover"} alt="" />
                  </picture>
                ))}
                {load.show_client && <p className="col-span-2 lg:col-span-6 text-sm text-green-600 bg-green-100 p-4 rounded-lg">Las imágenes se pueden mostrar al cliente</p>}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Tareas ({load.tasks?.length ?? 0})</h2>
            {load.tasks && load.tasks.length > 0 ? (
              <ul className="list-disc pl-6 space-y-1">
                {load.tasks.map((task) => (
                  <li key={task.id} className="mb-6">
                    {task?.construction_task?.code} — {task?.construction_task?.category} - {task?.construction_task?.task}
                    {task.progress && ` (${task.progress} ${task?.construction_task?.unit})`}
                    {task.notes && (
                      <p className="mt-4">
                        <strong>Notas: </strong>
                        {task.notes}
                      </p>
                    )}
                    {task.images && (
                      <div className="grid grid-cols-2 lg:grid-cols-6 mt-4">
                        <h3 className="col-span-2 lg:col-span-6 text-base font-semibold mb-2">Im&aacute;genes:</h3>
                        {task.images.map((image, index) => (
                          <picture key={index}>
                            <img src={process.env.NEXT_PUBLIC_BASE_URL_STORAGE + "/" + image} className={"w-full object-cover"} alt="" />
                          </picture>
                        ))}
                        {task.show_client && <p className="col-span-2 lg:col-span-6 text-sm text-green-600 bg-green-100 p-4 rounded-lg mt-4">Las imágenes se pueden mostrar al cliente</p>}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Sin tareas</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Asignaciones ({load.employee_hours?.length ?? 0})</h2>
            {load.employee_hours && load.employee_hours.length > 0 ? (
              <ul className="list-disc pl-6 space-y-1">
                {load.employee_hours.map((eh) => (
                  <li key={eh.id}>
                    {eh.construction_task?.code} — {eh.employee?.name} {eh.employee?.lastname} — {eh.points ? `${eh.points} pts` : "sin puntos"}
                    {eh.notes && (
                      <p className="mt-4">
                        <strong>Notas: </strong>
                        {eh.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Sin asignaciones</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
