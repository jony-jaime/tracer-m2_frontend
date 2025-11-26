"use client";

import { useData } from "@/hooks/useData";
import { Construction } from "@/interfaces/construction";
import endPoints from "@/services/endpoints";
import Link from "next/link";

export default function Dashboard() {
  const { data, isLoading } = useData<Construction[]>(endPoints.constructions.get, "constructions");
  return (
    <section className="py-24">
      <div className="container">
        <h2 className="text-3xl font-bold mb-12 text-center">Desarrollos</h2>

        {isLoading && <p className="text-center">Cargando...</p>}

        {!isLoading && data && data.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {data?.map((construction) => (
              <Item key={construction.id} {...construction} />
            ))}
          </div>
        )}
        {!isLoading && !data?.length && <p className="text-center">No hay desarrollos para mostrar</p>}
      </div>
    </section>
  );
}

const Item = ({ title, slug, thumbnail_path, m2_total, points_total, ratio }: Construction) => {
  return (
    <div className="relative p-6 lg:p-8 bg-slate-800 text-white overflow-hidden rounded-md">
      <div className="flex flex-col justify-center items-center h-full relative z-10">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>

        <h4 className="text-xs tracking-[1.5px] mb-2 uppercase">Últimos 7 días</h4>

        <div className="flex gap-2 items-start justify-between text-center w-full mb-4">
          <div className="border border-white/10 p-3 lg:p-4 rounded-md w-[33%] flex flex-col h-full justify-center">
            <h3 className="text-2xl">{Number(m2_total).toFixed(2)}</h3>
            <p className="text-xs">
              m<sup>2</sup> por día
            </p>
          </div>
          <div className="border border-white/10 p-3 lg:p-4 rounded-md w-[33%] flex flex-col h-full justify-center">
            <h3 className="text-2xl">{Number(points_total).toFixed(2)}</h3>
            <p className="text-xs">Puntos por día</p>
          </div>
          <div className="border border-white/10 p-3 lg:p-4 rounded-md w-[33%] flex flex-col h-full justify-center">
            <h3 className="text-2xl">{Number(ratio).toFixed(2)} </h3>
            <p className="text-xs">
              Puntos por m<sup>2</sup>
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <Link href={`/dashboard/loads/${slug}`} className="btn btn-white !px-4 !py-2 w-full justify-center">
            Ver Tareas
          </Link>
          <Link href={`/dashboard/tasks/${slug}`} className="btn btn-white !px-4 !py-2 w-full justify-center">
            Cargar Tarea
          </Link>
        </div>
      </div>

      {thumbnail_path && (
        <picture>
          <img className="w-full h-full object-cover absolute top-0 left-0 opacity-20 pointer-events-none z-0" src={process.env.NEXT_PUBLIC_BASE_URL_STORAGE + thumbnail_path} alt="" />
        </picture>
      )}
    </div>
  );
};
