"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Load } from "@/interfaces/load";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, EyeIcon } from "lucide-react";

export type LoadWithActions = Load & {
    openSheet: (load: Load) => void;
};

export const columns: ColumnDef<LoadWithActions>[] = [
    // Fecha
    {
        accessorKey: "date",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Fecha
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) =>
            new Date(row.original.date).toLocaleDateString("es-AR"),
    },

    // Notas
    {
        accessorKey: "notes",
        header: "Notas",
        cell: ({ row }) => (
            <div className="max-w-90 line-clamp-1 w-full">
                {row.original.notes || "-"}
            </div>
        ),
    },

    // Tareas
    {
        id: "tasks_count",
        header: "Tareas",
        cell: ({ row }) => row.original.tasks?.length ?? 0,
    },

    // Asignaciones
    {
        id: "employee_hours_count",
        header: "Asignaciones",
        cell: ({ row }) => row.original.employee_hours?.length ?? 0,
    },

    // Acciones
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => row.original.openSheet(row.original)}
            >
                <EyeIcon />
            </Button>
        ),
    },
];
