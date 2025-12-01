"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useData } from "@/hooks/useData";
import endPoints from "@/services/endpoints";

import { Construction } from "@/interfaces/construction";
import { Employee } from "@/interfaces/employee";
import { Load } from "@/interfaces/load";

import LoadForm from "@/components/forms/load-form";
import { ClipLoader } from "react-spinners";

export default function LoadSheet({
    load,
    constructionId,
    open,
    onOpenChange,
}: {
    load: Load | null;
    constructionId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data: construction, isLoading: loadingConstruction } = useData<Construction>(
        endPoints.constructions.getOne(constructionId),
        `construction-${constructionId}`,
        { enabled: !!constructionId }
    );

    const { data: employees, isLoading: loadingEmployees } = useData<Employee[]>(
        endPoints.employees.get,
        "employees",
    );


    const isLoading = loadingConstruction || loadingEmployees;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[600px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{load ? "Editar Carga" : "Nueva Carga"}</SheetTitle>
                </SheetHeader>

                {isLoading && (
                    <div className="h-[400px] flex items-center justify-center">
                        <ClipLoader size={32} color="white" />
                    </div>
                )}

                {!isLoading && construction && employees && (
                    <LoadForm
                        load={load || undefined}
                        construction={construction}
                        employees={employees}
                        onClose={() => onOpenChange(false)}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
}
