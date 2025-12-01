"use client";

import LoadForm from "@/components/forms/load-form";
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/loads/columns";
import LoadSheet from "@/components/table/loads/sheet";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useData } from "@/hooks/useData";
import { Construction } from "@/interfaces/construction";
import { Load } from "@/interfaces/load";
import endPoints from "@/services/endpoints";
import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ClipLoader } from "react-spinners";


export default function LoadsListPage() {
  const { slug } = useParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);

  if (!slug || Array.isArray(slug)) {
    throw new Error("Slug inválido");
  }

  const { data: building, isLoading: isLoadingBuilding } = useData<Construction>(
    endPoints.constructions.getOne(slug),
    `construction-${slug}`,
    { enabled: !!slug }
  );

  const { data, isLoading, error } = useData<Load[]>(
    endPoints.constructions.loads.all(slug),
    `construction-${slug}-loads`,
    { enabled: !!slug }
  );

  const loadsWithActions =
    data?.map((load) => ({
      ...load,
      openSheet: (load: Load) => {
        setSelectedLoad(load);
        setSheetOpen(true);
      },
    })) ?? [];

  if (isLoading || isLoadingBuilding) {
    return (
      <section className="h-screen flex justify-center items-center">
        <ClipLoader size={24} color="white" loading={true} />
      </section>
    );
  }

  return (
    <section className="">
      {building && (
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-semibold">{building.title}</h1>
            <h2 className="text-xl font-bold">Cargas registradas</h2>
          </div>

          <Button
            onClick={() => {
              setSelectedLoad(null);
              setSheetOpen(true);
            }}
          >
            <PlusIcon className="h-4 w-4" /> Nueva carga
          </Button>
        </div>
      )}


      {data && data.length > 0 ? (
        <DataTable columns={columns} data={loadsWithActions} />
      ) : (
        !isLoading && <p>No se encontraron cargas registradas.</p>
      )}

      {/* SHEET */}
      <LoadSheet
        load={selectedLoad}
        constructionId={String(building?.id)}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </section>
  );
}
